import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import SuspendFormModal from "@/components/CategoryTables/components/SuspendFormModal";

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

describe("SuspendFormModal", () => {
  test("[C0047] muestra título y confirma/cancela; dispara onCancel", async () => {
    const user = userEvent.setup();
    const onCancel = jest.fn();

    render(
      <SuspendFormModal
        open
        onCancel={onCancel}
        onConfirm={jest.fn()}
        formTitle="Formulario"
      />
    );

    expect(screen.getByRole("dialog")).toBeInTheDocument();
    expect(screen.getByText(/Confirmar suspensi(ó|o)n/i)).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: /Cancelar|Cerrar/i }));
    expect(onCancel).toHaveBeenCalledTimes(1);
  });
});
