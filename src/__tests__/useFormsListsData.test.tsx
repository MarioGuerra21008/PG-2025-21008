import { renderHook, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import * as React from "react";
import { useFormsListsData } from "../useFormsListsData";
import * as categoriesService from "../../services/categories.service";
import * as formsServices from "../../services/forms-services";

jest.mock("@/features/user-autentication/services/auth.service", () => {
  const mockApi = {
    defaults: { headers: { common: {} } },
    get: jest.fn(),
    post: jest.fn(),
    put: jest.fn(),
    delete: jest.fn(),
    interceptors: {
      request: {
        use: jest.fn((fn) => fn),
        eject: jest.fn(),
      },
      response: {
        use: jest.fn(),
        eject: jest.fn(),
      },
    },
  };

  return {
    api: mockApi,
    loginUser: jest.fn(),
    logoutUser: jest.fn(),
    refreshToken: jest.fn(),
  };
});

// Mock de los servicios
jest.mock("../../services/categories.service");
jest.mock("../../services/forms-services");

const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false },
    },
    logger: { log: console.log, warn: console.warn, error: () => {} },
  });
  
  const Wrapper = ({ children }: { children: React.ReactNode }) => {
    return React.createElement(
      QueryClientProvider,
      { client: queryClient },
      children
    );
  };
  
  return Wrapper;
};

