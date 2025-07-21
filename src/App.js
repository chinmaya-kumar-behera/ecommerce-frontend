import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
// import AuthProvider from "./context/AuthContext";
import PrivateRoute from "./routes/PrivateRoute";
import HomePage from "./pages/Home";
import LoginPage from "./pages/Auth/Login";
import RegisterPage from "./pages/Auth/Register";
// import ProductListPage from "./pages/Product/List";
import ProductCreatePage from "./pages/Product/Create";
import ProductEditPage from "./pages/Product/Edit";
import CartPage from "./pages/Cart";
import CheckoutPage from "./pages/Order/Checkout";
import OrdersPage from "./pages/Order/List";
import SellerOrdersPage from "./pages/Order/SellerOrders";
import ProfilePage from "./pages/User/Profile";
import UnauthorizedPage from "./pages/Unauthorized";
import Navbar from "./components/Common/Navbar";
import ProductListPage from "./pages/Product/List";
import { AuthProvider } from "./context/AuthContext";

function App() {
  return (
    <AuthProvider>
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/products" element={<ProductListPage />} />

          <Route element={<PrivateRoute />}>
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/cart" element={<CartPage />} />
            <Route path="/checkout" element={<CheckoutPage />} />
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
