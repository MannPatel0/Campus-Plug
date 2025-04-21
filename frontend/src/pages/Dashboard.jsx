import { useEffect, useState, useCallback } from "react";
import {
  getUsers,
  removeUser,
  getTransactions,
  removeTransaction,
  getProducts,
  removeProduct,
  getCategories,
  removeCategory,
} from "../api/admin";
import { MdDelete } from "react-icons/md";
import { IoAddCircleSharp } from "react-icons/io5";
import { FaHome } from "react-icons/fa";
import Pagination from "../components/Pagination";
import CategoryForm from "../components/CategoryForm";
import DashboardNav from "../components/DashboardNav";
import { useNavigate } from "react-router-dom";

// Spinner Component
const Spinner = () => (
  <div className="flex justify-center items-center h-40 w-full">
    <div className="w-12 h-12 border-4 border-green-500 border-dashed rounded-full animate-spin"></div>
  </div>
);

// Empty State Component
const EmptyState = () => (
  <div className="flex flex-col items-center justify-center bg-gray-50 py-10 rounded-lg w-full">
    <svg
      className="w-16 h-16 text-gray-400"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
        d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
      ></path>
    </svg>
    <p className="mt-4 text-lg font-medium text-gray-600">No data found</p>
    <p className="mt-1 text-sm text-gray-500">
      No records are currently available.
    </p>
  </div>
);

