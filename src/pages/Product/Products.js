import { useEffect, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { getProducts } from "../../services/api";
import { useAuth } from "../../context/AuthContext";
import { motion } from "framer-motion";
import { FiSearch, FiFilter, FiPlus, FiEye, FiEdit } from "react-icons/fi";

const ProductListPage = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const { isSeller } = useAuth();

  // console.log("current searchParams", searchParams.toString());

  // Initialize filters from URL or defaults
  const [filters, setFilters] = useState({
    brand: searchParams.get("brand") || "",
    price: searchParams.get("price") || "",
    search: searchParams.get("search") || "",
    page: Number(searchParams.get("page")) || 1,
    limit: Number(searchParams.get("limit")) || 10,
  });

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await getProducts(filters);
      setProducts(response.data.data);
    } catch (err) {
      console.error("Error fetching products:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Update URL with current filters
    const params = new URLSearchParams();
    Object.entries(filters).forEach(([key, value]) => {
      if (value) params.set(key, value.toString());
    });
    setSearchParams(params);

    fetchProducts();
  }, [searchParams.toString()]);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  const setParams = () => {
    let squeryString = `?`;
    if (filters.brand) squeryString += `brand=${filters.brand}&`;
    if (filters.price) squeryString += `price=${filters.price}&`;
    if (filters.search) squeryString += `search=${filters.search}&`;
    squeryString += `page=${filters.page}&limit=${filters.limit}`;
    navigate(squeryString);
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setFilters((prev) => ({ ...prev, page: 1 })); // Reset to first page on new search
    setParams();
  };

  const handlePageChange = (newPage) => {
    setFilters((prev) => ({ ...prev, page: newPage }));
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // if (loading) {
  //   return (
  //     <div className="flex justify-center items-center h-64">
  //       <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
  //     </div>
  //   );
  // }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="container mx-auto px-4 py-8"
    >
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
        <motion.h1
          initial={{ y: -20 }}
          animate={{ y: 0 }}
          className="text-3xl font-bold text-gray-800 mb-4 md:mb-0"
        >
          Product Catalog
        </motion.h1>

        {isSeller() && (
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Link
              to="/products/create"
              className="flex items-center bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors duration-300"
            >
              <FiPlus className="mr-2" />
              Add Product
            </Link>
          </motion.div>
        )}
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-white rounded-lg shadow-md p-6 mb-8"
      >
        <form onSubmit={handleSearchSubmit} className="space-y-4">
          <div className="flex flex-col md:flex-row md:space-x-4 space-y-4 md:space-y-0">
            <div className="relative flex-grow">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FiSearch className="text-gray-400" />
              </div>
              <input
                type="text"
                name="search"
                value={filters.search}
                onChange={handleFilterChange}
                placeholder="Search products..."
                className="pl-10 w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
              />
            </div>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center"
            >
              <FiFilter className="mr-2" />
              Apply Filters
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Brand
              </label>
              <input
                type="text"
                name="brand"
                value={filters.brand}
                onChange={handleFilterChange}
                placeholder="Filter by brand"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Price Range
              </label>
              <input
                type="text"
                name="price"
                value={filters.price}
                onChange={handleFilterChange}
                placeholder="e.g. 10-100"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
              />
            </div>
          </div>
        </form>
      </motion.div>

      {!loading ? (
        <>
          {products.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-12"
            >
              <h3 className="text-xl font-medium text-gray-600">
                No products found matching your criteria
              </h3>
              <button
                onClick={() => setFilters({ page: 1, limit: 10 })}
                className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Clear Filters
              </button>
            </motion.div>
          ) : (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {products.map((product) => (
                  <motion.div
                    key={product._id}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.3 }}
                    whileHover={{
                      y: -5,
                      boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1)",
                    }}
                    className="bg-white rounded-xl shadow-md overflow-hidden transition-all duration-300"
                  >
                    {product.image && (
                      <div className="h-48 overflow-hidden">
                        <img
                          src={product.image}
                          alt={product.name}
                          className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
                        />
                      </div>
                    )}
                    <div className="p-5">
                      <h3 className="text-xl font-semibold text-gray-800 mb-2">
                        {product.name}
                      </h3>
                      <div className="space-y-1 text-gray-600 mb-4">
                        <p className="flex items-center">
                          <span className="font-medium">Brand:</span>{" "}
                          {product.brand}
                        </p>
                        <p className="flex items-center">
                          <span className="font-medium">Price:</span> $
                          {product.price.toFixed(2)}
                        </p>
                        <p className="flex items-center">
                          <span className="font-medium">Stock:</span>{" "}
                          {product.stock}
                        </p>
                      </div>
                      <div className="flex space-x-2">
                        <Link
                          to={`/products/${product._id}`}
                          className="flex items-center justify-center px-3 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors flex-1"
                        >
                          <FiEye className="mr-2" />
                          View
                        </Link>
                        {isSeller() && (
                          <Link
                            to={`/products/edit/${product._id}`}
                            className="flex items-center justify-center px-3 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors flex-1"
                          >
                            <FiEdit className="mr-2" />
                            Edit
                          </Link>
                        )}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>

              <div className="flex justify-center mt-8">
                <div className="flex space-x-2">
                  {filters.page > 1 && (
                    <button
                      onClick={() => handlePageChange(filters.page - 1)}
                      className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-100 transition-colors"
                    >
                      Previous
                    </button>
                  )}
                  <button
                    onClick={() => handlePageChange(filters.page)}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg"
                  >
                    {filters.page}
                  </button>
                  {products.length === filters.limit && (
                    <button
                      onClick={() => handlePageChange(filters.page + 1)}
                      className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-100 transition-colors"
                    >
                      Next
                    </button>
                  )}
                </div>
              </div>
            </>
          )}{" "}
        </>
      ) : (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      )}
    </motion.div>
  );
};

export default ProductListPage;
