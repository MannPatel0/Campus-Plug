import { useEffect, useState } from "react";
import { getProducts, removeProduct } from "../api/admin";
import { MdDelete } from "react-icons/md";
import Pagination from "../components/Pagination";

export default function ProductDashboard() {
  const [products, setProducts] = useState([]);
  const [total, setTotal] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);

  let pageLimit = 10;

  const onChangePage = (page, limit = 10) => {
    setCurrentPage(page);
    fetchProducts(page, limit);
  };

  const fetchProducts = (page = 1, limit = 10) => {
    getProducts(page, limit).then(({ products, total }) => {
      setTotal(total);
      setProducts(products);
    });
  };

  const handleRemoveProduct = (id) => {
    removeProduct(id)
      .then((res) => {
        fetchProducts(currentPage);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  //Get user when initialize the component
  useEffect(fetchProducts, []);

  return (
    <div className="pt-10 p-20">
      <h1 className="text-4xl pb-3 font-bold text-green-800 underline">
        PRODUCTS
      </h1>
      {products.length > 0 ? (
        <>
          <table className="table-fixed w-full text-center border border-green-600">
            <thead className="bg-green-600 h-10">
              <tr>
                <th>ProductID</th>
                <th>Name</th>
                <th>Price</th>
                <th>Category</th>
                <th>Seller</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {products.map((product) => (
                <tr
                  key={product.ProductID}
                  className="border border-green-600 h-10"
                >
                  <td>{product.ProductID}</td>
                  <td>{product.ProductName}</td>
                  <td>{product.Price}</td>
                  <td>{product.Category ? product.Category : "N/A"}</td>
                  <td>{product.SellerName ? product.SellerName : "N/A"}</td>
                  <td className="flex justify-center pt-2">
                    <MdDelete
                      onClick={() => {
                        handleRemoveProduct(product.ProductID);
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
          No product exists!
        </p>
      )}
    </div>
  );
}
