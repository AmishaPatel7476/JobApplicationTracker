import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { notifications } from "@mantine/notifications";
import { IconCheck, IconX } from "@tabler/icons-react";
import API_BASE_URL from "../api/config";

import {
  TextInput,
  PasswordInput,
  Button,
  Paper,
  Title,
  Text,
  Stack,
  Box
} from "@mantine/core";

function Register() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: ""
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const isValidEmail = (email) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const handleChange = (e) => {
    setError("");
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    // Validation
    if (!formData.name.trim()) {
      setError("Name is required");
      return;
    }

    if (!formData.email.trim()) {
      setError("Email is required");
      return;
    }

    if (!isValidEmail(formData.email)) {
      setError("Please enter a valid email address");
      return;
    }

    if (!formData.password.trim()) {
      setError("Password is required");
      return;
    }

    if (formData.password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }

    setLoading(true);

    try {
      const cleanedData = {
        ...formData,
        email: formData.email.trim().toLowerCase()
      };

      const res = await fetch(`${API_BASE_URL}/auth/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(cleanedData)
      });

      let data;
      try {
        data = await res.json();
      } catch {
        throw new Error("Invalid server response");
      }

      if (!res.ok) {
        throw new Error(data.message || "Registration failed");
      }

      login(
        {
          _id: data._id,
          name: data.name,
          email: data.email
        },
        data.token
      );
      notifications.show({
        color: "green",
        title: "Success",
        message: "Account created!",
        icon: <IconCheck size={16} />
      });
      navigate("/dashboard");
    } catch (err) {
      notifications.show({
        color: "red",
        title: "Error",
        message: err.message,
        icon: <IconX size={16} />
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box style={{ display: "flex", minHeight: "100vh" }}>
      <Box
        visibleFrom="md"
        style={{
          flex: 1,
          background: "linear-gradient(135deg, #2563eb, #1e40af)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: 40
        }}
      >
        <Stack>
          <Title c="white">Job Tracker</Title>
          <Text c="gray.2">
            Start tracking your job applications in one place.
          </Text>
        </Stack>
      </Box>

      <Box
        style={{
          flex: 1,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#f8fafc",
          padding: 20
        }}
      >
        <Paper shadow="xl" p="xl" radius="md" w="100%" maw={420}>
          <Stack gap={4} mb="md">
            <Title order={2} ta="center">
              Create Account
            </Title>
            <Text size="sm" ta="center" c="dimmed">
              Sign up to manage your job applications
            </Text>
          </Stack>

          <form onSubmit={handleSubmit}>
            <Stack>
              <TextInput
                label="Name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                error={error && !formData.name ? "Name is required" : null}
              />

              <TextInput
                label="Email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                error={
                  error &&
                  (!formData.email
                    ? "Email is required"
                    : !isValidEmail(formData.email)
                    ? "Invalid email format"
                    : null)
                }
              />

              <PasswordInput
                label="Password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                error={
                  error && !formData.password
                    ? "Password is required"
                    : formData.password.length > 0 &&
                      formData.password.length < 6
                    ? "Minimum 6 characters"
                    : null
                }
              />

              <Button fullWidth type="submit" loading={loading}>
                Register
              </Button>

              <Text size="sm" ta="center">
                Already have an account?{" "}
                <Link to="/login">Login</Link>
              </Text>
            </Stack>
          </form>
        </Paper>
      </Box>
    </Box>
  );
}

export default Register;