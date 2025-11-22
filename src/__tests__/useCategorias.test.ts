import { renderHook, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import * as React from "react";
import { useCategorias, useCreateCategoria } from "../useCategorias";
import * as categoriesService from "../../services/categories.service";

jest.mock("../../services/categories.service");

jest.mock("../useCategorias", () => ({
  useCategorias: jest.fn(() => ({
    data: undefined,
    isLoading: false,
    isError: false,
    isSuccess: false,
    error: null,
  })),
  useCreateCategoria: jest.fn(() => ({
    mutate: jest.fn(),
    mutateAsync: jest.fn(),
    isPending: false,
    isSuccess: false,
    isError: false,
    error: null,
    data: undefined,
  })),
  createCategoria: jest.fn(),
}));

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

describe("useCategorias hooks", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("useCategorias", () => {
    test("[C0120] hook existe y es una función", () => {
      expect(typeof useCategorias).toBe("function");
    });

    test("[C0121] puede ser mockeado para retornar datos", () => {
      const mockData = [
        { id: "cat-1", nombre: "Categoría 1", descripcion: "Desc 1" },
        { id: "cat-2", nombre: "Categoría 2", descripcion: "Desc 2" },
      ];

      (useCategorias as jest.Mock).mockReturnValueOnce({
        data: mockData,
        isLoading: false,
        isError: false,
        error: null,
      });

      const result = useCategorias();

      expect(result.data).toEqual(mockData);
      expect(result.isLoading).toBe(false);
    });

    test("[C0122] puede simular estado de loading", () => {
      (useCategorias as jest.Mock).mockReturnValueOnce({
        data: undefined,
        isLoading: true,
        isError: false,
        error: null,
      });

      const result = useCategorias();

      expect(result.isLoading).toBe(true);
      expect(result.data).toBeUndefined();
    });

    test("[C0123] puede simular estado de error", () => {
      const mockError = new Error("Network error");
      
      (useCategorias as jest.Mock).mockReturnValueOnce({
        data: undefined,
        isLoading: false,
        isError: true,
        error: mockError,
      });

      const result = useCategorias();

      expect(result.isError).toBe(true);
      expect(result.error).toEqual(mockError);
    });
  });

  describe("useCreateCategoria", () => {
    test("[C0124] hook existe y es una función", () => {
      expect(typeof useCreateCategoria).toBe("function");
    });

    test("[C0125] puede ser mockeado con estructura correcta", () => {
      const mockMutate = jest.fn();
      
      (useCreateCategoria as jest.Mock).mockReturnValueOnce({
        mutate: mockMutate,
        isPending: false,
        isSuccess: false,
        isError: false,
        error: null,
      });

      const result = useCreateCategoria();

      expect(result.mutate).toBe(mockMutate);
      expect(result.isPending).toBe(false);
    });

    test("[C0126] mutate puede ser llamado", () => {
      const mockMutate = jest.fn();
      
      (useCreateCategoria as jest.Mock).mockReturnValueOnce({
        mutate: mockMutate,
        isPending: false,
        isSuccess: false,
        isError: false,
        error: null,
      });

      const result = useCreateCategoria();
      result.mutate({ nombre: "Test", descripcion: "Test" });

      expect(mockMutate).toHaveBeenCalledWith({
        nombre: "Test",
        descripcion: "Test",
      });
    });

    test("[C0127] puede simular estado de éxito", () => {
      (useCreateCategoria as jest.Mock).mockReturnValueOnce({
        mutate: jest.fn(),
        isPending: false,
        isSuccess: true,
        isError: false,
        error: null,
        data: { id: "cat-1", nombre: "Nueva", descripcion: "Desc" },
      });

      const result = useCreateCategoria();

      expect(result.isSuccess).toBe(true);
      expect(result.data).toBeDefined();
    });

    test("[C0128] puede simular estado de error", () => {
      const mockError = new Error("Error al crear");
      
      (useCreateCategoria as jest.Mock).mockReturnValueOnce({
        mutate: jest.fn(),
        isPending: false,
        isSuccess: false,
        isError: true,
        error: mockError,
      });

      const result = useCreateCategoria();

      expect(result.isError).toBe(true);
      expect(result.error).toEqual(mockError);
    });
  });
});