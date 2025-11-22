import { render, screen, waitFor } from "@/test-utils";
import userEvent from "@testing-library/user-event";
import UsersListFeature from "../index";
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

describe("UsersListFeature", () => {
  beforeEach(() => {
    // Mock del api.get antes de cada test
    (api.get as jest.Mock).mockResolvedValue({ data: mockUsuarios });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test("[C0176] muestra tabla de usuarios", async () => {
    render(<UsersListFeature />);

    await waitFor(() => {
      expect(screen.getByRole("table")).toBeInTheDocument();
    });
  });

  describe("(buscador)", () => {
    test("[C0177] permite escribir en el filtro", async () => {
      render(<UsersListFeature />);

      // Esperar a que cargue
      await waitFor(() => {
        expect(screen.getByRole("table")).toBeInTheDocument();
      });

      const input = screen.getByPlaceholderText(/Introduzca el texto a buscar/i);
      
      await userEvent.type(input, "user1");
      
      expect(input).toHaveValue("user1");
    });
  });
});