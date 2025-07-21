import { useEffect, useState } from "react";
import { addToCart, getCartItems } from "../services/api";
import { useAuth } from "../context/AuthContext";
import {
  Box,
  Typography,
  Button,
  TextField,
  Card,
  CardContent,
  Grid,
} from "@mui/material";

const CartPage = () => {
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(true);
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    if (isAuthenticated()) {
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
    }
  }, [isAuthenticated]);

  const handleQuantityChange = async (productId, newQuantity) => {
    try {
      const updatedItems = cart.items.map((item) =>
        item.product_id === productId
          ? { ...item, quantity: Math.max(1, newQuantity) }
          : item
      );

      await addToCart({ carts: updatedItems });
      setCart({ ...cart, items: updatedItems });
    } catch (err) {
      console.error("Error updating cart:", err);
    }
  };

  const removeItem = async (productId) => {
    try {
      const updatedItems = cart.items.filter(
        (item) => item.product_id !== productId
      );
      await addToCart({ carts: updatedItems });
      setCart({ ...cart, items: updatedItems });
    } catch (err) {
      console.error("Error removing item:", err);
    }
  };

  if (!isAuthenticated()) {
    return <Typography>Please login to view your cart</Typography>;
  }

  if (loading) return <Typography>Loading cart...</Typography>;
  if (!cart || cart.items.length === 0)
    return <Typography>Your cart is empty</Typography>;

  const total = cart.items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Your Cart
      </Typography>

      <Grid container spacing={3}>
        <Grid item xs={12} md={8}>
          {cart.items.map((item) => (
            <Card key={item.product_id} sx={{ mb: 2 }}>
              <CardContent>
                <Grid container spacing={2} alignItems="center">
                  <Grid item xs={4}>
                    <Typography variant="h6">{item.name}</Typography>
                    <Typography variant="body2">${item.price}</Typography>
                  </Grid>
                  <Grid item xs={4}>
                    <TextField
                      type="number"
                      value={item.quantity}
                      onChange={(e) =>
                        handleQuantityChange(
                          item.product_id,
                          parseInt(e.target.value)
                        )
                      }
                      inputProps={{ min: 1 }}
                      size="small"
                    />
                  </Grid>
                  <Grid item xs={2}>
                    <Typography>${item.price * item.quantity}</Typography>
                  </Grid>
                  <Grid item xs={2}>
                    <Button
                      color="error"
                      onClick={() => removeItem(item.product_id)}
                    >
                      Remove
                    </Button>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          ))}
        </Grid>

        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Order Summary
              </Typography>
              <Typography gutterBottom>
                Subtotal: ${total.toFixed(2)}
              </Typography>
              <Typography gutterBottom>Shipping: $0.00</Typography>
              <Typography variant="h6">Total: ${total.toFixed(2)}</Typography>

              <Button
                variant="contained"
                color="primary"
                fullWidth
                sx={{ mt: 2 }}
                href="/checkout"
              >
                Proceed to Checkout
              </Button>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default CartPage;
