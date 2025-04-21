import { useEffect, useState } from "react";
import { getUsers, removeUser } from "../api/admin";
import { MdDelete } from "react-icons/md";
import Pagination from "../components/Pagination";

export default function UserDashboard() {
  const [users, setUsers] = useState([]);
  const [total, setTotal] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);

  let pageLimit = 10;

  const onChangePage = (page, limit = 10) => {
    setCurrentPage(page);
    fetchUsers(page, limit);
  };

  const fetchUsers = (page = 1, limit = 10) => {
    getUsers(page, limit).then(({ users, total }) => {
      setUsers(users);
      setTotal(total);
    });
  };

  const handleRemoveUser = (id) => {
    removeUser(id)
      .then((res) => {
        fetchUsers(currentPage);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  //Get user when initialize the component
  useEffect(fetchUsers, []);

  return (
    <div className="pt-10 p-20">
      <h1 className="text-4xl pb-3 font-bold text-green-800 underline">
        USERS
      </h1>
      {users.length > 0 ? (
        <>
          {" "}
          <table className="table-fixed w-full text-center border border-green-600">
            <thead className="bg-green-600 h-10">
              <tr>
                <th>UserID</th>
                <th>UCID</th>
                <th>Name</th>
                <th>Email</th>
                <th>Phone</th>
                <th>Address</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user.UserID} className="border border-green-600 h-10">
                  <td>{user.UserID}</td>
                  <td>{user.UCID}</td>
                  <td>{user.Name}</td>
                  <td>{user.Email}</td>
                  <td>{user.Phone}</td>
                  <td>{user.Address}</td>
                  <td className="flex justify-center pt-2">
                    <MdDelete
                      onClick={() => {
                        handleRemoveUser(user.UserID);
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
        <p className="text-red-700 text-xl bg-red-200 px-3 rounded-md py-1">
          No user exists!
        </p>
      )}
    </div>
  );
}
