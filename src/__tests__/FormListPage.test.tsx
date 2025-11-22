import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import FormListPage from "@/pages/FormListPage";

jest.mock("@/features/forms-list/hooks/useCategorias", () => ({
  useCategorias: () => ({
    categorias: [],
    categoriasLoading: false,
    categoriasError: false,
    error: null,
  }),
  useCreateCategoria: () => ({ mutate: jest.fn(), isPending: false }),
}));

jest.mock("@/features/forms-list/hooks/useFormularios", () => ({
  useCreateFormulario: () => ({ mutate: jest.fn(), isPending: false }),
}));

jest.mock("@/features/forms-list", () => ({
  __esModule: true,
  default: () => <div data-testid="forms-lists-stub" />,
}));

describe("FormListPage", () => {
  test("[C0189] Muestra botones de Categoría y Nuevo + input de búsqueda", () => {
    render(<FormListPage onSelectForm={() => {}} />);
    expect(
      screen.getByRole("button", { name: /Categoría/i })
    ).toBeInTheDocument();
    expect(
      screen.getByPlaceholderText(/Introduzca el texto a buscar/i)
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /Crear categoria/i })
    ).toBeInTheDocument();
  });

  test("[C0190] Al hacer click en Nuevo se abre el modal de Nueva Categoría", async () => {
    const user = userEvent.setup();
    render(<FormListPage onSelectForm={() => {}} />);

    const nuevo = screen.getByRole("button", { name: /Crear categoria/i });
    await user.click(nuevo);

    expect(await screen.findByText("Nueva Categoría")).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /Guardar/i })
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /Cancelar/i })
    ).toBeInTheDocument();
  });
});
