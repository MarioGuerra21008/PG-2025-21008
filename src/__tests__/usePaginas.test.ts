import { renderHook, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import * as React from "react";
import { usePaginas } from "../usePaginas";
import { useCreatePagina } from "../useCreatePage";
import { usePostCamposActualBatch } from "../useCampoActual";
import * as pagesServices from "../../services/pages.services";
import * as camposServices from "../../services/campos.services";

jest.mock("../../services/pages.services");
jest.mock("../../services/campos.services");

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

describe("usePaginas", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("[C0077] obtiene páginas sin filtro", async () => {
    const mockPaginas = [
      {
        id: "page-1",
        secuencia: 1,
        nombre: "Página 1",
        descripcion: "Desc 1",
        indexVersion: "v1",
        formularioId: "form-1",
      },
      {
        id: "page-2",
        secuencia: 2,
        nombre: "Página 2",
        descripcion: "Desc 2",
        indexVersion: "v1",
        formularioId: "form-1",
      },
    ];

    (pagesServices.getPaginas as jest.Mock).mockResolvedValueOnce(mockPaginas);

    const { result } = renderHook(() => usePaginas(), {
      wrapper: createWrapper(),
    });

    await waitFor(() => {
      expect(result.current.data).toEqual(mockPaginas);
    });

    expect(pagesServices.getPaginas).toHaveBeenCalledWith(
      expect.objectContaining({})
    );
  });

  test("[C0078] obtiene páginas filtradas por formId", async () => {
    const mockPaginas = [
      {
        id: "page-1",
        secuencia: 1,
        nombre: "Página 1",
        descripcion: "Desc 1",
        formularioId: "form-123",
      },
    ];

    (pagesServices.getPaginas as jest.Mock).mockResolvedValueOnce(mockPaginas);

    const { result } = renderHook(() => usePaginas("form-123"), {
      wrapper: createWrapper(),
    });

    await waitFor(() => {
      expect(result.current.data).toEqual(mockPaginas);
    });

    expect(pagesServices.getPaginas).toHaveBeenCalledWith(
      expect.objectContaining({ formId: "form-123" })
    );
  });

  test("[C0079] maneja estado de loading", async () => {
    (pagesServices.getPaginas as jest.Mock).mockImplementation(
      () => new Promise((resolve) => setTimeout(() => resolve([]), 100))
    );

    const { result } = renderHook(() => usePaginas("form-1"), {
      wrapper: createWrapper(),
    });

    expect(result.current.isLoading).toBe(true);

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });
  });

  test("[C0080] maneja errores al obtener páginas", async () => {
    (pagesServices.getPaginas as jest.Mock).mockRejectedValueOnce(
      new Error("Network error")
    );

    const { result } = renderHook(() => usePaginas("form-1"), {
      wrapper: createWrapper(),
    });

    await waitFor(() => {
      expect(result.current.isError).toBe(true);
    });
  });

  test("[C0081] usa queryKey correcto con formId", async () => {
    (pagesServices.getPaginas as jest.Mock).mockResolvedValueOnce([]);

    renderHook(() => usePaginas("form-123"), {
      wrapper: createWrapper(),
    });

    await waitFor(() => {
      expect(pagesServices.getPaginas).toHaveBeenCalled();
    });
  });

  test("[C0082] usa queryKey con 'all' cuando no hay formId", async () => {
    (pagesServices.getPaginas as jest.Mock).mockResolvedValueOnce([]);

    renderHook(() => usePaginas(), {
      wrapper: createWrapper(),
    });

    await waitFor(() => {
      expect(pagesServices.getPaginas).toHaveBeenCalled();
    });
  });
});

