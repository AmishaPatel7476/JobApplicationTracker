import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import {
  MantineProvider,
  ColorSchemeScript,
  localStorageColorSchemeManager
} from "@mantine/core";
import { Notifications } from "@mantine/notifications";

import App from "./App";
import { AuthProvider } from "./context/AuthContext";

import "@mantine/core/styles.css";
import "@mantine/notifications/styles.css";
import "./index.css";

// ✅ Persist theme in localStorage
const colorSchemeManager = localStorageColorSchemeManager({
  key: "mantine-color-scheme"
});

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <ColorSchemeScript defaultColorScheme="light" />

    <MantineProvider
      defaultColorScheme="light"
      colorSchemeManager={colorSchemeManager}
      theme={{
        primaryColor: "blue",
        defaultRadius: "md"
      }}
    >
      <Notifications position="top-right" />

      <BrowserRouter basename="/assessment02">
        <AuthProvider>
          <App />
        </AuthProvider>
      </BrowserRouter>
    </MantineProvider>
  </React.StrictMode>
);
