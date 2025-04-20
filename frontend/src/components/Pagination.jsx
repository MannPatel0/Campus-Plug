import { useState } from "react";
import { NavLink } from "react-router-dom";

export default function Pagination({ pageNum, onChange }) {
  const [currentPage, setCurrentPage] = useState(1);

  const pages = [];
  for (let i = 1; i <= pageNum; i++) {
    pages.push(i);
  }

  const handleClick = (page) => {
    setCurrentPage(page);
    onChange(page);
  };

  const handleTogglePage = (type) => {
    let current = currentPage;
    if (type == "next")
      current = current + 1 <= pageNum ? current + 1 : current;
    else current = current - 1 >= 1 ? current - 1 : current;
    setCurrentPage(current);
    onChange(current);
  };

  return (
    <>
      <nav aria-label="Page navigation" className="flex justify-end">
        <ul className="flex items-center -space-x-px h-8 text-sm mt-4 pr-0 font-bold">
          <li>
            <NavLink
              onClick={() => {
                handleTogglePage("previous");
              }}
              className=" flex items-center justify-center px-3 h-8 ms-0 leading-tight border-e-0 border-gray-300 rounded-s-lg hover:bg-gray-100 text-white bg-green-700 border border-gray-300 hover:bg-green-600 hover:text-white"
            >
              <span className="sr-only">Previous</span>
              <svg
                className="w-2.5 h-2.5 rtl:rotate-180"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 6 10"
              >
                <path
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M5 1 1 5l4 4"
                />
              </svg>
            </NavLink>
          </li>
          {pages.map((page) => (
            <li key={page}>
              <NavLink
                className={`${
                  currentPage == page ? "bg-green-600" : "bg-green-700"
                } +
                  " flex items-center justify-center px-3 h-8 leading-tight text-white  border border-gray-300 hover:bg-green-600 hover:text-white"`}
                onClick={() => {
                  handleClick(page);
                }}
              >
                {page}
              </NavLink>
            </li>
          ))}
          <li>
            <NavLink
              onClick={() => {
                handleTogglePage("next");
              }}
              className="flex items-center justify-center px-3 h-8 leading-tight border border-gray-300 rounded-e-lg text-white bg-green-700 border border-gray-300 hover:bg-green-600 hover:text-white"
            >
              <span className="sr-only">Next</span>
              <svg
                className="w-2.5 h-2.5 rtl:rotate-180"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 6 10"
              >
                <path
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="m1 9 4-4-4-4"
                />
              </svg>
            </NavLink>
          </li>
        </ul>
      </nav>
    </>
  );
}
