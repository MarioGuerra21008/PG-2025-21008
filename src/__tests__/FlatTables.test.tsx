import { render, screen } from "@testing-library/react";

import FlatTables, { type Category } from "@/components/FlatTables";

type Row = { key: string; nombre: string };

describe("FlatTables", () => {
  const columns = [{ title: "Nombre", dataIndex: "nombre", key: "nombre" }];

  test("[C0070] Aplanar categorías y ocultar categorías vacías", () => {
    const data: Category<Row>[] = [
      { key: "a", name: "Cat A", items: [{ key: "1", nombre: "Uno" }] },
      { key: "b", name: "Cat B", items: [] },
    ];

    render(
      <FlatTables<Row>
        data={data}
        columns={columns as any}
        onTableChange={() => {}}
        hideEmptyCategories
      />
    );
    expect(screen.getByText("Uno")).toBeInTheDocument();
    expect(screen.queryByText("Cat B")).not.toBeInTheDocument();

    const rows = screen.getAllByRole("row");
    expect(rows.length).toBe(2);
  });
});
