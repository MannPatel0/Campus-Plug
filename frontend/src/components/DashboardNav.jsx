import { Link, NavLink } from "react-router-dom";
import { FaUserTag } from "react-icons/fa";
import { FaBoxArchive } from "react-icons/fa6";
import { MdOutlineCategory } from "react-icons/md";
import { FaArrowLeft } from "react-icons/fa";
import { FaMoneyBillTransfer } from "react-icons/fa6";

export default function DashboardNav({ handleCloseAdminDashboard }) {
  const handleClick = () => {
    handleCloseAdminDashboard();
  };

  return (
    <div>
      <div className="w-3xs h-screen bg-green-700 border border-green-700">
        <ul>
          <li>
            <div className="flex-shrink-0 p-6 bg-green-200">
              <Link to="/admin" className="flex items-center">
                <img
                  src="/icon/icon-512.png"
                  alt="Campus Plug"
                  className="h-8 px-2 "
                />
                <span className="hidden md:block text-green-700 font-bold text-2xl">
                  Campus Plug
                </span>
              </Link>
            </div>
          </li>
          <li className="w-fit pl-10">
            <NavLink
              to="/admin/user"
              className={({ isActive }) =>
                (isActive
                  ? " text-green-400"
                  : "text-white transition-all hover:text-green-200") +
                " flex items-center px-5 text-lg pt-5 "
              }
            >
              <FaUserTag />
              <span className="pl-3">Users</span>
            </NavLink>
          </li>
          <li className="w-fit pl-10">
            <NavLink
              to="/admin/product"
              className={({ isActive }) =>
                (isActive
                  ? "text-green-400"
                  : "text-white transition-all hover:text-green-200") +
                " flex items-center px-5 text-lg pt-5"
              }
            >
              <FaBoxArchive />
              <span className="pl-3">Products</span>
            </NavLink>
          </li>
          <li className="w-fit pl-10">
            <NavLink
              to="/admin/category"
              className={({ isActive }) =>
                (isActive
                  ? "text-green-400"
                  : "text-white transition-all hover:text-green-200") +
                " flex items-center px-5 text-lg pt-5"
              }
            >
              <MdOutlineCategory />
              <span className="pl-3">Categories</span>
            </NavLink>
          </li>
          <li className="w-fit pl-10">
            <NavLink
              to="/admin/transaction"
              className={({ isActive }) =>
                (isActive
                  ? "text-green-400"
                  : "text-white transition-all hover:text-green-200") +
                " flex items-center px-5 text-lg pt-5"
              }
            >
              <FaMoneyBillTransfer />
              <span className="pl-3">Transaction</span>
            </NavLink>
          </li>
        </ul>
        <div
          onClick={handleClick}
          className=" text-center my-8 underline text-white underline-offset-4 flex justify-center items-center hover:cursor-pointer h-fit w-fit mx-auto hover:text-green-200 transition"
        >
          <FaArrowLeft className="text-sm mx-2 mt-1" />
          <span>Go back to user page</span>
        </div>
      </div>
    </div>
  );
}
