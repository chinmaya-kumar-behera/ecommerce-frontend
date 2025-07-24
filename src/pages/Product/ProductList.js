import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getProducts } from "../../services/api";
import {
  Card,
  CardContent,
  CardMedia,
  Typography,
  Grid,
  Box,
  TextField,
  Button,
} from "@mui/material";
import { useAuth } from "../../context/AuthContext";

const ProductListPage = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    brand: "",
    stock: "",
    price: "",
    page: 1,
    limit: 10,
  });
  const { isSeller } = useAuth();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await getProducts(filters);
        console.log("Product list", response);
        setProducts(response.data.data);
      } catch (err) {
        console.error("Error fetching products:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, [filters]);

  const handleFilterChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  if (loading) return <Typography>Loading...</Typography>;

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Products
      </Typography>

      <Box sx={{ mb: 3, display: "flex", gap: 2 }}>
        <TextField
          name="brand"
          label="Brand"
          value={filters.brand}
          onChange={handleFilterChange}
          size="small"
        />
        <TextField
          name="stock"
          label="Max Stock"
          type="number"
          value={filters.stock}
          onChange={handleFilterChange}
          size="small"
        />
        <TextField
          name="price"
          label="Price Range"
          value={filters.price}
          onChange={handleFilterChange}
          size="small"
        />
      </Box>

      {isSeller() && (
        <Button
          component={Link}
          to="/products/create"
          variant="contained"
          color="primary"
          sx={{ mb: 3 }}
        >
          Add Product
        </Button>
      )}

      <Grid container spacing={3}>
        {products.map((product) => (
          <Grid item xs={12} sm={6} md={4} key={product._id}>
            <Card>
              {product.image && (
                <CardMedia
                  component="img"
                  height="200"
                  image={product.image}
                  alt={product.name}
                />
              )}
              <CardContent>
                <Typography gutterBottom variant="h5" component="div">
                  {product.name}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Brand: {product.brand}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Price: ${product.price}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Stock: {product.stock}
                </Typography>

                <Box sx={{ mt: 2, display: "flex", gap: 1 }}>
                  <Button
                    component={Link}
                    to={`/products/${product._id}`}
                    variant="outlined"
                    size="small"
                  >
                    View
                  </Button>
                  {isSeller() && (
                    <Button
                      component={Link}
                      to={`/products/edit/${product._id}`}
                      variant="outlined"
                      size="small"
                      color="secondary"
                    >
                      Edit
                    </Button>
                  )}
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default ProductListPage;
