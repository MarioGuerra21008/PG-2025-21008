import { render, screen } from "@testing-library/react";

import AssignmentsProgressPage from "@/pages/AssignmentsProgressPage";

describe("AssignmentsProgressPage", () => {
  test("[C0180] muestra tabs y columnas del listado de progreso", () => {
    render(<AssignmentsProgressPage />);

    // Tabs visibles
    expect(
      screen.getByRole("button", { name: /En Proceso/i })
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /Autorizaciones\/Rechazos/i })
    ).toBeInTheDocument();

    // Encabezados de la tabla
    expect(
      screen.getByRole("columnheader", { name: /Formulario/i })
    ).toBeInTheDocument();
    expect(
      screen.getByRole("columnheader", { name: /Empezado/i })
    ).toBeInTheDocument();
    expect(
      screen.getByRole("columnheader", { name: /Terminado/i })
    ).toBeInTheDocument();
    expect(
      screen.getByRole("columnheader", { name: /Recibido/i })
    ).toBeInTheDocument();
    expect(
      screen.getByRole("columnheader", { name: /UserId/i })
    ).toBeInTheDocument();
    expect(
      screen.getByRole("columnheader", { name: /User From/i })
    ).toBeInTheDocument();
    expect(
      screen.getByRole("columnheader", { name: /Título/i })
    ).toBeInTheDocument();
    expect(
      screen.getByRole("columnheader", { name: /Notas/i })
    ).toBeInTheDocument();
  });
});
