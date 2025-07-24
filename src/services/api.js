import axios from "axios";
import { useAuth } from "../context/AuthContext";

const API_BASE_URL = "http://localhost:5000/api";

const api = axios.create({
  baseURL: API_BASE_URL,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const registerUser = (userData) => api.post("/user/register", userData);
export const loginUser = (credentials) => api.post("/user/login", credentials);
export const getUserProfile = () => api.get("/user/get");
export const updateUserProfile = (userId, userData) =>
  api.put(`/user/update/${userId}`, userData);

export const getProducts = (queryParams) =>
  api.get("/product", { params: queryParams });
export const createProduct = (productData) => api.post("/product", productData);
export const updateProduct = (productId, productData) =>
  api.put(`/product/${productId}`, productData);
export const getSellerOrders = () => api.get("/product/seller");


export const createOrder = (orderData) => api.post("/order", orderData);

export const getOrders = (orderData) => api.get("/orders");
export const getProductById = (productId) => api.get(`/product/${productId}`);

// cart services
export const addToCart = (cartData) => api.post("/cart", cartData);
export const getCartItems = () => api.get("/cart/items");

// services/api.js

export const getReviewsByProductId = async (productId) => {
  const response = await axios.get(`/api/reviews/product/${productId}`);
  return response;
};

export const addReview = async (productId, reviewData) => {
  const response = await axios.post(`/api/reviews/product/${productId}`, reviewData, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem('token')}`,
    },
  });
  return response;
};

export default api;