// Generic Dashboard Component
const Dashboard = ({
  fetchDataFn,
  deleteFn,
  columns,
  idKey,
  refreshKey = 0,
  headerAction = null,
}) => {
  const navigate = useNavigate();
  const [items, setItems] = useState([]);
  const [total, setTotal] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const pageLimit = 10;

  const fetchItems = useCallback(
    (page = 1, limit = 10) => {
      setLoading(true);
      fetchDataFn(page, limit)
        .then((res) => {
          const data =
            res.users || res.products || res.transactions || res.data || [];
          setItems(data);
          setTotal(res.total);
        })
        .catch((error) => {
          console.error("Error fetching data:", error);
          setItems([]);
          setTotal(0);
        })
        .finally(() => setLoading(false));
    },
    [fetchDataFn],
  );

  const handleRemove = (id) => {
    if (window.confirm("Are you sure you want to delete this item?")) {
      setLoading(true);
      deleteFn(id)
        .then(() => fetchItems(currentPage))
        .catch((error) => {
          console.error("Error removing item:", error);
          setLoading(false);
        });
    }
  };

  useEffect(() => {
    fetchItems(currentPage);
  }, [fetchItems, currentPage, refreshKey]);

  const onChangePage = (page) => {
    setCurrentPage(page);
  };

  if (loading) return <Spinner />;

  return (
    <div className="w-full mt-6">
      <div className="flex flex-col md:flex-row justify-between items-center mb-4 w-full">
        <h2 className="text-xl font-semibold text-gray-700 mb-2 md:mb-0">
          Total: <span className="text-green-600">{total}</span>
        </h2>
        {headerAction && <div>{headerAction}</div>}
      </div>

      {items.length > 0 ? (
        <div className="w-full overflow-x-auto bg-white rounded-lg shadow">
          <table className="min-w-full divide-y divide-gray-200 table-fixed">
            <thead className="bg-green-600">
              <tr>
                {columns.map((col) => (
                  <th
                    key={col.label}
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider"
                  >
                    {col.label}
                  </th>
                ))}
                <th
                  scope="col"
                  className="px-6 py-3 text-center text-xs font-medium text-white uppercase tracking-wider w-20"
                >
                  Action
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {items.map((item) => (
                <tr
                  key={item[idKey]}
                  className="hover:bg-gray-50 transition-colors"
                >
                  {columns.map((col) => (
                    <td
                      key={`${item[idKey]}-${col.key}`}
                      className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 overflow-hidden text-ellipsis"
                    >
                      {item[col.key] || "—"}
                    </td>
                  ))}
                  <td className="px-6 py-4 whitespace-nowrap text-center text-sm font-medium">
                    <button
                      onClick={() => handleRemove(item[idKey])}
                      className="text-red-500 hover:text-red-700 transition-colors"
                      title="Delete"
                    >
                      <MdDelete size={20} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <EmptyState />
      )}

      {total > pageLimit && (
        <div className="mt-4 w-full">
          <Pagination
            pageNum={Math.ceil(total / pageLimit)}
            onChange={onChangePage}
          />
        </div>
      )}
    </div>
  );
};

// Main Admin Tabs
export default function AdminDashboardTabs() {
  const [activeTab, setActiveTab] = useState(0);
  const [tabData, setTabData] = useState({
    users: { loaded: false, data: null },
    products: { loaded: false, data: null },
    transactions: { loaded: false, data: null },
    categories: { loaded: false, data: null },
  });

  const [visible, setVisible] = useState(false);
  const [categoryRefreshKey, setCategoryRefreshKey] = useState(0);
  const toggleForm = () => setVisible((v) => !v);

  // Preload all tab data
  useEffect(() => {
    const tabKeys = ["users", "products", "transactions", "categories"];
    const loadTabData = async (index) => {
      if (index === tabKeys.length) return;

      setTabData((prev) => ({
        ...prev,
        [tabKeys[index]]: { ...prev[tabKeys[index]], loaded: true },
      }));

      // Load next tab after a short delay
      setTimeout(() => loadTabData(index + 1), 100);
    };

    loadTabData(0);
  }, []);

  const tabs = [
    {
      title: "Users",
      icon: "👥",
      key: "users",
      component: () => (
        <Dashboard
          fetchDataFn={getUsers}
          deleteFn={removeUser}
          idKey="UserID"
          columns={[
            { label: "ID", key: "UserID" },
            { label: "UCID", key: "UCID" },
            { label: "Name", key: "Name" },
            { label: "Email", key: "Email" },
            { label: "Phone", key: "Phone" },
            { label: "Address", key: "Address" },
          ]}
        />
      ),
    },
    {
      title: "Products",
      icon: "📦",
      key: "products",
      component: () => (
        <Dashboard
          fetchDataFn={getProducts}
          deleteFn={removeProduct}
          idKey="ProductID"
          columns={[
            { label: "ID", key: "ProductID" },
            { label: "Name", key: "ProductName" },
            { label: "Price", key: "Price" },
            { label: "Category", key: "Category" },
            { label: "Seller", key: "SellerName" },
          ]}
        />
      ),
    },
    {
      title: "Transactions",
      icon: "💰",
      key: "transactions",
      component: () => (
        <Dashboard
          fetchDataFn={getTransactions}
          deleteFn={removeTransaction}
          idKey="TransactionID"
          columns={[
            { label: "ID", key: "TransactionID" },
            { label: "User", key: "UserName" },
            { label: "Product", key: "ProductName" },
            { label: "Date", key: "Date" },
            { label: "Status", key: "PaymentStatus" },
          ]}
        />
      ),
    },
    {
      title: "Categories",
      icon: "🏷️",
      key: "categories",
      component: () => (
        <>
          <Dashboard
            fetchDataFn={getCategories}
            deleteFn={removeCategory}
            idKey="CategoryID"
            columns={[
              { label: "ID", key: "CategoryID" },
              { label: "Name", key: "Name" },
            ]}
            refreshKey={categoryRefreshKey}
            headerAction={
              <button
                onClick={toggleForm}
                className="flex items-center bg-green-500 rounded-md px-4 py-2 text-white text-sm hover:bg-green-600 transition-colors font-medium shadow"
              >
                <IoAddCircleSharp className="mr-1" size={18} />
                Add Category
              </button>
            }
          />
          <CategoryForm
            visible={visible}
            onAddCategory={() => {
              setCategoryRefreshKey((prev) => prev + 1);
              toggleForm();
            }}
          />
        </>
      ),
    },
  ];

  return (
    <div className="w-full min-h-screen bg-gray-50">
      <div className="w-full px-4 py-8">
        <div className="mb-8 flex justify-between items-center w-full">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-800">
            Admin Dashboard
          </h1>
        </div>

        {/* Mobile Tabs */}
        <div className="md:hidden w-full mb-4">
          <select
            className="w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring focus:ring-green-500 focus:ring-opacity-50 p-2"
            value={activeTab}
            onChange={(e) => setActiveTab(parseInt(e.target.value))}
          >
            {tabs.map((tab, index) => (
              <option key={tab.key} value={index}>
                {tab.icon} {tab.title}
              </option>
            ))}
          </select>
        </div>

        {/* Desktop Tabs */}
        <div className="hidden md:flex space-x-1 border-b border-gray-200 w-full overflow-x-auto">
          {tabs.map((tab, index) => (
            <button
              key={tab.key}
              className={`px-6 py-3 font-medium text-sm rounded-t-lg transition-colors ${
                index === activeTab
                  ? "text-green-700 bg-white border-l border-t border-r border-gray-200 border-b-0"
                  : "text-gray-600 hover:text-green-700 bg-gray-50"
              }`}
              onClick={() => setActiveTab(index)}
            >
              <span className="inline-block mr-2">{tab.icon}</span>
              {tab.title}
            </button>
          ))}
        </div>

        <div className="bg-white p-4 md:p-6 rounded-lg shadow-sm border border-gray-200 mt-4 w-full">
          <div className="w-full">
            {tabData[tabs[activeTab].key].loaded && tabs[activeTab].component()}
          </div>
        </div>
      </div>
    </div>
  );
}
