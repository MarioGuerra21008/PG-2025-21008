import { render, screen } from "@testing-library/react";

import ExportProcessPages from "@/pages/ExportProcessPage";

describe("ExportProcessPage", () => {
  test("[C0187] muestra columnas principales", () => {
    render(<ExportProcessPages />);
    expect(screen.getByText("Formulario")).toBeInTheDocument();
    expect(screen.getByText("Intervalo")).toBeInTheDocument();
    expect(screen.getByText("Servidor")).toBeInTheDocument();
    expect(screen.getByText("Base de Datos")).toBeInTheDocument();
  });
});
