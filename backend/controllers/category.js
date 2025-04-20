const db = require("../utils/database");

exports.getAllCategory = async (req, res) => {
  try {
    const [data, fields] = await db.execute(`SELECT * FROM Category`);

    const formattedData = {};
    data.forEach((row) => {
      formattedData[row.CategoryID] = row.Name;
    });

    res.json({
      success: true,
      message: "Categories fetched successfully",
      data: formattedData,
    });
  } catch (error) {
    console.error("Error fetching categories:", error);
    return res.status(500).json({
      success: false,
      error: "Database error occurred",
    });
  }
};
