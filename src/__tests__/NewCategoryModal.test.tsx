import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import NewCategoryModal from "@/components/NewCategoryModal";

jest.mock("@/features/forms-list/hooks/useCategorias", () => ({
  useCreateCategoria: () => ({ mutate: jest.fn(), isPending: false }),
}));

describe("NewCategoryModal", () => {
  test("[C0016] Renderiza título y campos cuando visible=true", () => {
    render(
      <NewCategoryModal visible onCancel={() => {}} onCreate={() => {}} />
    );
    expect(screen.getByText("Nueva Categoría")).toBeInTheDocument();
    expect(screen.getByLabelText(/Nombre/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Descripción/i)).toBeInTheDocument();
  });

  test("[C0017] Clic en Cancelar llama onCancel", async () => {
    const user = userEvent.setup();
    const onCancel = jest.fn();
    render(
      <NewCategoryModal visible onCancel={onCancel} onCreate={() => {}} />
    );
    await user.click(screen.getByRole("button", { name: /Cancelar/i }));
    expect(onCancel).toHaveBeenCalledTimes(1);
  });
});
