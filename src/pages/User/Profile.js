import { useEffect, useState } from "react";
import { getUserProfile, updateUserProfile } from "../../services/api";
import { useAuth } from "../../context/AuthContext";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { TextField, Button, Box, Typography } from "@mui/material";

const ProfileSchema = Yup.object().shape({
  firstName: Yup.string().required("Required"),
  lastName: Yup.string().required("Required"),
  address: Yup.string().required("Required"),
});

const ProfilePage = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const { user: authUser, logout } = useAuth();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await getUserProfile();
        setUser(response.data.user);
      } catch (err) {
        console.error("Error fetching profile:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  const handleSubmit = async (values, { setSubmitting }) => {
    try {
      const response = await updateUserProfile(authUser.id, values);
      setUser(response.data.data);
    } catch (err) {
      setError(err.response?.data?.message || "Update failed");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <Typography>Loading profile...</Typography>;
  if (!user) return <Typography>Error loading profile</Typography>;

  return (
    <Box sx={{ maxWidth: 600, mx: "auto", mt: 4 }}>
      <Typography variant="h4" gutterBottom>
        Profile
      </Typography>
      {error && <Typography color="error">{error}</Typography>}

      <Formik
        initialValues={{
          firstName: user.firstName,
          lastName: user.lastName,
          address: user.address,
        }}
        validationSchema={ProfileSchema}
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

            <Button
              type="submit"
              variant="contained"
              color="primary"
              disabled={isSubmitting}
              fullWidth
              sx={{ mt: 2 }}
            >
              Update Profile
            </Button>
          </Form>
        )}
      </Formik>

      <Button
        variant="outlined"
        color="error"
        fullWidth
        sx={{ mt: 2 }}
        onClick={logout}
      >
        Logout
      </Button>
    </Box>
  );
};

export default ProfilePage;
