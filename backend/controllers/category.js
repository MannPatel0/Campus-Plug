const db = require("../utils/database");

exports.getAllCategoriesWithPagination = async (req, res) => {
  const limit = +req.query?.limit;
  const page = +req.query?.page;
  const offset = (page - 1) * limit;
  try {
    const [data, _] = await db.execute(
      "SELECT * FROM Category C ORDER BY C.CategoryID ASC LIMIT ? OFFSET ?",
      [limit.toString(), offset.toString()],
    );

    const [result] = await db.execute("SELECT COUNT(*) AS count FROM Category");
    const { count: total } = result[0];
    return res.json({ data, total });
  } catch (error) {
    res.json({ error: "Cannot fetch categories from database!" });
  }
};

exports.addCategory = async (req, res) => {
  const { name } = req.body;

  try {
    const [result] = await db.execute(
      "INSERT INTO Category (Name) VALUES (?)",
      [name],
    );
    res.json({ message: "Adding new category successfully!" });
  } catch (error) {
    res.json({ error: "Cannot add new category!" });
  }
};

exports.removeCategory = async (req, res) => {
  const { id } = req.params;

  try {
    const [result] = await db.execute(
      `DELETE FROM Category WHERE CategoryID = ?`,
      [id],
    );
    res.json({ message: "Delete category successfully!" });
  } catch (error) {
    res.json({ error: "Cannot remove category from database!" });
  }
};

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
