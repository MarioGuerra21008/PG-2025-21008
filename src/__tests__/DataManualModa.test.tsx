import { render, screen } from "@testing-library/react";

import DataManualModa from "@/features/data-sources/components/DataManualModa";

describe("DataManualModa", () => {
  test("[C0115] Muestra formulario manual", () => {
    render(<DataManualModa visible onCancel={() => {}} onSubmit={() => {}} />);
    expect(screen.getByRole("dialog")).toBeInTheDocument();
    expect(screen.getAllByRole("textbox").length).toBeGreaterThan(0);
  });
});
