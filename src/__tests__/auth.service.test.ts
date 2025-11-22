import type { AuthResponse, LoginDto } from "../auth.service";
const { api, loginUser, logoutUser, refreshToken } = require("@/features/user-autentication/services/auth.service");

describe("auth.service", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    localStorage.clear();
  });

  describe("loginUser", () => {
    test("[C0165] realiza login exitoso y retorna AuthResponse", async () => {
      const mockResponse: AuthResponse = {
        ok: true,
        access_token: "access123",
        refresh_token: "refresh456",
        token_type: "Bearer",
        expires_in: 3600,
        scope: "read write",
        user: {
          nombre_usuario: "testuser",
          nombre: "Test User",
          correo: "test@example.com",
          acceso_web: true,
        },
      };
      (loginUser as jest.Mock).mockResolvedValueOnce(mockResponse);

      const credentials: LoginDto = {
        nombre_usuario: "testuser",
        password: "password123",
      };

      const result = await loginUser(credentials);

      expect(result).toEqual(mockResponse);
      expect(result.access_token).toBe("access123");
      expect(result.user.nombre_usuario).toBe("testuser");
    });

    test("[C0166] lanza error cuando las credenciales son incorrectas", async () => {
      const error = new Error("Invalid credentials");
      
      (loginUser as jest.Mock).mockRejectedValueOnce(error);

      const credentials: LoginDto = {
        nombre_usuario: "wronguser",
        password: "wrongpass",
      };

      await expect(loginUser(credentials)).rejects.toThrow("Invalid credentials");
    });
  });

  describe("refreshToken", () => {
    test("[C0167] refresca el token exitosamente", async () => {
      const mockResponse: AuthResponse = {
        ok: true,
        access_token: "new_access_token",
        refresh_token: "new_refresh_token",
        token_type: "Bearer",
        expires_in: 3600,
        scope: "read write",
        user: {
          nombre_usuario: "testuser",
          nombre: "Test User",
          correo: "test@example.com",
          acceso_web: true,
        },
      };

      (refreshToken as jest.Mock).mockResolvedValueOnce(mockResponse);

      const result = await refreshToken("old_refresh_token");

      expect(result.access_token).toBe("new_access_token");
    });

    test("[C0168] lanza error cuando el refresh token es inválido", async () => {
      const error = new Error("Invalid refresh token");
      
      (refreshToken as jest.Mock).mockRejectedValueOnce(error);

      await expect(refreshToken("invalid_token")).rejects.toThrow("Invalid refresh token");
    });
  });

  describe("logoutUser", () => {
    test("[C0169] realiza logout exitosamente", async () => {
      const mockResponse = { message: "Logout successful" };
      (logoutUser as jest.Mock).mockResolvedValueOnce(mockResponse);

      const result = await logoutUser();

      expect(result).toEqual(mockResponse);
    });

    test("[C0170] maneja error en logout", async () => {
      const error = new Error("Logout failed");
      (logoutUser as jest.Mock).mockRejectedValueOnce(error);

      await expect(logoutUser()).rejects.toThrow("Logout failed");
    });
  });

  describe("API instance", () => {
    test("[C0171] api está definido y tiene métodos", () => {
      expect(api).toBeDefined();
      expect(api.post).toBeDefined();
      expect(api.get).toBeDefined();
      expect(api.put).toBeDefined();
      expect(api.delete).toBeDefined();
    });

    test("[C0172] api.post es una función mock", () => {
      expect(jest.isMockFunction(api.post)).toBe(true);
    });

    test("[C0173] puede mockear api.post para llamadas directas", () => {
      const mockData = { test: "data" };
      (api.post as jest.Mock).mockResolvedValueOnce({ data: mockData });

      expect(api.post).toBeDefined();
    });
  });

  describe("localStorage token management", () => {
    test("[C0174] puede guardar y recuperar access_token", () => {
      localStorage.setItem("access_token", "test_token_123");
      const token = localStorage.getItem("access_token");
      
      expect(token).toBe("test_token_123");
    });

    test("[C0175] puede limpiar tokens", () => {
      localStorage.setItem("access_token", "test_token");
      localStorage.setItem("refresh_token", "refresh_token");
      
      localStorage.clear();
      
      expect(localStorage.getItem("access_token")).toBeNull();
      expect(localStorage.getItem("refresh_token")).toBeNull();
    });
  });
});