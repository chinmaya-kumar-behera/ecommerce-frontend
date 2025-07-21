import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { registerUser } from "../../services/api";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { TextField, Button, Box, Typography, MenuItem } from "@mui/material";

const RegisterSchema = Yup.object().shape({
  firstName: Yup.string().required("Required"),
  lastName: Yup.string().required("Required"),
  email: Yup.string().email("Invalid email").required("Required"),
  password: Yup.string().min(6, "Too short").required("Required"),
  phone: Yup.string().required("Required"),
  address: Yup.string().required("Required"),
  role: Yup.string().required("Required"),
});

const roles = [
  { value: "customer", label: "Customer" },
  { value: "seller", label: "Seller" },
];

const RegisterPage = () => {
  const navigate = useNavigate();
  const [error, setError] = useState("");

  const handleSubmit = async (values, { setSubmitting }) => {
    try {
      await registerUser(values);
      navigate("/login");
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Box sx={{ maxWidth: 400, mx: "auto", mt: 4 }}>
      <Typography variant="h4" gutterBottom>
        Register
      </Typography>
      {error && <Typography color="error">{error}</Typography>}

      <Formik
        initialValues={{
          firstName: "",
          lastName: "",
          email: "",
          password: "",
          phone: "",
          address: "",
          role: "customer",
        }}
        validationSchema={RegisterSchema}
        onSubmit={handleSubmit}
      >
        {({ isSubmitting }) => (
          <Form>
            <Field name="firstName">
              {({ field, meta }) => (
                <TextField
                  {...field}
                  label="First Name"
                  fullWidth
                  margin="normal"
                  error={meta.touched && !!meta.error}
                  helperText={<ErrorMessage name="firstName" />}
                />
              )}
            </Field>

            <Field name="lastName">
              {({ field, meta }) => (
                <TextField
                  {...field}
                  label="Last Name"
                  fullWidth
                  margin="normal"
                  error={meta.touched && !!meta.error}
                  helperText={<ErrorMessage name="lastName" />}
                />
              )}
            </Field>

            <Field name="email">
              {({ field, meta }) => (
                <TextField
                  {...field}
                  label="Email"
                  fullWidth
                  margin="normal"
                  error={meta.touched && !!meta.error}
                  helperText={<ErrorMessage name="email" />}
                />
              )}
            </Field>

            <Field name="password">
              {({ field, meta }) => (
                <TextField
                  {...field}
                  label="Password"
                  type="password"
                  fullWidth
                  margin="normal"
                  error={meta.touched && !!meta.error}
                  helperText={<ErrorMessage name="password" />}
                />
              )}
            </Field>

            <Field name="phone">
              {({ field, meta }) => (
                <TextField
                  {...field}
                  label="Phone"
                  fullWidth
                  margin="normal"
                  error={meta.touched && !!meta.error}
                  helperText={<ErrorMessage name="phone" />}
                />
              )}
            </Field>

            <Field name="address">
              {({ field, meta }) => (
                <TextField
                  {...field}
                  label="Address"
                  fullWidth
                  margin="normal"
                  multiline
                  rows={3}
                  error={meta.touched && !!meta.error}
                  helperText={<ErrorMessage name="address" />}
                />
              )}
            </Field>

            <Field name="role">
              {({ field, meta }) => (
                <TextField
                  {...field}
                  select
                  label="Role"
                  fullWidth
                  margin="normal"
                  error={meta.touched && !!meta.error}
                  helperText={<ErrorMessage name="role" />}
                >
                  {roles.map((option) => (
                    <MenuItem key={option.value} value={option.value}>
                      {option.label}
                    </MenuItem>
                  ))}
                </TextField>
              )}
            </Field>

            <Button
              type="submit"
              variant="contained"
              color="primary"
              disabled={isSubmitting}
              fullWidth
              sx={{ mt: 2 }}
            >
              Register
            </Button>
          </Form>
        )}
      </Formik>

      <Typography sx={{ mt: 2 }}>
        Already have an account?{" "}
        <Button onClick={() => navigate("/login")}>Login</Button>
      </Typography>
    </Box>
  );
};

export default RegisterPage;
