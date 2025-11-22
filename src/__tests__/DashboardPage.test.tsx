import { render, screen } from "@testing-library/react";

import DashboardPage from "..";

describe("DashboardPage", () => {
  test("[C0184] renderiza sin errores y muestra al menos un chart", () => {
    render(<DashboardPage />);

    const charts = [
      ...screen.queryAllByTestId("ant-plot-line"),
      ...screen.queryAllByTestId("ant-plot-pie"),
      ...screen.queryAllByTestId("ant-plot-column"),
      ...screen.queryAllByTestId("ant-plot-area"),
    ];

    expect(charts.length).toBeGreaterThan(0);
  });
});
