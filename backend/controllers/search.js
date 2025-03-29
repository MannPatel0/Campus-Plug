const db = require("../utils/database");

exports.searchProductsByName = async (req, res) => {
  const { name } = req.query;

  if (name.length === 0) {
    console.log("Searching for products with no name", name);
  }

  console.log("Searching for products with name:", name);

  try {
    // Modify SQL to return all products when no search term is provided
    const sql = `
      SELECT p.*, i.URL as image
      FROM Product p
      LEFT JOIN Image_URL i ON p.ProductID = i.ProductID
      ${name ? "WHERE p.Name LIKE ?" : ""}
      ORDER BY p.ProductID
    `;

    const params = name ? [`%${name}%`] : [];
    console.log("Executing SQL:", sql);
    console.log("With parameters:", params);

    const [data] = await db.execute(sql, params);

    console.log("Raw Database Result:", data);

    if (data.length === 0) {
      console.log("No products found matching:", name);
      return res.status(404).json({
        success: false,
        message: "No products found matching your search",
      });
    }

    // Group products by ProductID to handle multiple images per product
    const productsMap = new Map();

    data.forEach((row) => {
      if (!productsMap.has(row.ProductID)) {
        const product = {
          ProductID: row.ProductID,
          Name: row.Name,
          Description: row.Description,
          Price: row.Price,
          images: row.image,
        };
        productsMap.set(row.ProductID, product);
      } else if (row.image_url) {
        productsMap.get(row.ProductID).images.push(row.image_url);
      }
    });

    const products = Array.from(productsMap.values());

    console.log("Processed Products:", products);

    res.json({
      success: true,
      message: "Products fetched successfully",
      data: products,
      count: products.length,
    });
  } catch (error) {
    console.error("Database Error:", error);
    return res.status(500).json({
      success: false,
      message: "Database error occurred",
      error: error.message || "Unknown database error",
    });
  }
};

// exports.searchProductsByName = async (req, res) => {
//   const { name } = req.query;

//   // Add better validation and error handling
//   if (!name || typeof name !== "string") {
//     return res.status(400).json({
//       success: false,
//       message: "Valid search term is required",
//     });
//   }

//   console.log("Searching for products with name:", name);

//   try {
//     // Log the SQL query and parameters for debugging
//     const sql = `
//       SELECT p.*, i.URL AS image_url
//       FROM Product p
//       LEFT JOIN Image_URL i ON p.ProductID = i.ProductID
//       WHERE p.Name LIKE ?
//     `;
//     const params = [`%${name}%`];
//     console.log("Executing SQL:", sql);
//     console.log("With parameters:", params);

//     const [data] = await db.execute(sql, params);

//     // Log raw data for debugging
//     console.log("Raw Database Result:", data);

//     if (data.length === 0) {
//       console.log("No products found matching:", name);
//       return res.status(404).json({
//         success: false,
//         message: "No products found matching your search",
//       });
//     }

//     // Group products by ProductID to handle multiple images per product
//     const productsMap = new Map();

//     data.forEach((row) => {
//       if (!productsMap.has(row.ProductID)) {
//         // Create a clean object without circular references
//         const product = {
//           ProductID: row.ProductID,
//           Name: row.Name,
//           Description: row.Description,
//           Price: row.Price,
//           // Add any other product fields you need
//           images: row.image_url ? [row.image_url] : [],
//         };
//         productsMap.set(row.ProductID, product);
//       } else if (row.image_url) {
//         // Add additional image to existing product
//         productsMap.get(row.ProductID).images.push(row.image_url);
//       }
//     });

//     // Convert map to array of products
//     const products = Array.from(productsMap.values());

//     // Log processed products for debugging
//     console.log("Processed Products:", products);

//     res.json({
//       success: true,
//       message: "Products fetched successfully",
//       data: products,
//       count: products.length,
//     });
//   } catch (error) {
//     // Enhanced error logging
//     console.error("Database Error Details:", {
//       message: error.message,
//       code: error.code,
//       errno: error.errno,
//       sqlState: error.sqlState,
//       sqlMessage: error.sqlMessage,
//       sql: error.sql,
//     });

//     return res.status(500).json({
//       success: false,
//       message: "Database error occurred",
//       error: error.message || "Unknown database error",
//     });
//   }
// };
