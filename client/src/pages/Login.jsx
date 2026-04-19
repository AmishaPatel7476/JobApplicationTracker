import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import API_BASE_URL from "../api/config";
import { notifications } from "@mantine/notifications";
import { IconCheck, IconX } from "@tabler/icons-react";

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

function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [formData, setFormData] = useState({
    email: "",
    password: ""
  });

  const [fieldErrors, setFieldErrors] = useState({});
  const [loading, setLoading] = useState(false);

  // ✅ Email validator
  const isValidEmail = (email) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const handleChange = (e) => {
    setFieldErrors({});
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFieldErrors({});

    const errors = {};

    // ✅ VALIDATION
    if (!formData.email.trim()) {
      errors.email = "Email is required";
    } else if (!isValidEmail(formData.email)) {
      errors.email = "Invalid email format";
    }

    if (!formData.password.trim()) {
      errors.password = "Password is required";
    }

    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      return;
    }

    setLoading(true);

    try {
      const cleanedData = {
        ...formData,
        email: formData.email.trim().toLowerCase()
      };

      const res = await fetch(`${API_BASE_URL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(cleanedData)
      });

      let data;
      try {
        data = await res.json();
      } catch {
        throw new Error("Invalid server response");
      }

      if (!res.ok) throw new Error(data.message || "Login failed");

      login(data, data.token);

      notifications.show({
        color: "green",
        title: "Success",
        message: "Login successful",
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
      {/* LEFT */}
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
            Track applications and land your dream job.
          </Text>
        </Stack>
      </Box>

      {/* RIGHT */}
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
          <Title order={2} ta="center" mb="md">
            Welcome Back
          </Title>

          <form onSubmit={handleSubmit}>
            <Stack>
              <TextInput
                label="Email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                error={fieldErrors.email}
                aria-label="Email"
              />

              <PasswordInput
                label="Password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                error={fieldErrors.password}
                aria-label="Password"
              />

              <Button fullWidth type="submit" loading={loading}>
                Login
              </Button>

              <Text size="sm" ta="center">
                Don’t have an account?{" "}
                <Link to="/register">Register</Link>
              </Text>
            </Stack>
          </form>
        </Paper>
      </Box>
    </Box>
  );
}

export default Login;