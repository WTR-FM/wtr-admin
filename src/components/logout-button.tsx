import React, { FC } from "react";
import { Box, Button, Icon } from "@adminjs/design-system";

/**
 * Custom logout button that uses the BACKEND_URL/local/signout endpoint
 */
const LogoutButton: FC = () => {
  const handleLogout = async (e: React.MouseEvent) => {
    e.preventDefault();
    try {
      // Get backend URL from window object (set in config.js)
      const backendUrl = (window as any).BACKEND_URL || "";

      // Call the logout endpoint
      await fetch(`${backendUrl}/local/signout`, {
        method: "GET",
        credentials: "include", // Include cookies for authentication
      });

      // Redirect to login page
      window.location.href = "/admin/login";
    } catch (error) {
      console.error("Logout error:", error);
      // If there's an error, still try to redirect
      window.location.href = "/admin/login";
    }
  };

  return (
    <Box ml="default">
      <Button
        as="a"
        href="#"
        onClick={handleLogout}
        size="icon"
        variant="text"
        rounded
      >
        <Icon icon="Logout" />
      </Button>
    </Box>
  );
};

export default LogoutButton;
