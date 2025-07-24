import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { addToCart } from "../../../services/api";

const ProductInfo = ({ product }) => {
  const [quantity, setQuantity] = useState(1);
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const [isPlacingOrder] = useState(false);
    const navigate = useNavigate();
  
  const discountedPrice =
    product.price - product.price * (product.discount / 100);

  const handleQuantityChange = (e) => {
    const value = parseInt(e.target.value);
    if (value > 0 && value <= (product?.stock || 1)) {
      setQuantity(value);
    }
  };

  const incrementQuantity = () => {
    if (quantity < (product?.stock || 1)) {
      setQuantity(quantity + 1);
    }
  };

  const decrementQuantity = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  };

  const handleAddToCart = async () => {
    try {
      setIsAddingToCart(true);
      const token = localStorage.getItem("token");

      if (!token) {
        navigate("/login");
        return;
      }

      const cartItem = {
        productid: product._id,
        quantity: quantity,
      };

      await addToCart({ carts: [cartItem] });
      alert("Product added to cart successfully!");
    } catch (error) {
      console.error("Error adding to cart:", error);
      alert("Failed to add product to cart. Please try again.");
    } finally {
      setIsAddingToCart(false);
    }
  };

  const handlePlaceOrder = async () => {
    navigate(`/checkout/${product._id}`);
  };

  return (
    <div className="md:w-1/2">
      <h1 className="text-3xl font-bold mb-2">{product.name}</h1>
      <div className="flex items-center mb-4">
        <div className="flex items-center">
          {[...Array(5)].map((_, i) => (
            <svg
              key={i}
              className={`w-5 h-5 ${
                i < product.ratings ? "text-yellow-400" : "text-gray-300"
              }`}
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
          ))}
        </div>
        <span className="ml-2 text-gray-600">({product.ratings}/5)</span>
      </div>

      <div className="mb-4">
        <span className="text-gray-500">Brand:</span>
        <span className="ml-2 font-medium">{product.brand}</span>
      </div>

      <div className="mb-4">
        <span className="text-gray-500">Category:</span>
        <span className="ml-2 font-medium">{product.type}</span>
      </div>

      <div className="mb-4">
        <span className="text-gray-500">Availability:</span>
        <span className="ml-2 font-medium">
          {product.stock > 0
            ? `In Stock (${product.stock} available)`
            : "Out of Stock"}
        </span>
      </div>

      <div className="mb-6">
        {product.discount > 0 && (
          <div className="flex items-center">
            <span className="text-2xl font-bold text-gray-900 mr-3">
              ₹{discountedPrice.toFixed(2)}
            </span>
            <span className="text-lg text-gray-500 line-through">
              ₹{product.price.toFixed(2)}
            </span>
            <span className="ml-2 bg-red-100 text-red-800 text-xs font-semibold px-2 py-1 rounded">
              {product.discount}% OFF
            </span>
          </div>
        )}
        {product.discount <= 0 && (
          <span className="text-2xl font-bold text-gray-900">
            ₹{product.price.toFixed(2)}
          </span>
        )}
      </div>

      <div className="mb-6">
        <label className="block text-gray-700 mb-2">Quantity:</label>
        <div className="flex items-center">
          <button
            onClick={decrementQuantity}
            disabled={quantity <= 1}
            className="bg-gray-200 px-3 py-1 rounded-l disabled:opacity-50"
          >
            -
          </button>
          <input
            type="number"
            min="1"
            max={product.stock}
            value={quantity}
            onChange={handleQuantityChange}
            className="border-t border-b border-gray-300 w-12 text-center py-1"
          />
          <button
            onClick={incrementQuantity}
            disabled={quantity >= product.stock}
            className="bg-gray-200 px-3 py-1 rounded-r disabled:opacity-50"
          >
            +
          </button>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-4">
        <button
          onClick={handleAddToCart}
          disabled={isAddingToCart || product.stock <= 0}
          className={`px-6 py-3 rounded-md font-medium ${
            product.stock <= 0
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-blue-600 hover:bg-blue-700 text-white"
          }`}
        >
          {isAddingToCart ? "Adding..." : "Add to Cart"}
        </button>

        <button
          onClick={handlePlaceOrder}
          disabled={isPlacingOrder || product.stock <= 0}
          className={`px-6 py-3 rounded-md font-medium ${
            product.stock <= 0
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-green-600 hover:bg-green-700 text-white"
          }`}
        >
          Checkout
        </button>
      </div>

      {product.stock <= 0 && (
        <div className="mt-4 text-red-500">
          This product is currently out of stock.
        </div>
      )}
    </div>
  );
};

export default ProductInfo;