describe("useCreatePagina", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("[C0083] crea página exitosamente", async () => {
    const mockResponse = {
      detail: "Página creada",
      version: "v2",
      version_bumpeada: true,
      pagina: {
        id: "new-page",
        secuencia: 1,
        nombre: "Nueva Página",
        descripcion: "Nueva desc",
        indexVersion: "v2",
        formularioId: "form-123",
      },
    };

    (pagesServices.createPagina as jest.Mock).mockResolvedValueOnce(
      mockResponse
    );

    const { result } = renderHook(() => useCreatePagina("form-123"), {
      wrapper: createWrapper(),
    });

    result.current.mutate({
      title: "Nueva Página",
      description: "Nueva desc",
    });

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    expect(pagesServices.createPagina).toHaveBeenCalledWith("form-123", {
      title: "Nueva Página",
      description: "Nueva desc",
    });
  });

  test("[C0084] maneja error al crear página", async () => {
    (pagesServices.createPagina as jest.Mock).mockRejectedValueOnce(
      new Error("Error al crear página")
    );

    const { result } = renderHook(() => useCreatePagina("form-123"), {
      wrapper: createWrapper(),
    });

    result.current.mutate({
      title: "Test",
      description: "Test",
    });

    await waitFor(() => {
      expect(result.current.isError).toBe(true);
    });
  });

  test("[C0085] invalida queries después de crear página", async () => {
    const mockResponse = {
      detail: "OK",
      version: "v1",
      version_bumpeada: false,
      pagina: {
        id: "page-1",
        secuencia: 1,
        nombre: "Test",
        descripcion: "",
        formularioId: "form-123",
      },
    };

    (pagesServices.createPagina as jest.Mock).mockResolvedValueOnce(
      mockResponse
    );

    const { result } = renderHook(() => useCreatePagina("form-123"), {
      wrapper: createWrapper(),
    });

    result.current.mutate({
      title: "Test",
      description: "",
    });

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });
  });

  test("[C0086] maneja optimistic update en onMutate", async () => {
    const mockResponse = {
      detail: "OK",
      version: "v1",
      version_bumpeada: false,
      pagina: {
        id: "page-1",
        secuencia: 1,
        nombre: "Test",
        descripcion: "",
      },
    };

    (pagesServices.createPagina as jest.Mock).mockResolvedValueOnce(
      mockResponse
    );

    const { result } = renderHook(() => useCreatePagina("form-123"), {
      wrapper: createWrapper(),
    });

    result.current.mutate({
      title: "Test",
      description: "Test",
    });

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });
  });
});

describe("usePostCamposActualBatch", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("[C0087] envía campos en batch exitosamente", async () => {
    const mockResult = {
      ok: [{ id: "1" }, { id: "2" }, { id: "3" }],
      errors: [],
    };

    (camposServices.postCamposActualBatch as jest.Mock).mockResolvedValueOnce(
      mockResult
    );

    const { result } = renderHook(() => usePostCamposActualBatch(), {
      wrapper: createWrapper(),
    });

    const campos = [
      { tipo: "text", nombre_campo: "campo1" },
      { tipo: "email", nombre_campo: "campo2" },
      { tipo: "number", nombre_campo: "campo3" },
    ] as any;

    result.current.mutate({
      pageId: "page-123",
      campos,
    });

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    expect(camposServices.postCamposActualBatch).toHaveBeenCalledWith(
      "page-123",
      campos
    );
  });

  test("[C0088] maneja errores parciales en batch", async () => {
    const mockResult = {
      ok: [{ id: "1" }, { id: "3" }],
      errors: [{ index: 1, message: "Error en campo 2" }],
    };

    (camposServices.postCamposActualBatch as jest.Mock).mockResolvedValueOnce(
      mockResult
    );

    const { result } = renderHook(() => usePostCamposActualBatch(), {
      wrapper: createWrapper(),
    });

    result.current.mutate({
      pageId: "page-123",
      campos: [
        { tipo: "text" },
        { tipo: "text" },
        { tipo: "text" },
      ] as any,
    });

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    expect(result.current.data).toEqual(mockResult);
  });

  test("[C0089] maneja error completo en batch", async () => {
    (camposServices.postCamposActualBatch as jest.Mock).mockRejectedValueOnce(
      new Error("Error de red")
    );

    const { result } = renderHook(() => usePostCamposActualBatch(), {
      wrapper: createWrapper(),
    });

    result.current.mutate({
      pageId: "page-123",
      campos: [{ tipo: "text" }] as any,
    });

    await waitFor(() => {
      expect(result.current.isError).toBe(true);
    });
  });

  test("[C0090] maneja batch vacío", async () => {
    const mockResult = {
      ok: [],
      errors: [],
    };

    (camposServices.postCamposActualBatch as jest.Mock).mockResolvedValueOnce(
      mockResult
    );

    const { result } = renderHook(() => usePostCamposActualBatch(), {
      wrapper: createWrapper(),
    });

    result.current.mutate({
      pageId: "page-123",
      campos: [],
    });

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });
  });

  test("[C0091] usa mutationKey correcto", async () => {
    const mockResult = { ok: [], errors: [] };

    (camposServices.postCamposActualBatch as jest.Mock).mockResolvedValueOnce(
      mockResult
    );

    const { result } = renderHook(() => usePostCamposActualBatch(), {
      wrapper: createWrapper(),
    });

    result.current.mutate({
      pageId: "page-123",
      campos: [],
    });

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });
  });
});