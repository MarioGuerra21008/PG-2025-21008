import { render, screen } from "@testing-library/react";

import FormAssignmentPage from "..";

describe("FormAssignmentPage", () => {
  test("[C0188] renderiza contenedor principal (labels y botón)", () => {
    render(<FormAssignmentPage />);

    expect(screen.getByLabelText(/Formulario/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Usuario/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/T[íi]tulo/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Notas/i)).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /Asignar/i })
    ).toBeInTheDocument();
  });
});
