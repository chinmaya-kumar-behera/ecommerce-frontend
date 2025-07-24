import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getProductById, updateProduct } from "../../services/api";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { TextField, Button, Box, Typography } from "@mui/material";

const ProductEditPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await getProductById(id);
        setProduct(response.data);
      } catch (err) {
        console.error("Error fetching product:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  const handleSubmit = async (values, { setSubmitting }) => {
    try {
      await updateProduct(id, values);
      navigate("/products");
    } catch (err) {
      setError(err.response?.data?.message || "Update failed");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <Typography>Loading...</Typography>;
  if (!product) return <Typography>Product not found</Typography>;

  return (
    <Box sx={{ maxWidth: 600, mx: "auto", mt: 4 }}>
      <Typography variant="h4" gutterBottom>
        Edit Product
      </Typography>
      {error && <Typography color="error">{error}</Typography>}

      <Formik
        initialValues={{
          name: product.name,
          type: product.type,
          brand: product.brand,
          price: product.price,
          stock: product.stock,
        }}
        validationSchema={Yup.object().shape({
          name: Yup.string().required("Required"),
          type: Yup.string().required("Required"),
          brand: Yup.string().required("Required"),
          price: Yup.number().required("Required").positive("Must be positive"),
          stock: Yup.number()
            .required("Required")
            .integer("Must be integer")
            .min(0, "Min 0"),
        })}
        onSubmit={handleSubmit}
      >
        {({ isSubmitting }) => (
          <Form>
            <Field name="name">
              {({ field, meta }) => (
                <TextField
                  {...field}
                  label="Name"
                  fullWidth
                  margin="normal"
                  error={meta.touched && !!meta.error}
                  helperText={<ErrorMessage name="name" />}
                />
              )}
            </Field>

            {/* Other fields similar to ProductCreatePage */}

            <Button
              type="submit"
              variant="contained"
              color="primary"
              disabled={isSubmitting}
              fullWidth
              sx={{ mt: 2 }}
            >
              Update Product
            </Button>
          </Form>
        )}
      </Formik>
    </Box>
  );
};

export default ProductEditPage;
