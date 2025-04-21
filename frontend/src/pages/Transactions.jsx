import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Calendar, CreditCard } from "lucide-react";

const Transactions = () => {
  const [transactions, setTransactions] = useState([]);

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const response = await fetch(
          "http://localhost:3030/api/transaction/getTransactionsByUser",
          {
            method: "POST", // Use POST to send the userID
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              userID: 1, // Replace with the actual userID (e.g., from context or state)
            }),
          }
        );
  
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        const { transactions: txData } = await response.json();
  
        console.log("API Response:", txData); // Log the API response for debugging
  
        if (!Array.isArray(txData)) {
          console.error("Expected an array but got:", txData);
          return;
        }
  
        const transformed = txData.map((tx) => ({
          id: tx.TransactionID,
          productId: tx.ProductID,
          name: tx.ProductName || "Unnamed Product", // Ensure ProductName is used
          price: tx.Price != null ? parseFloat(tx.Price) : null,
          image: tx.Image_URL || "/default-image.jpg", // Ensure Image_URL is used
          date: tx.Date,
          status: tx.PaymentStatus,
        }));
  
        console.log("Transformed Data:", transformed); // Log the transformed data
  
        setTransactions(transformed);
      } catch (error) {
        console.error("Failed to fetch transactions:", error);
      }
    };
  
    fetchTransactions();
  }, []);

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
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">All Transactions</h1>
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
            className="inline-block bg-emerald-500 hover:bg-emerald-600 text-white font-medium py-2 px-4"
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
                className="border-2 border-gray-200 overflow-hidden hover:shadow-md transition-shadow"
              >
                <Link to={`/product/${tx.productId}`}>
                  <div className="h-48 bg-gray-200 flex items-center justify-center">
                    {tx.image ? (
                      <img
                        src={tx.image}
                        alt={tx.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="text-gray-400">No image</div>
                    )}
                  </div>
                  <div className="p-4">
                    <h3 className="text-lg font-semibold text-gray-800">
                      {tx.name}
                    </h3>
                    {tx.price !== null && (
                      <p className="text-emerald-600 font-bold mt-1">
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
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-4 md:mb-0">
              <h3 className="text-lg font-semibold mb-2">
                Campus Marketplace
              </h3>
              <p className="text-gray-400 text-sm">
                Your trusted university trading platform
              </p>
            </div>
            <div className="flex space-x-6">
              <div>
                <h4 className="font-medium mb-2">Quick Links</h4>
                <ul className="text-sm text-gray-400">
                  <li className="mb-1">
                    <Link to="/" className="hover:text-white transition">
                      Home
                    </Link>
                  </li>
                  <li className="mb-1">
                    <Link to="/selling" className="hover:text-white transition">
                      Sell an Item
                    </Link>
                  </li>
                  <li className="mb-1">
                    <Link
                      to="/favorites"
                      className="hover:text-white transition"
                    >
                      My Favorites
                    </Link>
                  </li>
                </ul>
              </div>
              <div>
                <h4 className="font-medium mb-2">Contact</h4>
                <ul className="text-sm text-gray-400">
                  <li className="mb-1">support@campusmarket.com</li>
                  <li className="mb-1">University of Calgary</li>
                </ul>
              </div>
            </div>
          </div>
          <div className="border-t border-gray-700 mt-6 pt-6 text-center text-sm text-gray-400">
            <p>© {new Date().getFullYear()} Campus Marketplace. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Transactions;