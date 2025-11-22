import { render, screen, waitFor } from "@/test-utils";
import UserListPage from "../index";
import { api } from "@/features/user-autentication/services/auth.service";

const mockUsuarios = [
  {
    nombre_usuario: "user1",
    nombre: "Usuario 1",
    email: "user1@test.com",
    activo: true,
  },
  {
    nombre_usuario: "user2",
    nombre: "Usuario 2",
    email: "user2@test.com",
    activo: true,
  },
];

describe("UserListPage", () => {
  test("[C0193] renderiza tabla de usuarios", async () => {
    // Mock del api.get para usuarios
    (api.get as jest.Mock).mockResolvedValueOnce({ data: mockUsuarios });

    render(<UserListPage />);

    // Esperar a que la tabla se renderice
    await waitFor(() => {
      expect(screen.getByRole("table")).toBeInTheDocument();
    });
  });
});