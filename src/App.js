import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import PrivateRoute from "./routes/PrivateRoute";
import HomePage from "./pages/Home";
import LoginPage from "./pages/Auth/Login";
import RegisterPage from "./pages/Auth/Register";
import ProductCreatePage from "./pages/Product/CreateProduct";
import ProductEditPage from "./pages/Product/EditProduct";
import CartPage from "./pages/Cart";
import CheckoutPage from "./pages/Order/ProductCheckout";
import OrdersPage from "./pages/Order/OrderList";
import SellerOrdersPage from "./pages/Order/SellerOrders";
import ProfilePage from "./pages/User/UserProfile";
import UnauthorizedPage from "./pages/Unauthorized";
import Navbar from "./components/Common/Navbar";
import ProductListPage from "./pages/Product/ProductList";
import { AuthProvider } from "./context/AuthContext";
import ProductDetail from "./pages/Product/ProductDetail";

function App() {
  return (
    <AuthProvider>
      <Navbar />
      <div className="container mx-auto">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/products" element={<ProductListPage />} />
          <Route path="/products/:id" element={<ProductDetail />} />

          <Route element={<PrivateRoute />}>
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/cart" element={<CartPage />} />
            <Route path="/checkout/:id " element={<CheckoutPage />} />
            <Route path="/orders" element={<OrdersPage />} />
          </Route>

          <Route element={<PrivateRoute allowedRoles={["seller"]} />}>
            <Route path="/products/create" element={<ProductCreatePage />} />
            <Route path="/products/edit/:id" element={<ProductEditPage />} />
            <Route path="/seller/orders" element={<SellerOrdersPage />} />
          </Route>

          <Route path="/unauthorized" element={<UnauthorizedPage />} />
        </Routes>
      </div>
      <ToastContainer />
    </AuthProvider>
  );
}

export default App;
