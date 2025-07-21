import { Typography, Button } from "@mui/material";
import { Link } from "react-router-dom";

const UnauthorizedPage = () => {
  return (
    <div style={{ textAlign: "center", padding: "2rem" }}>
      <Typography variant="h3" gutterBottom>
        403 - Unauthorized
      </Typography>
      <Typography variant="h5" paragraph>
        You don't have permission to access this page
      </Typography>
      <Button variant="contained" component={Link} to="/" sx={{ mt: 2 }}>
        Go to Home
      </Button>
    </div>
  );
};

export default UnauthorizedPage;
