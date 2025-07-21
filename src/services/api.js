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

export const addToCart = (cartData) => api.post("/cart", cartData);
export const getCartItems = () => api.get("/cart/items");

export const createOrder = (orderData) => api.post("/order", orderData);

export const getOrders = (orderData) => api.post("/order", orderData);
export const getProduct = (orderData) => api.post("/order", orderData);

export default api;
