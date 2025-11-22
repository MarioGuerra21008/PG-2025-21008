import { render, screen } from "@testing-library/react";

import DataSourcesPage from "..";

describe("DataSourcesPage", () => {
  test("[C0185] muestra controles base (botón agregar/filtrar o tabla)", () => {
    render(<DataSourcesPage />);

    expect(screen.getAllByRole("columnheader", { name: /Código/i }).length).toBeGreaterThan(0);

    const tables = screen.getAllByRole("table", { hidden: true });
    expect(tables.length).toBeGreaterThan(0);
  });
});