describe("useFormsListsData", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("[C0129] combina categorías y formularios correctamente", async () => {
    const mockCategorias = [
      { id: "cat-1", nombre: "Categoría 1", descripcion: "Desc 1" },
      { id: "cat-2", nombre: "Categoría 2", descripcion: "Desc 2" },
    ];

    const mockFormularios = [
      {
        id: "form-1",
        nombre: "Formulario 1",
        categoria: "cat-1",
        disponible_desde_fecha: "2024-01-01T00:00:00Z",
        disponible_hasta_fecha: "2024-12-31T23:59:59Z",
        estado: "activo",
        es_publico: true,
        auto_envio: false,
      },
      {
        id: "form-2",
        nombre: "Formulario 2",
        categoria: "cat-1",
        disponible_desde_fecha: "2024-01-01T00:00:00Z",
        disponible_hasta_fecha: "2024-12-31T23:59:59Z",
        estado: "activo",
        es_publico: false,
        auto_envio: true,
      },
      {
        id: "form-3",
        nombre: "Formulario 3",
        categoria: "cat-2",
        disponible_desde_fecha: "2024-01-01T00:00:00Z",
        disponible_hasta_fecha: "2024-12-31T23:59:59Z",
        estado: "inactivo",
        es_publico: true,
        auto_envio: false,
      },
    ];

    (categoriesService.getCategorias as jest.Mock).mockResolvedValueOnce(
      mockCategorias
    );
    (formsServices.getFormularios as jest.Mock).mockResolvedValueOnce(
      mockFormularios
    );

    const { result } = renderHook(() => useFormsListsData(), {
      wrapper: createWrapper(),
    });

    await waitFor(() => {
      expect(result.current.categoriesData).toHaveLength(2);
    });

    const cat1 = result.current.categoriesData.find((c) => c.key === "cat-1");
    const cat2 = result.current.categoriesData.find((c) => c.key === "cat-2");

    expect(cat1).toBeDefined();
    expect(cat1!.items).toHaveLength(2);
    expect(cat2).toBeDefined();
    expect(cat2!.items).toHaveLength(1);
  });

  test("[C0130] ignora formularios sin categoría", async () => {
    const mockCategorias = [
      { id: "cat-1", nombre: "Categoría 1", descripcion: "Desc 1" },
    ];

    const mockFormularios = [
      {
        id: "form-1",
        nombre: "Formulario 1",
        categoria: "cat-1",
        disponible_desde_fecha: "2024-01-01T00:00:00Z",
        disponible_hasta_fecha: "2024-12-31T23:59:59Z",
        estado: "activo",
        es_publico: true,
        auto_envio: false,
      },
      {
        id: "form-2",
        nombre: "Formulario sin categoría",
        categoria: null,
        disponible_desde_fecha: "2024-01-01T00:00:00Z",
        disponible_hasta_fecha: "2024-12-31T23:59:59Z",
        estado: "activo",
        es_publico: false,
        auto_envio: false,
      },
    ];

    (categoriesService.getCategorias as jest.Mock).mockResolvedValueOnce(
      mockCategorias
    );
    (formsServices.getFormularios as jest.Mock).mockResolvedValueOnce(
      mockFormularios
    );

    const { result } = renderHook(() => useFormsListsData(), {
      wrapper: createWrapper(),
    });

    await waitFor(() => {
      expect(result.current.categoriesData).toHaveLength(1);
    });

    const cat1 = result.current.categoriesData[0];
    expect(cat1.items).toHaveLength(1);
    expect(cat1.items[0].id).toBe("form-1");
  });

  test("[C0131] formatea fechas correctamente", async () => {
    const mockCategorias = [
      { id: "cat-1", nombre: "Categoría 1", descripcion: "Desc 1" },
    ];

    const mockFormularios = [
      {
        id: "form-1",
        nombre: "Formulario 1",
        categoria: "cat-1",
        disponible_desde_fecha: "2024-03-15T00:00:00Z",
        disponible_hasta_fecha: "2024-09-20T23:59:59Z",
        estado: "activo",
        es_publico: true,
        auto_envio: false,
      },
    ];

    (categoriesService.getCategorias as jest.Mock).mockResolvedValueOnce(
      mockCategorias
    );
    (formsServices.getFormularios as jest.Mock).mockResolvedValueOnce(
      mockFormularios
    );

    const { result } = renderHook(() => useFormsListsData(), {
      wrapper: createWrapper(),
    });

    await waitFor(() => {
      expect(result.current.categoriesData).toHaveLength(1);
    });

    const item = result.current.categoriesData[0].items[0];
    expect(item.desde).toMatch(/\d{2}\/\d{2}\/\d{4}/);
    expect(item.hasta).toMatch(/\d{2}\/\d{2}\/\d{4}/);
  });

  test("[C0132] maneja estado de loading", async () => {
    (categoriesService.getCategorias as jest.Mock).mockImplementation(
      () => new Promise((resolve) => setTimeout(() => resolve([]), 100))
    );
    (formsServices.getFormularios as jest.Mock).mockImplementation(
      () => new Promise((resolve) => setTimeout(() => resolve([]), 100))
    );

    const { result } = renderHook(() => useFormsListsData(), {
      wrapper: createWrapper(),
    });

    expect(result.current.isLoading).toBe(true);

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });
  });

  test("[C0133] retorna array vacío cuando no hay datos", async () => {
    (categoriesService.getCategorias as jest.Mock).mockResolvedValueOnce([]);
    (formsServices.getFormularios as jest.Mock).mockResolvedValueOnce([]);

    const { result } = renderHook(() => useFormsListsData(), {
      wrapper: createWrapper(),
    });

    await waitFor(() => {
      expect(result.current.categoriesData).toEqual([]);
    });
  });

  test("[C0134] mapea correctamente las propiedades del formulario", async () => {
    const mockCategorias = [
      { id: "cat-1", nombre: "Test", descripcion: "Test" },
    ];

    const mockFormularios = [
      {
        id: "form-1",
        nombre: "Form Test",
        categoria: "cat-1",
        disponible_desde_fecha: "2024-01-01T00:00:00Z",
        disponible_hasta_fecha: "2024-12-31T23:59:59Z",
        estado: "activo",
        es_publico: true,
        auto_envio: true,
      },
    ];

    (categoriesService.getCategorias as jest.Mock).mockResolvedValueOnce(
      mockCategorias
    );
    (formsServices.getFormularios as jest.Mock).mockResolvedValueOnce(
      mockFormularios
    );

    const { result } = renderHook(() => useFormsListsData(), {
      wrapper: createWrapper(),
    });

    await waitFor(() => {
      expect(result.current.categoriesData).toHaveLength(1);
    });

    const item = result.current.categoriesData[0].items[0];
    expect(item.key).toBe("form-1");
    expect(item.id).toBe("form-1");
    expect(item.titulo).toBe("Form Test");
    expect(item.estado).toBe("activo");
    expect(item.esPublico).toBe(true);
    expect(item.autoEnvio).toBe(true);
  });

  test("[C0135] no refetch en focus por defecto", async () => {
    const mockCategorias = [
      { id: "cat-1", nombre: "Test", descripcion: "Test" },
    ];
    const mockFormularios: never[] = [];

    (categoriesService.getCategorias as jest.Mock).mockResolvedValue(
      mockCategorias
    );
    (formsServices.getFormularios as jest.Mock).mockResolvedValue(
      mockFormularios
    );

    renderHook(() => useFormsListsData(), {
      wrapper: createWrapper(),
    });

    await waitFor(() => {
      expect(categoriesService.getCategorias).toHaveBeenCalledTimes(1);
    });

    // Simular focus
    window.dispatchEvent(new Event("focus"));

    // No debería volver a llamar
    await new Promise((resolve) => setTimeout(resolve, 100));
    expect(categoriesService.getCategorias).toHaveBeenCalledTimes(1);
  });

  test("[C0136] categorías vacías se mantienen en el resultado", async () => {
    const mockCategorias = [
      { id: "cat-1", nombre: "Con formularios", descripcion: "" },
      { id: "cat-2", nombre: "Sin formularios", descripcion: "" },
    ];

    const mockFormularios = [
      {
        id: "form-1",
        nombre: "Form 1",
        categoria: "cat-1",
        disponible_desde_fecha: "2024-01-01T00:00:00Z",
        disponible_hasta_fecha: "2024-12-31T23:59:59Z",
        estado: "activo",
        es_publico: true,
        auto_envio: false,
      },
    ];

    (categoriesService.getCategorias as jest.Mock).mockResolvedValueOnce(
      mockCategorias
    );
    (formsServices.getFormularios as jest.Mock).mockResolvedValueOnce(
      mockFormularios
    );

    const { result } = renderHook(() => useFormsListsData(), {
      wrapper: createWrapper(),
    });

    await waitFor(() => {
      expect(result.current.categoriesData).toHaveLength(2);
    });

    const cat2 = result.current.categoriesData.find((c) => c.key === "cat-2");
    expect(cat2).toBeDefined();
    expect(cat2!.items).toHaveLength(0);
  });
});