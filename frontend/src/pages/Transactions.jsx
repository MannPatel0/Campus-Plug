import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Calendar, CreditCard, Trash2 } from "lucide-react";
import FloatingAlert from "../components/FloatingAlert"; // adjust path if needed

const Transactions = () => {
  const [transactions, setTransactions] = useState([]);
  const [showAlert, setShowAlert] = useState(false);
  const storedUser = JSON.parse(sessionStorage.getItem("user"));

  function reloadPage() {
    const docTimestamp = new Date(performance.timing.domLoading).getTime();
    const now = Date.now();
    if (now > docTimestamp) {
      location.reload();
    }
  }

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const response = await fetch(
          "http://localhost:3030/api/transaction/getTransactionsByUser",
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ userID: storedUser.ID }),
          },
        );
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        const { transactions: txData } = await response.json();
        if (!Array.isArray(txData)) return;

        console.log(txData);

        setTransactions(
          txData.map((tx) => ({
            id: tx.TransactionID,
            productId: tx.ProductID,
            name: tx.ProductName,
            price: tx.Price != null ? parseFloat(tx.Price) : null,
            image: tx.Image_URL,
            date: tx.Date,
            status: tx.PaymentStatus,
          })),
        );
      } catch (error) {
        console.error("Failed to fetch transactions:", error);
      }
    };

    fetchTransactions();
  }, []);

  const deleteTransaction = async (id) => {
    try {
      const res = await fetch(
        "http://localhost:3030/api/transaction/deleteTransaction",
        {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ transactionID: id }),
        },
      );
      const data = await res.json();
      if (data.success) {
        setTransactions((prev) => prev.filter((tx) => tx.id !== id));
        reloadPage();
      } else {
        console.error("Delete failed:", data.message);
      }
    } catch (err) {
      console.error("Error deleting transaction:", err);
    }
  };

  const updateTransaction = async (id) => {
    try {
      const res = await fetch(
        "http://localhost:3030/api/transaction/updateStatus",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ transactionID: id }),
        },
      );
      const data = await res.json();
      if (data) {
        setShowAlert(true);
        reloadPage();
      }
    } catch (err) {
      console.error("Error deleting transaction:", err);
    }
  };

  const formatDate = (dateString) => {
    const d = new Date(dateString);
    return d.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <div className="max-w-6xl mx-auto">
      {showAlert && (
        <FloatingAlert
          message="Status Updated"
          onClose={() => setShowAlert(false)}
        />
      )}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">My Transactions</h1>
      </div>

      {transactions.length === 0 ? (
        <div className="bg-white border border-gray-200 p-8 text-center">
          <CreditCard className="h-12 w-12 text-gray-300 mx-auto mb-4" />
          <h3 className="text-xl font-medium text-gray-700 mb-2">
            No transactions found
          </h3>
          <p className="text-gray-500 mb-4">
            Once transactions are created, they’ll appear here.
          </p>
          <Link
            to="/"
            className="inline-block bg-emerald-600 hover:bg-emerald-700 text-white font-medium py-2 px-4"
          >
            Browse Listings
          </Link>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {transactions.map((tx) => (
              <div
                key={tx.id}
                className="relative border-2 border-gray-200 overflow-hidden hover:shadow-md transition-shadow"
              >
                <div className="absolute bottom-2 right-2 flex gap-2 z-10">
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      updateTransaction(tx.id);
                    }}
                    className="text-emerald-600 hover:text-emerald-700 text-sm font-medium"
                  >
                    Complete
                  </button>
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      deleteTransaction(tx.id);
                    }}
                    className="text-red-500 hover:text-red-600"
                  >
                    <Trash2 size={20} />
                  </button>
                </div>

                <Link to={`/product/${tx.productId}`}>
                  <div className="h-48 bg-gray-200 flex items-center justify-center">
                    <img
                      src={tx.image}
                      alt={tx.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="p-4">
                    <h3 className="text-lg font-semibold text-gray-800">
                      {tx.name}
                    </h3>
                    {tx.price !== null && (
                      <p className="text-emerald-700 font-bold mt-1">
                        ${tx.price.toFixed(2)}
                      </p>
                    )}
                    <div className="flex items-center text-gray-500 text-sm mt-2">
                      <Calendar className="mr-1" size={16} />
                      {formatDate(tx.date)}
                    </div>
                    <p className="text-gray-600 text-sm mt-1">
                      Status: <span className="font-medium">{tx.status}</span>
                    </p>
                  </div>
                </Link>
              </div>
            ))}
          </div>

          <div className="mt-6 text-sm text-gray-500">
            Showing {transactions.length}{" "}
            {transactions.length === 1 ? "transaction" : "transactions"}
          </div>
        </>
      )}

      <footer className="bg-gray-800 text-white py-6 mt-12">
        <div className="border-t border-gray-700  text-center text-sm text-gray-400">
          <p>© 2025 Campus Marketplace. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default Transactions;
