import { Typography, Button } from "@mui/material";
import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import ProductListPage from "../Product/ProductList";

const HomePage = () => {
  const { isAuthenticated } = useAuth();

  return (
    <div style={{ textAlign: "center", padding: "2rem" }}>
      <Typography variant="h2" gutterBottom>
        Welcome to Our E-Commerce Store
      </Typography>
      <Typography variant="h5" paragraph>
        Discover amazing products at great prices
      </Typography>
      {!isAuthenticated() ? (
        <Button
          variant="contained"
          size="large"
          component={Link}
          to="/register"
          sx={{ mt: 2 }}
        >
          Get Started
        </Button>
      ) : (
        <ProductListPage />
      )}
    </div>
  );
};

export default HomePage;
