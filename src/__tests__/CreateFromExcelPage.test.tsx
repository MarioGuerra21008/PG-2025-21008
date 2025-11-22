import { render, screen } from "@testing-library/react";

import CreateFromExcelPage from "@/pages/CreateFromExcelPage";

describe("CreateFromExcelPage", () => {
  test("[C0182] El botón cargar está deshabilitado inicialmente", () => {
    render(<CreateFromExcelPage />);
    const btn = screen.getByRole("button", { name: /CARGAR/i });
    expect(btn).toBeDisabled();
  });

  test("[C0183] Muestra título de sección para subir Excel", () => {
    render(<CreateFromExcelPage />);
    expect(
      screen.getByText(/Seleccione el archivo Excel:/i)
    ).toBeInTheDocument();
  });
});
