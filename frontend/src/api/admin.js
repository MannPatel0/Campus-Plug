// api.js

import axios from "axios";

const client = axios.create({
  baseURL: "http://localhost:3030/api",
});

// Users
export const getUsers = async (page = 1, limit = 10) => {
  try {
    const { data } = await client.get(
      `/user/getUserWithPagination?page=${page}&limit=${limit}`
    );
    return { users: data.users, total: data.total };
  } catch (error) {
    return handleError(error);
  }
};

export const removeUser = async (id) => {
  try {
    const { data } = await client.post(`/user/delete`, { userId: id });
    return { message: data.message };
  } catch (error) {
    return handleError(error);
  }
};

export const verifyIsAdmin = async (id) => {
  try {
    const { data } = await client.get(`/user/isAdmin/${id}`);
    return { isAdmin: data.isAdmin };
  } catch (error) {
    return handleError(error);
  }
};

// Products
export const getProducts = async (page = 1, limit = 10) => {
  try {
    const { data } = await client.get(
      `/product/getProductWithPagination?limit=${limit}&page=${page}`
    );
    return { products: data.products, total: data.totalProd };
  } catch (error) {
    return handleError(error);
  }
};

export const removeProduct = async (id) => {
  try {
    const { data } = await client.delete(`/product/any/${id}`);
    return { message: data.message };
  } catch (error) {
    return handleError(error);
  }
};

// Categories
export const getCategories = async (page, limit = 10) => {
  try {
    const { data } = await client.get(
      `/category/getCategories?page=${page}&limit=${limit}`
    );
    return { data: data.data, total: data.total };
  } catch (error) {
    return handleError(error);
  }
};

export const addCategory = async (name) => {
  try {
    const { data } = await client.post(`/category/addCategory`, { name });
    return { message: data.message };
  } catch (error) {
    return handleError(error);
  }
};

export const removeCategory = async (id) => {
  try {
    const { data } = await client.delete(`/category/${id}`);
    if (data.error) throw Error(data.error);
    return { message: data.message };
  } catch (error) {
    return handleError(error);
  }
};

// Transactions
export const getTransactions = async (page = 1, limit = 10) => {
  try {
    const { data } = await client.get(
      `/transaction/getTransactions?limit=${limit}&page=${page}`
    );
    return { transactions: data.data, total: data.total };
  } catch (error) {
    return handleError(error);
  }
};

export const removeTransaction = async (id) => {
  try {
    const { data } = await client.delete(`/transaction/${id}`);
    return { message: data.message };
  } catch (error) {
    return handleError(error);
  }
};

// Shared Error Handler
const handleError = (error) => {
  const { response } = error;
  if (response?.data) return response.data;
  return alert(error.message || error);
};

// Optional: export client if you want to use it elsewhere
export default client;
