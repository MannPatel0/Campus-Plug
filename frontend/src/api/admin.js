import client from "./client";

export const getUsers = async (page, limit = 10) => {
  try {
    const { data } = await client.get(
      `/user/getUserWithPagination?page=${page}&limit=${limit}`
    );
    return { users: data.users, total: data.total };
  } catch (error) {
    const { response } = error;
    if (response?.data) return response.data;
    return { error: error.message || error };
  }
};

export const getProducts = async (page, limit = 10) => {
  try {
    const { data } = await client.get(
      `/product/getProductWithPagination?limit=${limit}&page=${page}`
    );

    return { products: data.products, total: data.totalProd };
  } catch (error) {
    const { response } = error;
    if (response?.data) return response.data;
    return { error: error.message || error };
  }
};

export const getCategories = async (page, limit = 10) => {
  try {
    const { data } = await client.get(
      `/category/getCategories?page=${page}&limit=${limit}`
    );
    return { data: data.data, total: data.total };
  } catch (error) {
    const { response } = error;
    if (response?.data) return response.data;
    return { error: error.message || error };
  }
};

export const addCategory = async (name) => {
  try {
    const { data } = await client.post(`/category/addCategory`, { name: name });
    return { message: data.message };
  } catch (error) {
    const { response } = error;
    if (response?.data) return response.data;
    return { error: error.message || error };
  }
};

export const removeCategory = async (id) => {
  try {
    const { data } = await client.delete(`/category/${id}`);
    return { message: data.message };
  } catch (error) {
    const { response } = error;
    if (response?.data) return response.data;
    return { error: error.message || error };
  }
};

export const removeUser = async (id) => {
  try {
    const { data } = await client.post(`/user/delete`, { userId: id });
    return { message: data.message };
  } catch (error) {
    const { response } = error;
    if (response?.data) return response.data;
    return { error: error.message || error };
  }
};

export const removeProduct = async (id) => {
  try {
    const { data } = await client.delete(`/product/${id}`);
    return { message: data.message };
  } catch (error) {
    const { response } = error;
    if (response?.data) return response.data;
    return { error: error.message || error };
  }
};

export const verifyIsAdmin = async (id) => {
  try {
    const { data } = await client.get(`/user/isAdmin/${id}`);
    return { isAdmin: data.isAdmin };
  } catch (error) {
    const { response } = error;
    if (response?.data) return response.data;
    return { error: error.message || error };
  }
};
