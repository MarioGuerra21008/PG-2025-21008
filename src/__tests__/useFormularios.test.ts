import { renderHook, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import * as React from "react";
import {
  useFormularios,
  useFormulario,
  useCreateFormulario,
  useDeleteFormulario,
  useDuplicateFormulario,
  useCrearAsignacion,
  useCrearAsignacionMultiple,
} from "../useFormularios";
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

describe("useFormularios hooks", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("useFormularios", () => {
    test("[C0137] obtiene lista de formularios", async () => {
      const mockFormularios = [
        { id: 1, nombre: "Form 1", descripcion: "Desc 1", paginas: [] },
        { id: 2, nombre: "Form 2", descripcion: "Desc 2", paginas: [] },
      ];

      (formsServices.getFormularios as jest.Mock).mockResolvedValueOnce(
        mockFormularios
      );

      const { result } = renderHook(() => useFormularios(), {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(result.current.data).toEqual(mockFormularios);
      });

      expect(formsServices.getFormularios).toHaveBeenCalledTimes(1);
    });

    test("[C0138] maneja estado de loading", async () => {
      (formsServices.getFormularios as jest.Mock).mockImplementation(
        () => new Promise((resolve) => setTimeout(() => resolve([]), 100))
      );

      const { result } = renderHook(() => useFormularios(), {
        wrapper: createWrapper(),
      });

      // Inicialmente no tiene data
      expect(result.current.data).toBeUndefined();

      await waitFor(() => {
        expect(result.current.data).toEqual([]);
      });
    });
  });

  describe("useFormulario", () => {
    test("[C0139] obtiene un formulario por ID", async () => {
      const mockFormulario = {
        id: 1,
        nombre: "Test Form",
        descripcion: "Test",
        paginas: ["p1", "p2"],
      };

      (formsServices.getFormularioById as jest.Mock).mockResolvedValueOnce(
        mockFormulario
      );

      const { result } = renderHook(() => useFormulario("1"), {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(result.current.data).toEqual(mockFormulario);
      });

      expect(formsServices.getFormularioById).toHaveBeenCalledWith(
        "1",
        expect.objectContaining({})
      );
    });

    test("[C0140] no hace fetch cuando ID está vacío", () => {
      renderHook(() => useFormulario(""), {
        wrapper: createWrapper(),
      });

      expect(formsServices.getFormularioById).not.toHaveBeenCalled();
    });
  });

  describe("useCreateFormulario", () => {
    test("[C0141] crea formulario y actualiza cache", async () => {
      const newForm = {
        id: 3,
        nombre: "Nuevo Form",
        descripcion: "Nueva desc",
        paginas: [],
      };

      (formsServices.createFormulario as jest.Mock).mockResolvedValueOnce(
        newForm
      );

      const { result } = renderHook(() => useCreateFormulario(), {
        wrapper: createWrapper(),
      });

      result.current.mutate({
        nombre: "Nuevo Form",
        descripcion: "Nueva desc",
      });

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      expect(formsServices.createFormulario).toHaveBeenCalledWith({
        nombre: "Nuevo Form",
        descripcion: "Nueva desc",
      });
    });

    test("[C0142] maneja errores al crear formulario", async () => {
      (formsServices.createFormulario as jest.Mock).mockRejectedValueOnce(
        new Error("Error al crear")
      );

      const { result } = renderHook(() => useCreateFormulario(), {
        wrapper: createWrapper(),
      });

      result.current.mutate({
        nombre: "Test",
        descripcion: "Test",
      });

      await waitFor(() => {
        expect(result.current.isError).toBe(true);
      });
    });
  });

  describe("useDeleteFormulario", () => {
    test("[C0143] elimina formulario y actualiza cache", async () => {
      (formsServices.deleteFormulario as jest.Mock).mockResolvedValueOnce(
        undefined
      );

      const { result } = renderHook(() => useDeleteFormulario(), {
        wrapper: createWrapper(),
      });

      result.current.mutate("1");

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      expect(formsServices.deleteFormulario).toHaveBeenCalledWith("1");
    });

    test("[C0144] maneja error al eliminar", async () => {
      (formsServices.deleteFormulario as jest.Mock).mockRejectedValueOnce(
        new Error("No se puede eliminar")
      );

      const { result } = renderHook(() => useDeleteFormulario(), {
        wrapper: createWrapper(),
      });

      result.current.mutate("1");

      await waitFor(() => {
        expect(result.current.isError).toBe(true);
      });
    });
  });

  describe("useDuplicateFormulario", () => {
    test("[C0145] duplica formulario exitosamente", async () => {
      const duplicated = {
        id: 4,
        nombre: "Form (Copia)",
        descripcion: "Copia",
        paginas: [],
      };

      (formsServices.duplicateFormulario as jest.Mock).mockResolvedValueOnce(
        duplicated
      );

      const { result } = renderHook(() => useDuplicateFormulario(), {
        wrapper: createWrapper(),
      });

      result.current.mutate("1");

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      expect(formsServices.duplicateFormulario).toHaveBeenCalledWith("1");
    });

    test("[C0146] maneja error al duplicar", async () => {
      (formsServices.duplicateFormulario as jest.Mock).mockRejectedValueOnce(
        new Error("Error al duplicar")
      );

      const { result } = renderHook(() => useDuplicateFormulario(), {
        wrapper: createWrapper(),
      });

      result.current.mutate("1");

      await waitFor(() => {
        expect(result.current.isError).toBe(true);
      });

      // console.error ya está mockeado globalmente en setupTests.ts
    });
  });

  describe("useCrearAsignacion", () => {
    test("[C0147] crea asignación exitosamente", async () => {
      (formsServices.crearAsignacion as jest.Mock).mockResolvedValueOnce({
        detail: "Asignación creada",
      });

      const { result } = renderHook(() => useCrearAsignacion(), {
        wrapper: createWrapper(),
      });

      result.current.mutate({
        usuario: "user123",
        formularios: ["form1", "form2"],
      });

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      expect(formsServices.crearAsignacion).toHaveBeenCalledWith({
        usuario: "user123",
        formularios: ["form1", "form2"],
      });
    });
  });

  describe("useCrearAsignacionMultiple", () => {
    test("[C0148] crea asignaciones múltiples exitosamente", async () => {
      (
        formsServices.crearAsignacionMultipleUsuarios as jest.Mock
      ).mockResolvedValueOnce({
        ok: [
          { usuario: "user1", data: {} },
          { usuario: "user2", data: {} },
        ],
        errors: [],
      });

      const { result } = renderHook(() => useCrearAsignacionMultiple(), {
        wrapper: createWrapper(),
      });

      result.current.mutate({
        usuarios: ["user1", "user2"],
        formularios: ["form1"],
      });

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      expect(
        formsServices.crearAsignacionMultipleUsuarios
      ).toHaveBeenCalledWith(["user1", "user2"], ["form1"]);
    });
  });
});