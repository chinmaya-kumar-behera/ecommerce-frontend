import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import toast from "react-hot-toast";
import { TOAST_PROPS } from "../../constant";
import { FiShoppingCart } from "react-icons/fi";

const Navbar = () => {
  const { user, isAuthenticated, logout, isSeller } = useAuth();

  const handleLogout = () => {
    logout();
    toast.error("Logged Out", TOAST_PROPS.error);
  };

  return (
    <nav className="bg-blue-600 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <Link to="/" className="text-xl font-bold hover:text-blue-200">
            E-Commerce
          </Link>

          <div className="flex items-center space-x-4">
            {isAuthenticated() && (
              <>
                <Link
                  to="/cart"
                  className="relative hover:text-blue-200 transition duration-150"
                >
                  <FiShoppingCart className="text-xl" />
                  <span className="absolute -top-2 -right-2 text-xs bg-red-500 text-white rounded-full px-1">
                    0
                  </span>
                </Link>

                {isSeller() && (
                  <Link
                    to="/seller/orders"
                    className="hover:text-blue-200 transition duration-150"
                  >
                    Seller Dashboard
                  </Link>
                )}

                <Link
                  to="/profile"
                  className="hover:text-blue-200 transition duration-150"
                >
                  Profile
                </Link>

                <button
                  onClick={handleLogout}
                  className="hover:text-blue-200 transition duration-150"
                >
                  Logout
                </button>
              </>
            )}

            {!isAuthenticated() && (
              <>
                <Link
                  to="/login"
                  className="hover:text-blue-200 transition duration-150"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="hover:text-blue-200 transition duration-150"
                >
                  Register
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
