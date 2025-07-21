import { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { getSellerOrders } from "../../services/api";
import {
  Typography,
  Box,
  Card,
  CardContent,
  List,
  ListItem,
  ListItemText,
} from "@mui/material";

const SellerOrdersPage = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await getSellerOrders();
        setOrders(response.data.orders);
      } catch (err) {
        console.error("Error fetching seller orders:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  if (loading) return <Typography>Loading orders...</Typography>;

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Seller Orders
      </Typography>

      {orders.length === 0 ? (
        <Typography>No orders found</Typography>
      ) : (
        orders.map((order) => (
          <Card key={order._id} sx={{ mb: 2 }}>
            <CardContent>
              <Typography variant="h6">
                Order #{order._id.substring(0, 8)} -{" "}
                {new Date(order.createdAt).toLocaleDateString()}
              </Typography>
              <Typography>
                Status: {order.order_status} | Payment: {order.payment_status}
              </Typography>

              <Typography variant="subtitle1" sx={{ mt: 1 }}>
                Products:
              </Typography>

              <List>
                {order.items.map((item) => (
                  <ListItem key={item.product_id}>
                    <ListItemText
                      primary={item.product_info?.name || "Product"}
                      secondary={`Quantity: ${
                        item.quantity
                      } - $${item.price_at_purchase.toFixed(2)}`}
                    />
                  </ListItem>
                ))}
              </List>

              <Typography variant="h6" sx={{ textAlign: "right" }}>
                Total: ${order.total_summary.toFixed(2)}
              </Typography>
            </CardContent>
          </Card>
        ))
      )}
    </Box>
  );
};

export default SellerOrdersPage;
