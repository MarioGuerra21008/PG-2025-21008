import { render, screen } from "@testing-library/react";

import FormsSettings from "../Forms-Settings";

jest.mock("@/features/create-forms/hooks/usePaginas", () => ({
  __esModule: true,
  usePaginas: jest.fn(() => ({
    data: [{ id: "p1", title: "Página 1", description: "", sequence: 1 }],
    isLoading: false,
    error: null,
  })),
}));

jest.mock("../PageEditModal", () => {
  const React = require("react");
  return {
    __esModule: true,
    default: () =>
      React.createElement("div", { "data-testid": "page-edit-modal" }),
  };
});

jest.mock("@/features/create-forms/hooks/useCreatePage", () => ({
  __esModule: true,
  useCreatePage: jest.fn(() => ({ mutateAsync: jest.fn() })),
}));

jest.mock("@/features/create-forms/hooks/useCampoActual", () => ({
  __esModule: true,
  usePostCamposActualBatch: jest.fn(() => ({ mutateAsync: jest.fn() })),
}));

describe("Forms-Settings", () => {
  test("[C0074] muestra opciones de configuración visibles en el DOM", () => {
    render(<FormsSettings compiledList={[]} pages={[]} />);

    // Usa heading exacto
    expect(
      screen.getByRole("heading", { name: /^Página$/i })
    ).toBeInTheDocument();
    expect(screen.getByText(/Selecciona una página/i)).toBeInTheDocument();
    expect(screen.getByText(/^Secuencia$/i)).toBeInTheDocument();
    expect(screen.getByText(/^Descripción$/i)).toBeInTheDocument();
    expect(screen.getByText(/^Título$/i)).toBeInTheDocument();
  });
});
