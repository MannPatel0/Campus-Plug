const db = require("../utils/database");

exports.getTransactionWithPagination = async (req, res) => {
  const limit = +req.query?.limit;
  const page = +req.query?.page;
  const offset = (page - 1) * limit;
  try {
    const [data, _] = await db.execute(
      `SELECT T.TransactionID, DATE_FORMAT(T.Date, '%b-%d-%Y %h:%i %p') as Date, T.PaymentStatus, U.Name as UserName, P.Name as ProductName 
			      FROM Transaction T
			      LEFT JOIN User U ON T.UserID = U.UserID
            LEFT JOIN Product P ON T.ProductID = P.ProductID
            ORDER BY T.TransactionID ASC LIMIT ? OFFSET ?`,
      [limit.toString(), offset.toString()]
    );

    const [result] = await db.execute(
      "SELECT COUNT(*) AS count FROM Transaction"
    );
    const { count: total } = result[0];
    return res.json({ data, total });
  } catch (error) {
    res.json({ error: "Cannot fetch transactions from database!" });
  }
};

exports.removeTransation = async (req, res) => {
  const { id } = req.params;
  try {
    const [result] = await db.execute(
      "DELETE FROM Transaction WHERE TransactionID = ?;",
      [id.toString()]
    );
    return res.json({ message: "Remove transaction successfully!" });
  } catch (error) {
    return res
      .status(500)
      .json({ error: "Cannot remove transactions from database!" });
  }
};
