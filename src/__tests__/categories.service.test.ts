import { api } from "@/features/user-autentication/services/auth.service";
import { getCategorias, type Categoria } from "../categories.service";

describe("categories.service", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("getCategorias", () => {
    test("[C0149] obtiene lista de categorías exitosamente", async () => {
      const mockCategorias: Categoria[] = [
        {
          id: "cat-1",
          nombre: "Categoría 1",
          descripcion: "Descripción de categoría 1",
        },
        {
          id: "cat-2",
          nombre: "Categoría 2",
          descripcion: "Descripción de categoría 2",
        },
        {
          id: "cat-3",
          nombre: "Categoría 3",
          descripcion: "Descripción de categoría 3",
        },
      ];

      (api.get as jest.Mock).mockResolvedValueOnce({ data: mockCategorias });

      const result = await getCategorias();

      expect(api.get).toHaveBeenCalledWith("/api/categorias/");
      expect(result).toEqual(mockCategorias);
      expect(result).toHaveLength(3);
    });

    test("[C0150] retorna array vacío cuando no hay categorías", async () => {
      (api.get as jest.Mock).mockResolvedValueOnce({ data: [] });

      const result = await getCategorias();

      expect(result).toEqual([]);
      expect(result).toHaveLength(0);
    });

    test("[C0151] maneja error de red", async () => {
      (api.get as jest.Mock).mockRejectedValueOnce(
        new Error("Network error")
      );

      await expect(getCategorias()).rejects.toThrow("Network error");
    });

    test("[C0152] cada categoría tiene la estructura correcta", async () => {
      const mockCategorias: Categoria[] = [
        {
          id: "cat-1",
          nombre: "Test",
          descripcion: "Test desc",
        },
      ];

      (api.get as jest.Mock).mockResolvedValueOnce({ data: mockCategorias });

      const result = await getCategorias();

      expect(result[0]).toHaveProperty("id");
      expect(result[0]).toHaveProperty("nombre");
      expect(result[0]).toHaveProperty("descripcion");
      expect(typeof result[0].id).toBe("string");
      expect(typeof result[0].nombre).toBe("string");
    });
  });
});