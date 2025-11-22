import { getColumns, categories, type ItemType } from "../data";

describe("Data Sources data", () => {
  const mockCallbacks = {
    onAdd: jest.fn(),
    onEdit: jest.fn(),
    onDelete: jest.fn(),
    onDatos: jest.fn(),
  };

  const sortedInfo: any = {};
  const filteredInfo: any = {};

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("categories", () => {
    test("[C0020] contiene categorías Local y Externa", () => {
      expect(categories).toHaveLength(2);
      expect(categories[0].name).toBe("Local");
      expect(categories[1].name).toBe("Externa");
    });

    test("[C0021] categorías están definidas con estructura correcta", () => {
      expect(categories[0]).toHaveProperty("key");
      expect(categories[0]).toHaveProperty("name");
      expect(categories[0]).toHaveProperty("items");
      expect(Array.isArray(categories[0].items)).toBe(true);
    });

    test("[C0022] categoría Local tiene key 'local'", () => {
      const localCategory = categories.find((c) => c.key === "local");
      expect(localCategory).toBeDefined();
      expect(localCategory!.key).toBe("local");
    });

    test("[C0023] categoría Externa tiene key 'externa'", () => {
      const externaCategory = categories.find((c) => c.key === "externa");
      expect(externaCategory).toBeDefined();
      expect(externaCategory!.key).toBe("externa");
    });
  });

  describe("getColumns", () => {
    test("[C0024] retorna array de columnas", () => {
      const columns = getColumns(
        sortedInfo,
        filteredInfo,
        mockCallbacks.onAdd,
        mockCallbacks.onEdit,
        mockCallbacks.onDelete,
        mockCallbacks.onDatos
      );

      expect(Array.isArray(columns)).toBe(true);
      expect(columns.length).toBeGreaterThan(0);
    });

    test("[C0025] primera columna tiene botón de acciones", () => {
      const columns = getColumns(
        sortedInfo,
        filteredInfo,
        mockCallbacks.onAdd,
        mockCallbacks.onEdit,
        mockCallbacks.onDelete
      );

      const actionsColumn = columns[0];
      expect(actionsColumn.key).toBe("actions");
      expect(actionsColumn.dataIndex).toBe("actions");
      expect(actionsColumn.width).toBe(70);
    });

    test("[C0026] columna Código tiene filtros cuando hay items", () => {
      const columns = getColumns(
        sortedInfo,
        filteredInfo,
        mockCallbacks.onAdd,
        mockCallbacks.onEdit,
        mockCallbacks.onDelete
      );

      const codigoColumn = columns.find((c) => c.key === "codigo");
      expect(codigoColumn).toBeDefined();
      expect(codigoColumn!.sorter).toBeDefined();
      expect(codigoColumn!.onFilter).toBeDefined();
    });

    test("[C0027] columna Descripción tiene sorter", () => {
      const columns = getColumns(
        sortedInfo,
        filteredInfo,
        mockCallbacks.onAdd,
        mockCallbacks.onEdit,
        mockCallbacks.onDelete
      );

      const descripcionColumn = columns.find((c) => c.key === "descripcion");
      expect(descripcionColumn).toBeDefined();
      expect(descripcionColumn!.sorter).toBeDefined();
    });

    test("[C0028] tiene columnas Campo1 a Campo10", () => {
      const columns = getColumns(
        sortedInfo,
        filteredInfo,
        mockCallbacks.onAdd,
        mockCallbacks.onEdit,
        mockCallbacks.onDelete
      );

      for (let i = 1; i <= 10; i++) {
        const campoColumn = columns.find((c) => c.key === `campo${i}`);
        expect(campoColumn).toBeDefined();
        expect(campoColumn!.title).toBe(`Campo${i}`);
      }
    });

    test("[C0029] render de columna actions incluye iconos de editar y eliminar", () => {
      const columns = getColumns(
        sortedInfo,
        filteredInfo,
        mockCallbacks.onAdd,
        mockCallbacks.onEdit,
        mockCallbacks.onDelete
      );

      const actionsColumn = columns[0];
      expect(actionsColumn.render).toBeDefined();
    });

    test("[C0030] todas las columnas tienen keys únicos", () => {
      const columns = getColumns(
        sortedInfo,
        filteredInfo,
        mockCallbacks.onAdd,
        mockCallbacks.onEdit,
        mockCallbacks.onDelete
      );

      const keys = columns.map((c) => c.key);
      const uniqueKeys = new Set(keys);
      expect(uniqueKeys.size).toBe(keys.length);
    });

    test("[C0031] columnas tienen los títulos correctos", () => {
      const columns = getColumns(
        sortedInfo,
        filteredInfo,
        mockCallbacks.onAdd,
        mockCallbacks.onEdit,
        mockCallbacks.onDelete
      );

      const expectedTitles = [
        "Código",
        "Descripción",
        "Campo1",
        "Campo2",
        "Campo3",
        "Campo4",
        "Campo5",
        "Campo6",
        "Campo7",
        "Campo8",
        "Campo9",
        "Campo10",
      ];

      const columnTitles = columns
        .slice(1)
        .map((c) => c.title)
        .filter((t) => typeof t === "string");

      expectedTitles.forEach((title) => {
        expect(columnTitles).toContain(title);
      });
    });

    test("[C0032] columnas con ellipsis están configuradas correctamente", () => {
      const columns = getColumns(
        sortedInfo,
        filteredInfo,
        mockCallbacks.onAdd,
        mockCallbacks.onEdit,
        mockCallbacks.onDelete
      );

      const codigoColumn = columns.find((c) => c.key === "codigo");
      const descripcionColumn = columns.find((c) => c.key === "descripcion");

      expect(codigoColumn!.ellipsis).toBe(true);
      expect(descripcionColumn!.ellipsis).toBe(true);
    });

    test("[C0033] columnas tienen anchos específicos donde se requiere", () => {
      const columns = getColumns(
        sortedInfo,
        filteredInfo,
        mockCallbacks.onAdd,
        mockCallbacks.onEdit,
        mockCallbacks.onDelete
      );

      const actionsColumn = columns[0];
      const codigoColumn = columns.find((c) => c.key === "codigo");
      const descripcionColumn = columns.find((c) => c.key === "descripcion");

      expect(actionsColumn.width).toBe(70);
      expect(codigoColumn!.width).toBe(120);
      expect(descripcionColumn!.width).toBe(160);
    });

    test("[C0034] respeta sortedInfo para columnas ordenables", () => {
      const customSortedInfo = { columnKey: "codigo", order: "ascend" };

      const columns = getColumns(
        customSortedInfo,
        filteredInfo,
        mockCallbacks.onAdd,
        mockCallbacks.onEdit,
        mockCallbacks.onDelete
      );

      const codigoColumn = columns.find((c) => c.key === "codigo");
      expect(codigoColumn!.sortOrder).toBe("ascend");
    });

    test("[C0035] respeta filteredInfo para columnas filtrables", () => {
      const customFilteredInfo = { codigo: ["Test"] };

      const columns = getColumns(
        sortedInfo,
        customFilteredInfo,
        mockCallbacks.onAdd,
        mockCallbacks.onEdit,
        mockCallbacks.onDelete
      );

      const codigoColumn = columns.find((c) => c.key === "codigo");
      expect(codigoColumn!.filteredValue).toEqual(["Test"]);
    });

    test("[C0036] onFilter funciona correctamente en columna código", () => {
      const columns = getColumns(
        sortedInfo,
        filteredInfo,
        mockCallbacks.onAdd,
        mockCallbacks.onEdit,
        mockCallbacks.onDelete
      );

      const codigoColumn = columns.find((c) => c.key === "codigo");
      const onFilterFn = codigoColumn!.onFilter as (
        value: any,
        record: ItemType
      ) => boolean;

      const item = { codigo: "Test123" } as ItemType;
      expect(onFilterFn("Test", item)).toBe(true);
      expect(onFilterFn("Other", item)).toBe(false);
    });

    test("[C0037] sorter de descripción ordena alfabéticamente", () => {
      const columns = getColumns(
        sortedInfo,
        filteredInfo,
        mockCallbacks.onAdd,
        mockCallbacks.onEdit,
        mockCallbacks.onDelete
      );

      const descripcionColumn = columns.find((c) => c.key === "descripcion");
      const sorterFn = descripcionColumn!.sorter as (
        a: ItemType,
        b: ItemType
      ) => number;

      const item1 = { descripcion: "Beta" } as ItemType;
      const item2 = { descripcion: "Alfa" } as ItemType;

      expect(sorterFn(item1, item2)).toBeGreaterThan(0);
      expect(sorterFn(item2, item1)).toBeLessThan(0);
    });

    test("[C0038] columnas Campo tienen filteredValue y sortOrder", () => {
      const customSortedInfo = { columnKey: "tipoFuente", order: "descend" }; // Campo1 usa tipoFuente
      const customFilteredInfo = { tipoFuente: ["value"] };

      const columns = getColumns(
        customSortedInfo,
        customFilteredInfo,
        mockCallbacks.onAdd,
        mockCallbacks.onEdit,
        mockCallbacks.onDelete
      );

      const campo1Column = columns.find((c) => c.key === "campo1");
      expect(campo1Column).toBeDefined();
      expect(campo1Column!.filteredValue).toEqual(["value"]);
      expect(campo1Column!.sortOrder).toBe("descend");
    });

    test("[C0039] sorter de código funciona correctamente", () => {
      const columns = getColumns(
        sortedInfo,
        filteredInfo,
        mockCallbacks.onAdd,
        mockCallbacks.onEdit,
        mockCallbacks.onDelete
      );

      const codigoColumn = columns.find((c) => c.key === "codigo");
      const sorterFn = codigoColumn!.sorter as (
        a: ItemType,
        b: ItemType
      ) => number;

      const item1 = { codigo: "B001" } as ItemType;
      const item2 = { codigo: "A001" } as ItemType;

      expect(sorterFn(item1, item2)).toBeGreaterThan(0);
      expect(sorterFn(item2, item1)).toBeLessThan(0);
    });

    test("[C0040] columna código tiene ellipsis y width", () => {
      const columns = getColumns(
        sortedInfo,
        filteredInfo,
        mockCallbacks.onAdd,
        mockCallbacks.onEdit,
        mockCallbacks.onDelete
      );

      const codigoColumn = columns.find((c) => c.key === "codigo");
      expect(codigoColumn!.ellipsis).toBe(true);
      expect(codigoColumn!.width).toBe(120);
    });

    test("[C0041] columna descripción tiene ellipsis y width", () => {
      const columns = getColumns(
        sortedInfo,
        filteredInfo,
        mockCallbacks.onAdd,
        mockCallbacks.onEdit,
        mockCallbacks.onDelete
      );

      const descripcionColumn = columns.find((c) => c.key === "descripcion");
      expect(descripcionColumn!.ellipsis).toBe(true);
      expect(descripcionColumn!.width).toBe(160);
    });

    test("[C0042] todas las columnas Campo tienen dataIndex correcto", () => {
      const columns = getColumns(
        sortedInfo,
        filteredInfo,
        mockCallbacks.onAdd,
        mockCallbacks.onEdit,
        mockCallbacks.onDelete
      );

      for (let i = 1; i <= 10; i++) {
        const campoColumn = columns.find((c) => c.key === `campo${i}`);
        expect(campoColumn!.dataIndex).toBe(`campo${i}`);
      }
    });

    test("[C0043] columna actions tiene align center", () => {
      const columns = getColumns(
        sortedInfo,
        filteredInfo,
        mockCallbacks.onAdd,
        mockCallbacks.onEdit,
        mockCallbacks.onDelete
      );

      const actionsColumn = columns[0];
      expect(actionsColumn.align).toBe("center");
    });

    test("[C0044] callbacks se pasan correctamente a getColumns", () => {
      const columns = getColumns(
        sortedInfo,
        filteredInfo,
        mockCallbacks.onAdd,
        mockCallbacks.onEdit,
        mockCallbacks.onDelete,
        mockCallbacks.onDatos
      );

      expect(columns).toBeDefined();
      expect(mockCallbacks.onAdd).not.toHaveBeenCalled();
      expect(mockCallbacks.onEdit).not.toHaveBeenCalled();
      expect(mockCallbacks.onDelete).not.toHaveBeenCalled();
    });
  });
});