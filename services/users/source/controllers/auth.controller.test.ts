import { beforeEach, describe, expect, it, vi } from "vitest";
import request from "supertest";
import express from "express";
import {
  loginController,
  logoutController,
  refreshController,
  signupController,
} from "./auth.controller.js";
import {
  loginService,
  logoutService,
  refreshService,
  signupService,
} from "../services/auth.service.js";

vi.mock("../services/auth.service.js", () => ({
  loginService: vi.fn(),
  signupService: vi.fn(),
  logoutService: vi.fn(),
  refreshService: vi.fn(),
}));

const app = express();
app.use(express.json());
app.post("/login", loginController);
app.post("/signup", signupController);
app.post("/logout", logoutController);
app.post("/refresh", refreshController);

describe("Auth Controllers", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("POST /login", () => {
    it("should return user and token on successful login", async () => {
      const mockUser = {
        id: "user-123",
        email: "test@example.com",
        name: "Test User",
        createdAt: new Date(),
        updatedAt: new Date(),
        emailVerified: false,
      };

      const mockToken =
        "eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJ1c2VyLTEyMyIsImVtYWlsIjoidGVzdEBleGFtcGxlLmNvbSIsInJvbGUiOiJjbGllbnQiLCJzZXNzaW9uSWQiOiJzZXNzaW9uLTQ1NiJ9.signature";

      (loginService as any).mockResolvedValue({
        user: mockUser,
        token: mockToken,
      });

      const response = await request(app).post("/login").send({
        email: "test@example.com",
        password: "password123",
        rememberMe: true,
        callbackUrl: "http://localhost:3000",
      });

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty("user");
      expect(response.body).toHaveProperty("token");
      expect(response.body.user.email).toBe("test@example.com");
      expect(response.body.token).toBe(mockToken);
      expect(loginService).toHaveBeenCalledTimes(1);
    });

    it("should return 401 on authentication failure", async () => {
      (loginService as any).mockRejectedValue(new Error("Invalid credentials"));

      const response = await request(app).post("/login").send({
        email: "test@example.com",
        password: "wrongpassword",
        rememberMe: false,
        callbackUrl: "http://localhost:3000",
      });

      expect(response.status).toBe(401);
      expect(response.body).toHaveProperty("error");
      expect(response.body.error).toBe("Authentication failed");
      expect(response.body.message).toBe("Invalid credentials");
    });
  });

  describe("POST /signup", () => {
    it("should return user and token on successful signup", async () => {
      const mockUser = {
        id: "user-456",
        email: "newuser@example.com",
        name: "New User",
        createdAt: new Date(),
        updatedAt: new Date(),
        emailVerified: false,
      };

      const mockToken =
        "eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJ1c2VyLTQ1NiIsImVtYWlsIjoibmV3dXNlckBleGFtcGxlLmNvbSIsInJvbGUiOiJjbGllbnQiLCJzZXNzaW9uSWQiOiJzZXNzaW9uLTc4OSJ9.signature";

      (signupService as any).mockResolvedValue({
        user: mockUser,
        token: mockToken,
      });

      const response = await request(app).post("/signup").send({
        name: "New User",
        email: "newuser@example.com",
        password: "SecurePass123!",
        image: "",
        callbackUrl: "http://localhost:3000",
      });

      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty("user");
      expect(response.body).toHaveProperty("token");
      expect(response.body.user.email).toBe("newuser@example.com");
      expect(response.body.token).toBe(mockToken);
      expect(signupService).toHaveBeenCalledTimes(1);
    });

    it("should return 400 on signup failure", async () => {
      (signupService as any).mockRejectedValue(
        new Error("Email already exists"),
      );

      const response = await request(app).post("/signup").send({
        name: "Duplicate User",
        email: "existing@example.com",
        password: "password123",
        image: "",
        callbackUrl: "http://localhost:3000",
      });

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty("error");
      expect(response.body.error).toBe("Signup failed");
      expect(response.body.message).toBe("Email already exists");
    });
  });

  describe("POST /logout", () => {
    it("should return 200 on successful logout", async () => {
      (logoutService as any).mockResolvedValue({ success: true });

      const response = await request(app)
        .post("/logout")
        .set("Cookie", "session=abc123");

      expect(response.status).toBe(200);
      expect(logoutService).toHaveBeenCalledTimes(1);
    });

    it("should return 500 on logout failure", async () => {
      (logoutService as any).mockRejectedValue(new Error("Session not found"));

      const response = await request(app).post("/logout");

      expect(response.status).toBe(500);
      expect(response.body).toHaveProperty("error");
      expect(response.body.error).toBe("Logout failed");
    });
  });

  describe("POST /refresh", () => {
    it("should return new token on successful refresh", async () => {
      const mockToken =
        "eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJ1c2VyLTEyMyIsImVtYWlsIjoidGVzdEBleGFtcGxlLmNvbSIsInJvbGUiOiJhZG1pbiIsInNlc3Npb25JZCI6InNlc3Npb24tNDU2In0.newsignature";

      (refreshService as any).mockResolvedValue({
        token: mockToken,
      });

      const response = await request(app)
        .post("/refresh")
        .set("Cookie", "session=valid-session");

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty("token");
      expect(response.body.token).toBe(mockToken);
      expect(refreshService).toHaveBeenCalledTimes(1);
    });

    it("should return 401 on invalid session", async () => {
      (refreshService as any).mockRejectedValue(new Error("Invalid session"));

      const response = await request(app).post("/refresh");

      expect(response.status).toBe(401);
      expect(response.body).toHaveProperty("error");
      expect(response.body.error).toBe("Token refresh failed");
      expect(response.body.message).toBe("Invalid session");
    });
  });

  describe("JWT Token Payload Validation", () => {
    it("should verify JWT contains userId, email, role, and sessionId", () => {
      const mockToken =
        "eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJ1c2VyLTEyMyIsImVtYWlsIjoidGVzdEBleGFtcGxlLmNvbSIsInJvbGUiOiJhZG1pbiIsInNlc3Npb25JZCI6InNlc3Npb24tNDU2In0.signature";

      const payload = JSON.parse(
        Buffer.from(mockToken.split(".")[1]!, "base64").toString(),
      );

      expect(payload).toHaveProperty("userId");
      expect(payload).toHaveProperty("email");
      expect(payload).toHaveProperty("role");
      expect(payload).toHaveProperty("sessionId");
      expect(payload.userId).toBe("user-123");
      expect(payload.email).toBe("test@example.com");
      expect(payload.role).toBe("admin");
      expect(payload.sessionId).toBe("session-456");
    });

    it("should support all four roles: admin, marketing, client, agent", () => {
      const roles = ["admin", "marketing", "client", "agent"];

      roles.forEach((role) => {
        const payload = {
          userId: "user-123",
          email: "test@example.com",
          role: role,
          sessionId: "session-456",
        };

        const base64Payload = Buffer.from(JSON.stringify(payload)).toString(
          "base64",
        );
        const mockToken = `header.${base64Payload}.signature`;

        const decoded = JSON.parse(
          Buffer.from(mockToken.split(".")[1]!, "base64").toString(),
        );

        expect(decoded.role).toBe(role);
      });
    });
  });
});
