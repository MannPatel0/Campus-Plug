import { useEffect, useState } from "react";
import { getCategories, removeCategory } from "../api/admin";
import { MdDelete } from "react-icons/md";
import Pagination from "../components/Pagination";
import { IoAddCircleSharp } from "react-icons/io5";
import CategoryForm from "../components/CategoryForm";

export default function CategoryDashboard() {
  const [categories, setCategories] = useState([]);
  const [total, setTotal] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);

  let pageLimit = 10;

  const [visible, setVisible] = useState(false);

  const onChangePage = (page, limit = 10) => {
    setCurrentPage(page);
    fetchCategory(page, limit);
  };

  const fetchCategory = (page = 1, limit = 10) => {
    getCategories(page, limit).then(({ data, total }) => {
      setCategories(data);
      setTotal(total);
    });
  };

  const notiChange = () => {
    fetchCategory(currentPage);
  };

  const handleToggleForm = () => {
    setVisible((curr) => !curr);
  };

  const handleRemove = (id) => {
    removeCategory(id)
      .then(() => {
        fetchCategory(currentPage);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  //Get user when initialize the component
  useEffect(fetchCategory, []);

  return (
    <div className="pt-10 p-20 w-full">
      <h1 className="text-4xl pb-3 font-bold text-green-800 underline">
        CATEGORIES
      </h1>
      <button
        onClick={handleToggleForm}
        className="flex justify-end items-center bg-blue-500 rounded-md px-2 text-white text-sm p-1 mb-1 ml-auto hover:cursor-pointer hover:bg-blue-600 transtion"
      >
        <span className="pr-1 text-xs">Add</span>
        <IoAddCircleSharp />
      </button>
      <CategoryForm onAddCategory={notiChange} visible={visible} />
      {categories.length > 0 ? (
        <>
          <table className="table-fixed w-full text-center border border-green-600">
            <thead className="bg-green-600 h-10">
              <tr>
                <th>CategoryID</th>
                <th>Name</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {categories.map((category) => (
                <tr
                  key={category.UserID}
                  className="border border-green-600 h-10"
                >
                  <td>{category.CategoryID}</td>
                  <td>{category.Name}</td>
                  <td className="flex justify-center pt-2">
                    <MdDelete
                      onClick={() => {
                        handleRemove(category.CategoryID);
                      }}
                      className="hover:text-red-600 cursor-pointer transition-all text-xl"
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <Pagination
            pageNum={Math.ceil(total / pageLimit)}
            onChange={onChangePage}
          />
        </>
      ) : (
        <p className="text-red-700 text-xl bg-red-200 px-3 rounded-md py-1 w-fit">
          No category exists!
        </p>
      )}
    </div>
  );
}
