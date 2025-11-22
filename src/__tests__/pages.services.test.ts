import { api } from "@/features/user-autentication/services/auth.service";
import {
  createPagina,
  getPaginas,
  type CreatePaginaDto,
  type PaginaAPI,
  type AgregarPaginaResponse,
} from "../pages.services";

describe("pages.services", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("getPaginas", () => {
    test("[C0105] obtiene todas las páginas sin filtro", async () => {
      const mockPaginas = [
        {
          id_pagina: "page-1",
          secuencia: 1,
          nombre: "Página 1",
          descripcion: "Desc 1",
          index_version: "v1",
          formulario: "form-1",
        },
        {
          id_pagina: "page-2",
          secuencia: 2,
          nombre: "Página 2",
          descripcion: "Desc 2",
          index_version: "v1",
          formulario: "form-1",
        },
      ];

      (api.get as jest.Mock).mockResolvedValueOnce({ data: mockPaginas });

      const result = await getPaginas();

      expect(api.get).toHaveBeenCalledWith(
        "/api/paginas/",
        expect.objectContaining({ params: expect.any(URLSearchParams) })
      );
      expect(result).toHaveLength(2);
      expect(result[0].id).toBe("page-1");
      expect(result[0].nombre).toBe("Página 1");
    });

    test("[C0106] obtiene páginas filtradas por formulario", async () => {
      const mockPaginas = [
        {
          id_pagina: "page-1",
          secuencia: 1,
          nombre: "Página 1",
          descripcion: "Desc 1",
          index_version: "v1",
          formulario: "form-123",
        },
      ];

      (api.get as jest.Mock).mockResolvedValueOnce({ data: mockPaginas });

      const result = await getPaginas({ formId: "form-123" });

      expect(result).toHaveLength(1);
      expect(result[0].formularioId).toBe("form-123");
    });

    test("[C0107] respeta la señal de abort", async () => {
      const controller = new AbortController();
      (api.get as jest.Mock).mockResolvedValueOnce({ data: [] });

      await getPaginas({ signal: controller.signal });

      expect(api.get).toHaveBeenCalledWith(
        "/api/paginas/",
        expect.objectContaining({ signal: controller.signal })
      );
    });

    test("[C0108] normaliza correctamente la respuesta del backend", async () => {
      const backendResponse = [
        {
          id_pagina: "page-1",
          secuencia: 1,
          nombre: "Test Page",
          descripcion: "Test Description",
          index_version: "v1.0",
          formulario: "form-abc",
        },
      ];

      (api.get as jest.Mock).mockResolvedValueOnce({ data: backendResponse });

      const result = await getPaginas();

      expect(result[0]).toEqual({
        id: "page-1",
        secuencia: 1,
        nombre: "Test Page",
        descripcion: "Test Description",
        indexVersion: "v1.0",
        formularioId: "form-abc",
      });
    });

    test("[C0109] filtra páginas según formId cuando el backend no lo hace", async () => {
      const mockPaginas = [
        {
          id_pagina: "page-1",
          secuencia: 1,
          nombre: "Página 1",
          descripcion: "",
          index_version: "v1",
          formulario: "form-123",
        },
        {
          id_pagina: "page-2",
          secuencia: 2,
          nombre: "Página 2",
          descripcion: "",
          index_version: "v1",
          formulario: "form-456",
        },
      ];

      (api.get as jest.Mock).mockResolvedValueOnce({ data: mockPaginas });

      const result = await getPaginas({ formId: "form-123" });

      expect(result).toHaveLength(1);
      expect(result[0].formularioId).toBe("form-123");
    });
  });

  describe("createPagina", () => {
    test("[C0110] crea página con bump=true por defecto", async () => {
      const dto: CreatePaginaDto = {
        title: "Nueva Página",
        description: "Descripción de la nueva página",
      };

      const mockResponse: AgregarPaginaResponse = {
        detail: "Página creada",
        version: "v2",
        version_bumpeada: true,
        pagina: {
          id: "new-page-id",
          secuencia: 1,
          nombre: "Nueva Página",
          descripcion: "Descripción de la nueva página",
          indexVersion: "v2",
          formularioId: "form-123",
        },
      };

      (api.post as jest.Mock).mockResolvedValueOnce({ data: mockResponse });

      const result = await createPagina("form-123", dto);

      expect(api.post).toHaveBeenCalledWith(
        "/api/formularios/form-123/agregar-pagina/?bump=1",
        {
          nombre: "Nueva Página",
          descripcion: "Descripción de la nueva página",
        },
        expect.objectContaining({})
      );
      expect(result).toEqual(mockResponse);
      expect(result.pagina.nombre).toBe("Nueva Página");
    });

    test("[C0111] crea página con bump=false cuando se especifica", async () => {
      const dto: CreatePaginaDto = {
        bump: false,
        title: "Página sin bump",
        description: "Sin incrementar versión",
      };

      const mockResponse: AgregarPaginaResponse = {
        detail: "Página creada sin bump",
        version: "v1",
        version_bumpeada: false,
        pagina: {
          id: "page-id",
          secuencia: 2,
          nombre: "Página sin bump",
          descripcion: "Sin incrementar versión",
          indexVersion: "v1",
          formularioId: "form-123",
        },
      };

      (api.post as jest.Mock).mockResolvedValueOnce({ data: mockResponse });

      const result = await createPagina("form-123", dto);

      expect(api.post).toHaveBeenCalledWith(
        "/api/formularios/form-123/agregar-pagina/?bump=0",
        expect.any(Object),
        expect.any(Object)
      );
      expect(result.version_bumpeada).toBe(false);
    });

    test("[C0112] maneja respuesta plana del backend y la normaliza", async () => {
      const dto: CreatePaginaDto = {
        title: "Test",
        description: "Test desc",
      };

      const backendResponse = {
        ok: true,
        id_pagina: "page-123",
        secuencia: 1,
        nombre: "Test",
        descripcion: "Test desc",
        index_version: "v1",
        formulario: "form-123",
        detail: "OK",
        version: "v1",
        version_bumpeada: true,
      };

      (api.post as jest.Mock).mockResolvedValueOnce({
        data: backendResponse,
      });

      const result = await createPagina("form-123", dto);

      expect(result.pagina).toBeDefined();
      expect(result.pagina.id).toBe("page-123");
      expect(result.pagina.nombre).toBe("Test");
    });

    test("[C0113] lanza error cuando la respuesta es inesperada", async () => {
      const dto: CreatePaginaDto = {
        title: "Test",
        description: "Test",
      };

      (api.post as jest.Mock).mockResolvedValueOnce({
        data: { unexpected: "format" },
      });

      await expect(createPagina("form-123", dto)).rejects.toThrow(
        "Respuesta inesperada de crear página"
      );
    });

    test("[C0114] respeta la señal de abort", async () => {
      const controller = new AbortController();
      const dto: CreatePaginaDto = {
        title: "Test",
        description: "Test",
      };

      (api.post as jest.Mock).mockResolvedValueOnce({
        data: {
          pagina: { id: "1", secuencia: 1, nombre: "Test", descripcion: "" },
          detail: "",
          version: "",
          version_bumpeada: false,
        },
      });

      await createPagina("form-123", dto, { signal: controller.signal });

      expect(api.post).toHaveBeenCalledWith(
        expect.any(String),
        expect.any(Object),
        expect.objectContaining({ signal: controller.signal })
      );
    });
  });
});