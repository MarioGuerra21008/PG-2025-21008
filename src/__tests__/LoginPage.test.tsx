import { render, screen } from "@/test-utils";
import userEvent from "@testing-library/user-event";
import { LoginPage } from "../LoginPage";

const mockNavigate = jest.fn();

jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: () => mockNavigate,
}));

describe("LoginPage", () => {
  beforeEach(() => {
    mockNavigate.mockClear();
  });

  test("[C0178] renderiza el formulario de login", () => {
    render(<LoginPage />);
    
    expect(screen.getByPlaceholderText(/Usuario/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/Contraseña/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Entrar/i })).toBeInTheDocument();
  });
});