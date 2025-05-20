import express, { Request, Response, NextFunction } from "express";
import formidable from "express-formidable";
import { buildRouter } from "@adminjs/express";
import AdminJS from "adminjs";
import { componentLoader } from "../types/components.bundler.js";
import cookieParser from "cookie-parser";
import jwt from "jsonwebtoken";
import bodyParser from "body-parser";

interface JwtPayload {
  role: string;
  [key: string]: any;
}

// Extend the Express Request type to include the user property
declare global {
  namespace Express {
    interface Request {
      user?: JwtPayload;
    }
  }
}

/**
 * Authentication middleware to verify user has appropriate role
 * @param req Express request
 * @param res Express response
 * @param next Express next function
 */
export const authMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  // Skip auth check for login page
  if (req.originalUrl.includes("/admin/login")) {
    return next();
  }

  const { access_token } = req.cookies;

  if (!access_token) {
    res.redirect("/admin/login");
    return;
  }

  try {
    const decodedToken = jwt.verify(
      access_token,
      process.env.JWT_SECRET || "secret"
    ) as JwtPayload;
    const allowedRoles = ["superadmin", "admin", "viewer"];

    if (!decodedToken.role || !allowedRoles.includes(decodedToken.role)) {
      res.redirect(process.env.FRONTEND_URL || "/");
      return;
    }

    // Store user info for later use
    req.user = decodedToken;
    next();
  } catch (error) {
    res.redirect("/admin/login");
    return;
  }
};

/**
 * Configure AdminJS instance with branding and resources
 * @param resources Array of AdminJS resource configurations
 * @returns Configured AdminJS instance
 */
export const configureAdminJS = (resources: any[]): AdminJS => {
  const admin = new AdminJS({
    rootPath: "/admin",
    branding: {
      companyName: "WTR Admin Panel",
      logo: false,
      favicon: "/favicon.ico",
    },
    resources,
    componentLoader,
    assets: {
      scripts: ["/config.js"],
    },
  });
  admin.watch();
  return admin;
};

/**
 * Setup Express server with AdminJS router
 * @param admin AdminJS instance
 * @returns Configured Express app
 */
export const setupExpressServer = (admin: AdminJS): express.Application => {
  const app = express();
  // For parsing form data
  app.use(formidable());
  // For parsing cookies
  app.use(cookieParser());
  // For parsing JSON in API requests
  app.use(bodyParser.json());

  // Serve static files from the public directory
  app.use(express.static("public"));

  // Process the config.js file to insert environment variables
  app.get("/config.js", (req, res) => {
    const fs = require("fs");
    const path = require("path");

    const configPath = path.join(process.cwd(), "public", "config.js");
    let configContent = fs.readFileSync(configPath, "utf8");

    // Replace placeholders with actual environment variables
    configContent = configContent.replace(
      "%BACKEND_URL%",
      process.env.BACKEND_URL || ""
    );

    res.setHeader("Content-Type", "application/javascript");
    res.send(configContent);
  });

  const adminRouter = buildRouter(admin);

  // Handle login request
  const handleLogin = (req: Request, res: Response): void => {
    console.log("handleLogin", req);
    const { email, password } = (req as any).fields;

    // Here you would typically validate against a database
    // This is a simplified example - replace with actual authentication logic
    if (email && password) {
      // Check if user exists and has valid role (superadmin, admin, or viewer)
      // For demo purposes, we're just checking specific emails
      let role = "";

      if (email === "superadmin@example.com" && password === "password") {
        role = "superadmin";
      } else if (email === "admin@example.com" && password === "password") {
        role = "admin";
      } else if (email === "viewer@example.com" && password === "password") {
        role = "viewer";
      }

      if (role) {
        // Generate JWT token
        const token = jwt.sign(
          { email, role },
          process.env.JWT_SECRET || "secret",
          { expiresIn: "1d" }
        );

        // Set cookie
        res.cookie("access_token", token, {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          maxAge: 24 * 60 * 60 * 1000, // 1 day
        });

        res.status(200).json({ success: true });
        return;
      }
    }

    res.status(401).json({ message: "Invalid email or password" });
  };

  // Handle logout request
  const handleLogout = (req: Request, res: Response): void => {
    res.clearCookie("access_token");
    res.redirect("/admin/login");
  };

  // Register the routes
  app.post("/local/signin", handleLogin);
  app.get("/local/signout", handleLogout);

  // Define separate login route that doesn't use auth middleware
  app.use(`${admin.options.rootPath}/login`, express.static("public/login"));

  // Apply authentication middleware to all admin routes except login
  app.use(admin.options.rootPath, authMiddleware, adminRouter);

  return app;
};
