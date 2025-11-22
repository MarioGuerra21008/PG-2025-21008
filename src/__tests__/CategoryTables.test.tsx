import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import CategoryTables, { type Category } from "@/components/CategoryTables";

type Row = { key: string; nombre: string };

describe("CategoryTables", () => {
  const columns = [{ title: "Nombre", dataIndex: "nombre", key: "nombre" }];

  test("[C0018] Renderiza encabezados de categorías y muestra filas al expandir", async () => {
    const user = userEvent.setup();

    const data: Category<Row>[] = [
      { key: "a", name: "Cat A", items: [{ key: "1", nombre: "Uno" }] },
      { key: "b", name: "Cat B", items: [{ key: "2", nombre: "Dos" }] },
    ];

    render(
      <CategoryTables<Row>
        data={data}
        columns={columns as any}
        onTableChange={() => {}}
      />
    );

    // Headers visibles
    const headerA = screen.getByRole("button", { name: /Categoría:\s*Cat A/i });
    const headerB = screen.getByRole("button", { name: /Categoría:\s*Cat B/i });
    expect(headerA).toBeInTheDocument();
    expect(headerB).toBeInTheDocument();

    // Expandir ambos panels
    await user.click(headerA);
    await user.click(headerB);

    // Filas visibles
    expect(screen.getByText("Uno")).toBeInTheDocument();
    expect(screen.getByText("Dos")).toBeInTheDocument();
  });

  test("[C0019] Soporta lista vacía sin crashear", () => {
    render(
      <CategoryTables<Row>
        data={[]}
        columns={columns as any}
        onTableChange={() => {}}
      />
    );
    expect(true).toBe(true);
  });
});
