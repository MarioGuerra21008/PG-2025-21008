import { render, screen } from "@testing-library/react";

import ApprovalRoutesPage from "@/pages/ApprovalRoutesPage";

describe("ApprovalRoutesPage", () => {
  test("[C0179] renderiza la tabla de rutas con columnas básicas", () => {
    render(<ApprovalRoutesPage />);

    // Campo de búsqueda visible
    expect(
      screen.getByPlaceholderText(/Introduzca el texto a buscar/i)
    ).toBeInTheDocument();

    // Encabezados de tabla
    expect(
      screen.getByRole("columnheader", { name: /Route Id/i })
    ).toBeInTheDocument();
    expect(
      screen.getByRole("columnheader", { name: /Descripción/i })
    ).toBeInTheDocument();
    expect(
      screen.getByRole("columnheader", { name: /Dataset/i })
    ).toBeInTheDocument();
    expect(
      screen.getByRole("columnheader", { name: /Campo 1/i })
    ).toBeInTheDocument();
    expect(
      screen.getByRole("columnheader", { name: /Campo 2/i })
    ).toBeInTheDocument();
    expect(
      screen.getByRole("columnheader", { name: /Activo/i })
    ).toBeInTheDocument();
  });
});
