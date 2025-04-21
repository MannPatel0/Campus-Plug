import { FaArrowLeft } from "react-icons/fa";

export default function DashboardNav({ handleCloseAdminDashboard }) {
  return (
    <div className="w-48 min-w-[12rem] bg-gray-100 text-emerald-600 flex flex-col p-4 shadow-md">
      <button
        onClick={handleCloseAdminDashboard}
        className="flex items-center gap-2 text-sm font-medium hover:text-emerald-700 underline underline-offset-4 transition"
      >
        <FaArrowLeft className="text-xs mt-[1px]" />
        Back to User Page
      </button>
    </div>
  );
}
