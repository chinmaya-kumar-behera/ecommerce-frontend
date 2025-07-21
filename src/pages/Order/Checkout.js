import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { createOrder, getCartItems } from "../../services/api";
import { useAuth } from "../../context/AuthContext";
import {
  Box,
  Typography,
  Button,
  TextField,
  Card,
  CardContent,
  FormControlLabel,
  Checkbox,
  Grid,
} from "@mui/material";

const CheckoutPage = () => {
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(true);
  const [paymentMethod, setPaymentMethod] = useState("credit_card");
  const [shippingAddress, setShippingAddress] = useState("");
  const [billingSameAsShipping, setBillingSameAsShipping] = useState(true);
  const [billingAddress, setBillingAddress] = useState("");
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCart = async () => {
      try {
        const response = await getCartItems();
        setCart(response.data.getdata);
      } catch (err) {
        console.error("Error fetching cart:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchCart();
  }, []);

  const handleSubmit = async () => {
    try {
      const orderData = {
        products: cart.items.map((item) => ({
          product_id: item.product_id,
          quantity: item.quantity,
        })),
        payment_method: paymentMethod,
        payment_status: "pending",
        order_status: "processing",
      };

      const response = await createOrder(orderData);
      navigate(`/orders/${response.data.data._id}`);
    } catch (err) {
      console.error("Error creating order:", err);
    }
  };

  if (loading) return <Typography>Loading...</Typography>;
  if (!cart || cart.items.length === 0)
    return <Typography>Your cart is empty</Typography>;

  const total = cart.items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

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
                Shipping Address
              </Typography>
              <TextField
                label="Shipping Address"
                fullWidth
                margin="normal"
                value={shippingAddress}
                onChange={(e) => setShippingAddress(e.target.value)}
                multiline
                rows={3}
              />

              <FormControlLabel
                control={
                  <Checkbox
                    checked={billingSameAsShipping}
                    onChange={(e) => setBillingSameAsShipping(e.target.checked)}
                  />
                }
                label="Billing address same as shipping"
              />

              {!billingSameAsShipping && (
                <TextField
                  label="Billing Address"
                  fullWidth
                  margin="normal"
                  value={billingAddress}
                  onChange={(e) => setBillingAddress(e.target.value)}
                  multiline
                  rows={3}
                />
              )}
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

              {cart.items.map((item) => (
                <Box
                  key={item.product_id}
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    mb: 1,
                  }}
                >
                  <Typography>
                    {item.name} x {item.quantity}
                  </Typography>
                  <Typography>
                    ${(item.price * item.quantity).toFixed(2)}
                  </Typography>
                </Box>
              ))}

              <Box sx={{ mt: 2, pt: 2, borderTop: "1px solid #ddd" }}>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    mb: 1,
                  }}
                >
                  <Typography>Subtotal:</Typography>
                  <Typography>${total.toFixed(2)}</Typography>
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
                  <Typography variant="h6">${total.toFixed(2)}</Typography>
                </Box>
              </Box>

              <Button
                variant="contained"
                color="primary"
                fullWidth
                sx={{ mt: 2 }}
                onClick={handleSubmit}
              >
                Place Order
              </Button>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default CheckoutPage;
