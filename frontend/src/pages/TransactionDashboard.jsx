import { useEffect, useState } from "react";
import { getTransactions, removeTransaction } from "../api/admin";
import { MdDelete } from "react-icons/md";
import Pagination from "../components/Pagination";

export default function TransactionDashboard() {
  const [transactions, setTransactions] = useState([]);
  const [total, setTotal] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);

  let pageLimit = 10;

  const onChangePage = (page, limit = 10) => {
    setCurrentPage(page);
    fetchTransactions(page, limit);
  };

  const fetchTransactions = (page = 1, limit = 10) => {
    getTransactions(page, limit).then(({ transactions, total }) => {
      setTotal(total);
      setTransactions(transactions);
    });
  };

  const handleRemoveTransaction = (id) => {
    removeTransaction(id)
      .then(() => {
        fetchTransactions(currentPage);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  //Get user when initialize the component
  useEffect(fetchTransactions, []);

  return (
    <div className="pt-10 p-20">
      <h1 className="text-4xl pb-3 font-bold text-green-800 underline">
        TRANSACTIONS
      </h1>
      {transactions.length > 0 ? (
        <>
          <table className="table-fixed w-full text-center border border-green-600">
            <thead className="bg-green-600 h-10">
              <tr>
                <th>TransactionID</th>
                <th>User</th>
                <th>Product</th>
                <th>Date</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {transactions.map((t) => (
                <tr
                  key={t.TransactionID}
                  className="border border-green-600 h-10"
                >
                  <td>{t.TransactionID}</td>
                  <td>{t.UserName ? t.UserName : "N/A"}</td>
                  <td>{t.ProductName ? t.ProductName : "N/A"}</td>
                  <td>{t.Date}</td>
                  <td>{t.PaymentStatus}</td>
                  <td className="flex justify-center pt-2">
                    <MdDelete
                      onClick={() => {
                        handleRemoveTransaction(t.TransactionID);
                      }}
                      className="hover:text-red-600 cursor-pointer transition-all text-xl"
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <Pagination
            onChange={onChangePage}
            pageNum={Math.ceil(total / pageLimit)}
          />
        </>
      ) : (
        <p className="text-red-700 text-xl bg-red-200 px-3 rounded-md py-1 w-fit">
          No transaction exists!
        </p>
      )}
    </div>
  );
}
