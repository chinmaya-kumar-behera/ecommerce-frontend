import { addReview } from "../../services/api";
import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import {
  addToCart,
  getProductById,
  getReviewsByProductId,
} from "../../services/api";
 

const ReviewList = ({ productId, reviews, setReviews }) => {
  const [newReview, setNewReview] = useState({
    title: "",
    rating: 5,
    description: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewReview((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const response = await addReview(productId, newReview);
      setReviews((prev) => [...prev, response.data]);
      setNewReview({
        title: "",
        rating: 5,
        description: "",
      });
    } catch (error) {
      console.error("Error submitting review:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="mt-8">
      <h3 className="text-xl font-semibold mb-4">Customer Reviews</h3>

      {reviews.length === 0 ? (
        <p>No reviews yet. Be the first to review!</p>
      ) : (
        <div className="space-y-4">
          {reviews.map((review) => (
            <div key={review._id} className="border-b pb-4">
              <div className="flex items-center mb-2">
                <div className="flex items-center">
                  {[...Array(5)].map((_, i) => (
                    <svg
                      key={i}
                      className={`w-4 h-4 ${
                        i < review.rating ? "text-yellow-400" : "text-gray-300"
                      }`}
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
                <span className="ml-2 font-medium">{review.title}</span>
              </div>
              <p className="text-gray-600">{review.description}</p>
              <p className="text-sm text-gray-500 mt-1">
                By {review.user_id?.name || "Anonymous"} •{" "}
                {new Date(review.createdAt).toLocaleDateString()}
              </p>
            </div>
          ))}
        </div>
      )}

      <form
        onSubmit={handleSubmit}
        className="mt-6 bg-white p-4 rounded-lg shadow"
      >
        <h4 className="text-lg font-medium mb-3">Write a Review</h4>

        <div className="mb-3">
          <label
            htmlFor="title"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Title
          </label>
          <input
            type="text"
            id="title"
            name="title"
            value={newReview.title}
            onChange={handleInputChange}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
          />
        </div>

        <div className="mb-3">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Rating
          </label>
          <div className="flex items-center">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                onClick={() =>
                  setNewReview((prev) => ({ ...prev, rating: star }))
                }
                className="focus:outline-none"
              >
                <svg
                  className={`w-6 h-6 ${
                    star <= newReview.rating
                      ? "text-yellow-400"
                      : "text-gray-300"
                  }`}
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              </button>
            ))}
          </div>
        </div>

        <div className="mb-3">
          <label
            htmlFor="description"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Review
          </label>
          <textarea
            id="description"
            name="description"
            value={newReview.description}
            onChange={handleInputChange}
            required
            rows="4"
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
          />
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-blue-400"
        >
          {isSubmitting ? "Submitting..." : "Submit Review"}
        </button>
      </form>
    </div>
  );
};
 


const ProductImages = ({ product }) => {
  return (
    <div className="md:w-1/2">
      <div className="bg-white rounded-lg shadow-md overflow-hidden mb-4">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-96 object-contain"
        />
      </div>
      <div className="grid grid-cols-3 gap-2">
        {product.images.map((img, index) => (
          <div key={index} className="bg-white rounded shadow p-1">
            <img
              src={img}
              alt={`${product.name} ${index + 1}`}
              className="h-24 w-full object-contain"
            />
          </div>
        ))}
      </div>
    </div>
  );
};


const ProductInfo = ({
  product,
  discountedPrice,
  quantity,
  handleQuantityChange,
  incrementQuantity,
  decrementQuantity,
  handleAddToCart,
  handlePlaceOrder,
  isAddingToCart,
  isPlacingOrder,
}) => {
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
          {isPlacingOrder ? "Placing..." : "Buy Now"}
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


const ProductDetail = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const [isPlacingOrder, setIsPlacingOrder] = useState(false);
  const [reviews, setReviews] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProductAndReviews = async () => {
      try {
        setLoading(true);
        const productResponse = await getProductById(id);
        setProduct(productResponse.data.Product);
        
        // const reviewsResponse = await getReviewsByProductId(id);
        // setReviews(reviewsResponse.data);
        
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchProductAndReviews();
  }, [id]);

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
   navigate(`/checkout/${product._id}`)
  };

  if (loading) return <div className="text-center py-8">Loading...</div>;
  if (error)
    return <div className="text-center py-8 text-red-500">Error: {error}</div>;
  if (!product)
    return <div className="text-center py-8">Product not found</div>;

  const discountedPrice =
    product.price - product.price * (product.discount / 100);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row gap-8">
        <ProductImages product={product} />
        
        <ProductInfo 
          product={product}
          discountedPrice={discountedPrice}
          quantity={quantity}
          handleQuantityChange={handleQuantityChange}
          incrementQuantity={incrementQuantity}
          decrementQuantity={decrementQuantity}
          handleAddToCart={handleAddToCart}
          handlePlaceOrder={handlePlaceOrder}
          isAddingToCart={isAddingToCart}
          isPlacingOrder={isPlacingOrder}
        />
      </div>

      <div className="mt-12">
        <h2 className="text-2xl font-bold mb-4">Product Details</h2>
        <div className="bg-white rounded-lg shadow-md p-6">
          <p className="text-gray-700">
            {product.description || "No description available."}
          </p>
          <ul className="mt-4 space-y-2">
            {product.features?.map((feature, index) => (
              <li key={index} className="flex items-start">
                <svg
                  className="h-5 w-5 text-green-500 mr-2"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
                <span>{feature}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <ReviewList productId={id} reviews={reviews} setReviews={setReviews} />
    </div>
  );
};
export default ProductDetail;