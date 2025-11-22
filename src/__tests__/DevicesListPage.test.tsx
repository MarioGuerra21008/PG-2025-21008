import { render, screen } from "@testing-library/react";

import DevicesListPage from "@/pages/DevicesListPage";

describe("DevicesListPage", () => {
  test("[C0186] existe una tabla de dispositivos o filtros", () => {
    render(<DevicesListPage />);
    expect(screen.getByRole("table", { hidden: true })).toBeInTheDocument();
  });
});
