import { useState } from "react";
import { MdAddBox } from "react-icons/md";
import { addCategory } from "../api/admin";

export default function CategoryForm({ visible, onAddCategory }) {
  const [category, setCategory] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!category.trim()) {
      document.getElementById("noti").innerHTML = "Category name is missing!";
      document
        .getElementById("noti")
        .classList.add("bg-red-200", "text-red-500");
      document.getElementById("noti").classList.remove("opacity-0");
      return;
    }
    addCategory(category)
      .then((message) => {
        document
          .getElementById("noti")
          .classList.remove("opacity-0", "bg-red-200", "text-red-500");
        document
          .getElementById("noti")
          .classList.add("bg-green-200", "text-green-800");
        document.getElementById("noti").innerHTML = `${message.message}`;
        setCategory("");
        onAddCategory();
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const handleChange = ({ target }) => {
    setCategory(target.value);
    if (target.value.trim())
      document.getElementById("noti").classList.add("opacity-0");
  };

  if (!visible) return;

  return (
    <form onSubmit={handleSubmit} action="" className="flex p-2 items-center">
      <label htmlFor="category" className="text-green-700">
        Category:
      </label>
      <input
        type="text"
        className="border border-green-700 ml-2 rounded-sm focus:bg-green-100 text-green-900"
        name="category"
        id="category"
        onChange={handleChange}
        value={category}
      />
      <button type="submit" className="text-2xl pl-1 text-green-700">
        <MdAddBox className="text-3xl" />
      </button>
      <p
        id="noti"
        className="text-red-500 bg-red-200 px-2 rounded-sm opacity-0 mx-2"
      ></p>
    </form>
  );
}
