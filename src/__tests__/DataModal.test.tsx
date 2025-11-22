import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import DataModal from "@/features/data-sources/components/DataModal";

describe("DataModal", () => {
  test("[C0116] Muestra dialog y botones", async () => {
    const user = userEvent.setup();
    const onCancel = jest.fn();
    render(<DataModal visible onCancel={onCancel} onSubmit={jest.fn()} />);

    expect(screen.getByRole("dialog")).toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: /Cancelar|Cerrar/i }));
    expect(onCancel).toHaveBeenCalled();
  });
});
