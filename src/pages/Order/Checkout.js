import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { createOrder, getProductById } from "../../services/api";
import { useAuth } from "../../context/AuthContext";
import {
  Box,
  Typography,
  Button,
  Card,
  CardContent,
  Grid,
  TextField,
} from "@mui/material";
import { toast } from "react-toastify";

const CheckoutPage = () => {
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [paymentMethod, setPaymentMethod] = useState("cod");
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const { id } = useParams();

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await getProductById(id);
        setProduct(response.data.Product);
      } catch (err) {
        console.error("Error fetching product:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
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

  console.log("user state", isAuthenticated);
  const handlePlaceOrder = async () => {
    try {
      if (!isAuthenticated()) {
        navigate("/login");
        return;
      }

      const orderData = {
        products: [
          {
            product_id: product._id,
            quantity: quantity,
          },
        ],
        payment_method: paymentMethod,
        payment_status: "pending",
        order_status: "processing",
      };

      const response = await createOrder(orderData);

      if(response.status === 200) {
        toast.success("Order placed successfully!");
        navigate(`/orders`);
      }
    } catch (err) {
      console.error("Error creating order:", err);
      toast.error("Error placing order!");
    }
  };

  if (loading) return <Typography>Loading...</Typography>;
  if (!product) return <Typography>Product not found</Typography>;

  const discountedPrice =
    product.price - product.price * (product.discount / 100);
  const total = (discountedPrice * quantity).toFixed(2);

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Checkout
      </Typography>

      <Grid container spacing={3}>
        <Grid item xs={12} md={8}>
          <Card sx={{ mb: 3 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Product Details
              </Typography>
              <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                <img
                  src={product.image}
                  alt={product.name}
                  style={{
                    width: 80,
                    height: 80,
                    objectFit: "contain",
                    marginRight: 16,
                  }}
                />
                <Box>
                  <Typography variant="subtitle1">{product.name}</Typography>
                  <Typography variant="body2" color="text.secondary">
                    {product.brand}
                  </Typography>
                </Box>
              </Box>

              <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                <Typography sx={{ mr: 2 }}>Quantity:</Typography>
                <Button onClick={decrementQuantity} disabled={quantity <= 1}>
                  -
                </Button>
                <TextField
                  type="number"
                  value={quantity}
                  onChange={handleQuantityChange}
                  inputProps={{ min: 1, max: product.stock }}
                  sx={{ width: 80, mx: 1 }}
                />
                <Button
                  onClick={incrementQuantity}
                  disabled={quantity >= product.stock}
                >
                  +
                </Button>
              </Box>

              <Typography variant="body1" sx={{ mb: 2 }}>
                Available: {product.stock} units
              </Typography>
            </CardContent>
          </Card>

          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Payment Method
              </Typography>
              <Box sx={{ display: "flex", gap: 2 }}>
                <Button
                  variant={
                    paymentMethod === "credit_card" ? "contained" : "outlined"
                  }
                  onClick={() => setPaymentMethod("credit_card")}
                >
                  Credit Card
                </Button>
                <Button
                  variant={
                    paymentMethod === "paypal" ? "contained" : "outlined"
                  }
                  onClick={() => setPaymentMethod("paypal")}
                >
                  PayPal
                </Button>
                <Button
                  variant={paymentMethod === "cod" ? "contained" : "outlined"}
                  onClick={() => setPaymentMethod("cod")}
                >
                  Cash on Delivery
                </Button>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Order Summary
              </Typography>

              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  mb: 1,
                }}
              >
                <Typography>
                  {product.name} x {quantity}
                </Typography>
                <Typography>
                  ${(discountedPrice * quantity).toFixed(2)}
                </Typography>
              </Box>

              {product.discount > 0 && (
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    mb: 1,
                  }}
                >
                  <Typography>Discount:</Typography>
                  <Typography color="success.main">
                    -$
                    {(
                      product.price *
                      (product.discount / 100) *
                      quantity
                    ).toFixed(2)}
                  </Typography>
                </Box>
              )}

              <Box sx={{ mt: 2, pt: 2, borderTop: "1px solid #ddd" }}>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    mb: 1,
                  }}
                >
                  <Typography>Subtotal:</Typography>
                  <Typography>
                    ${(product.price * quantity).toFixed(2)}
                  </Typography>
                </Box>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    mb: 1,
                  }}
                >
                  <Typography>Shipping:</Typography>
                  <Typography>$0.00</Typography>
                </Box>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    mb: 1,
                  }}
                >
                  <Typography>Tax:</Typography>
                  <Typography>$0.00</Typography>
                </Box>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    mt: 2,
                  }}
                >
                  <Typography variant="h6">Total:</Typography>
                  <Typography variant="h6">${total}</Typography>
                </Box>
              </Box>

              <Button
                variant="contained"
                color="primary"
                fullWidth
                sx={{ mt: 2 }}
                onClick={handlePlaceOrder}
                disabled={product.stock <= 0}
              >
                Place Order
              </Button>

              {product.stock <= 0 && (
                <Typography color="error" sx={{ mt: 1 }}>
                  This product is out of stock
                </Typography>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default CheckoutPage;
