import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import NewFormModal from "@/components/CategoryTables/components/NewFormModal";

jest.mock("@/features/forms-list/hooks/useCategorias", () => ({
  useCategorias: () => ({
    categorias: [{ id: "cat-1", nombre: "Categoría 1" }],
    categoriasLoading: false,
    categoriasError: false,
    error: null,
  }),
  useCreateCategoria: () => ({ mutate: jest.fn(), isPending: false }),
}));

jest.mock("@/features/forms-list/hooks/useFormularios", () => ({
  useCreateFormulario: () => ({ mutate: jest.fn(), isPending: false }),
}));

describe("NewFormModal", () => {
  test("[C0066] Muestra campos principales y botones cuando visible=true", () => {
    render(<NewFormModal visible onCancel={() => {}} onCreate={() => {}} />);

    expect(screen.getByText("Adición de Formulario")).toBeInTheDocument();
    expect(screen.getByLabelText(/Título/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Descripción/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/^Desde$/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/^Hasta$/i)).toBeInTheDocument();
    expect(screen.getByText(/Permitir Fotos/i)).toBeInTheDocument();
    expect(screen.getByText(/Permitir GPS/i)).toBeInTheDocument();
    expect(screen.getByText(/¿Es Público\?/i)).toBeInTheDocument();
    expect(screen.getByText(/Auto Envío\?/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Categoría/i)).toBeInTheDocument();

    expect(
      screen.getByRole("button", { name: /Guardar/i })
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /Cancelar/i })
    ).toBeInTheDocument();
  });

  test("[C0067] Botón Cancelar ejecuta onCancel", async () => {
    const user = userEvent.setup();
    const onCancel = jest.fn();

    render(<NewFormModal visible onCancel={onCancel} onCreate={() => {}} />);

    await user.click(screen.getByRole("button", { name: /Cancelar/i }));
    expect(onCancel).toHaveBeenCalledTimes(1);
  });
});
