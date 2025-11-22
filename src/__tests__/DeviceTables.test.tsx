import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import DevicesTable, { ItemType } from "@/components/DeviceTables";

describe("DevicesTable", () => {
  const data: ItemType[] = [
    {
      key: "1",
      id: "A-001",
      descripcion: "Impresora",
      activa: true,
      centroCosto: "CC-01",
      lastLogon: "12/08/2025",
      version: "1.0.0",
    },
  ];

  test("[C0068] El ID desplegado es un link y llama onIdClick", async () => {
    const user = userEvent.setup();
    const onIdClick = jest.fn();
    render(
      <DevicesTable
        data={data}
        onEdit={jest.fn()}
        onDelete={jest.fn()}
        onIdClick={onIdClick}
        onCreate={jest.fn()}
      />
    );
    await user.click(screen.getByText("A-001"));
    expect(onIdClick).toHaveBeenCalledWith("A-001");
  });
});
