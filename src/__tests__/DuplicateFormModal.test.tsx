import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import DuplicateFormModal from "@/components/CategoryTables/components/DuplicateFormModal";

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

describe("DuplicateFormModal", () => {
  test("[C0046] muestra título y botones; dispara onCancel", async () => {
    const user = userEvent.setup();
    const onCancel = jest.fn();

    render(
      <DuplicateFormModal
        open
        onCancel={onCancel}
        onConfirm={jest.fn()}
        formTitle="Formulario"
      />
    );

    expect(screen.getByRole("dialog")).toBeInTheDocument();
    expect(screen.getByText(/Confirmar duplicaci(ó|o)n/i)).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: /Cancelar|Cerrar/i }));
    expect(onCancel).toHaveBeenCalledTimes(1);
  });
});
