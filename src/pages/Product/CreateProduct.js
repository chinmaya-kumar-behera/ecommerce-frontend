import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createProduct } from "../../services/api";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { TextField, Button, Box, Typography } from "@mui/material";

const ProductSchema = Yup.object().shape({
  name: Yup.string().required("Required"),
  type: Yup.string().required("Required"),
  brand: Yup.string().required("Required"),
  price: Yup.number().required("Required").positive("Must be positive"),
  stock: Yup.number()
    .required("Required")
    .integer("Must be integer")
    .min(0, "Min 0"),
});

const ProductCreatePage = () => {
  const navigate = useNavigate();
  const [error, setError] = useState("");
  const [files, setFiles] = useState([]);

  const handleSubmit = async (values, { setSubmitting }) => {
    try {
      const formData = new FormData();
      Object.keys(values).forEach((key) => {
        formData.append(key, values[key]);
      });

      files.forEach((file) => {
        if (file.fieldName === "image") {
          formData.append("image", file.file);
        } else {
          formData.append("images", file.file);
        }
      });

      await createProduct(formData);
      navigate("/products");
    } catch (err) {
      setError(err.response?.data?.message || "Product creation failed");
    } finally {
      setSubmitting(false);
    }
  };

  const handleFileChange = (e, fieldName) => {
    const newFiles = Array.from(e.target.files).map((file) => ({
      file,
      fieldName,
    }));
    setFiles([...files, ...newFiles]);
  };

  return (
    <Box sx={{ maxWidth: 600, mx: "auto", mt: 4 }}>
      <Typography variant="h4" gutterBottom>
        Create Product
      </Typography>
      {error && <Typography color="error">{error}</Typography>}

      <Formik
        initialValues={{
          name: "",
          type: "",
          brand: "",
          price: "",
          stock: "",
        }}
        validationSchema={ProductSchema}
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

            <Field name="type">
              {({ field, meta }) => (
                <TextField
                  {...field}
                  label="Type"
                  fullWidth
                  margin="normal"
                  error={meta.touched && !!meta.error}
                  helperText={<ErrorMessage name="type" />}
                />
              )}
            </Field>

            <Field name="brand">
              {({ field, meta }) => (
                <TextField
                  {...field}
                  label="Brand"
                  fullWidth
                  margin="normal"
                  error={meta.touched && !!meta.error}
                  helperText={<ErrorMessage name="brand" />}
                />
              )}
            </Field>

            <Field name="price">
              {({ field, meta }) => (
                <TextField
                  {...field}
                  label="Price"
                  type="number"
                  fullWidth
                  margin="normal"
                  error={meta.touched && !!meta.error}
                  helperText={<ErrorMessage name="price" />}
                />
              )}
            </Field>

            <Field name="stock">
              {({ field, meta }) => (
                <TextField
                  {...field}
                  label="Stock"
                  type="number"
                  fullWidth
                  margin="normal"
                  error={meta.touched && !!meta.error}
                  helperText={<ErrorMessage name="stock" />}
                />
              )}
            </Field>

            <Box sx={{ mt: 2 }}>
              <Typography variant="subtitle1" gutterBottom>
                Primary Image
              </Typography>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => handleFileChange(e, "image")}
              />
            </Box>

            <Box sx={{ mt: 2 }}>
              <Typography variant="subtitle1" gutterBottom>
                Additional Images
              </Typography>
              <input
                type="file"
                accept="image/*"
                multiple
                onChange={(e) => handleFileChange(e, "images")}
              />
            </Box>

            <Button
              type="submit"
              variant="contained"
              color="primary"
              disabled={isSubmitting}
              fullWidth
              sx={{ mt: 2 }}
            >
              Create Product
            </Button>
          </Form>
        )}
      </Formik>
    </Box>
  );
};

export default ProductCreatePage;
