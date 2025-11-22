import { render, screen } from "@testing-library/react";

import PageEditModal from "@/features/create-forms/components/PageEditModal";

jest.mock("@/features/create-forms/hooks/useCreatePage", () => ({
  useCreatePagina: () => ({ mutate: jest.fn(), isPending: false, error: null }),
}));

describe("PageEditModal", () => {
  test("[C0075] Renderizar diálogo al editar página (shape PaginaAPI)", () => {
    const initialValues = {
      id: "p1",
      nombre: "Página 1",
      descripcion: "",
      secuencia: 1,
    };

    render(
      <PageEditModal
        visible
        formId="fake-form-id"
        onCancel={() => {}}
        onUpdate={() => {}}
        initialValues={initialValues}
        existingPages={[]}
      />
    );

    expect(screen.getByRole("dialog")).toBeInTheDocument();
  });
});
