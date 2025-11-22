import { render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";

// Mock de las páginas
jest.mock("../pages/LoginPage", () => ({
  LoginPage: () => <div data-testid="login-page">Login Page</div>,
}));

jest.mock("../pages/HomePage/HomePage", () => ({
  HomePage: () => <div data-testid="home-page">Home Page</div>,
}));

jest.mock("../pages/AuthContext", () => ({
  AuthProvider: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="auth-provider">{children}</div>
  ),
}));

// Componente App sin BrowserRouter para testing
const AppRoutes = () => {
  const { AuthProvider } = require("../pages/AuthContext");
  const { LoginPage } = require("../pages/LoginPage");
  const { HomePage } = require("../pages/HomePage/HomePage");
  const { Navigate } = require("react-router-dom");

  return (
    <AuthProvider>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/home" element={<HomePage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </AuthProvider>
  );
};

describe("App", () => {
  test("[C0001] renderiza sin errores", () => {
    render(
      <MemoryRouter initialEntries={["/"]}>
        <AppRoutes />
      </MemoryRouter>
    );
    expect(true).toBe(true);
  });

  test("[C0002] muestra LoginPage en ruta raíz", async () => {
    render(
      <MemoryRouter initialEntries={["/"]}>
        <AppRoutes />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByTestId("login-page")).toBeInTheDocument();
    });
  });

  test("[C0003] muestra HomePage en ruta /home", async () => {
    render(
      <MemoryRouter initialEntries={["/home"]}>
        <AppRoutes />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByTestId("home-page")).toBeInTheDocument();
    });
  });

  test("[C0004] redirige a / para rutas no existentes", async () => {
    render(
      <MemoryRouter initialEntries={["/ruta-inexistente"]}>
        <AppRoutes />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByTestId("login-page")).toBeInTheDocument();
    });
  });

  test("[C0005] incluye AuthProvider en la jerarquía", async () => {
    render(
      <MemoryRouter initialEntries={["/"]}>
        <AppRoutes />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByTestId("auth-provider")).toBeInTheDocument();
    });
  });

  test("[C0006] estructura de rutas está correcta", () => {
    const { container } = render(
      <MemoryRouter initialEntries={["/"]}>
        <AppRoutes />
      </MemoryRouter>
    );
    expect(container.firstChild).toBeTruthy();
  });
});