import { api } from "@/features/user-autentication/services/auth.service";
import {
  getFormularios,
  createFormulario,
  getFormularioById,
  deleteFormulario,
  duplicateFormulario,
  crearAsignacion,
  crearAsignacionMultipleUsuarios,
  type Formulario,
  type CreateFormularioDto,
} from "../forms-services";

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

describe("forms-services", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("getFormularios", () => {
    test("[C0153] obtiene lista de formularios exitosamente", async () => {
      const mockFormularios: Formulario[] = [
        {
          id: 1,
          nombre: "Formulario 1",
          descripcion: "Descripción 1",
          paginas: [],
        },
        {
          id: 2,
          nombre: "Formulario 2",
          descripcion: "Descripción 2",
          paginas: [],
        },
      ];

      (api.get as jest.Mock).mockResolvedValueOnce({ data: mockFormularios });

      const result = await getFormularios();

      expect(api.get).toHaveBeenCalledWith("/api/formularios-lite/");
      expect(result).toEqual(mockFormularios);
      expect(result).toHaveLength(2);
    });

    test("[C0154] maneja error al obtener formularios", async () => {
      (api.get as jest.Mock).mockRejectedValueOnce(new Error("Network error"));

      await expect(getFormularios()).rejects.toThrow("Network error");
    });
  });

  describe("createFormulario", () => {
    test("[C0155] crea formulario exitosamente", async () => {
      const newForm: CreateFormularioDto = {
        nombre: "Nuevo Formulario",
        descripcion: "Descripción del nuevo formulario",
      };

      const mockResponse: Formulario = {
        id: 3,
        nombre: newForm.nombre,
        descripcion: newForm.descripcion,
        paginas: [],
      };

      (api.post as jest.Mock).mockResolvedValueOnce({ data: mockResponse });

      const result = await createFormulario(newForm);

      expect(api.post).toHaveBeenCalledWith(
        "/api/formularios/",
        newForm,
        expect.objectContaining({})
      );
      expect(result).toEqual(mockResponse);
      expect(result.nombre).toBe("Nuevo Formulario");
    });

    test("[C0156] respeta la señal de abort", async () => {
      const controller = new AbortController();
      const newForm: CreateFormularioDto = {
        nombre: "Test",
        descripcion: "Test desc",
      };

      (api.post as jest.Mock).mockResolvedValueOnce({
        data: { id: 1, nombre: "Test", paginas: [] },
      });

      await createFormulario(newForm, { signal: controller.signal });

      expect(api.post).toHaveBeenCalledWith(
        "/api/formularios/",
        newForm,
        expect.objectContaining({ signal: controller.signal })
      );
    });
  });

  describe("getFormularioById", () => {
    test("[C0157] obtiene formulario por ID exitosamente", async () => {
      const mockFormulario: Formulario = {
        id: 1,
        nombre: "Formulario Test",
        descripcion: "Descripción test",
        paginas: ["page1", "page2"],
      };

      (api.get as jest.Mock).mockResolvedValueOnce({ data: mockFormulario });

      const result = await getFormularioById("1");

      expect(api.get).toHaveBeenCalledWith(
        "/api/formularios/1/",
        expect.objectContaining({})
      );
      expect(result).toEqual(mockFormulario);
    });
  });

  describe("deleteFormulario", () => {
    test("[C0158] elimina formulario exitosamente", async () => {
      (api.delete as jest.Mock).mockResolvedValueOnce({ data: {} });

      await deleteFormulario("1");

      expect(api.delete).toHaveBeenCalledWith(
        "/api/formularios/1/",
        expect.objectContaining({})
      );
    });
  });

  describe("duplicateFormulario", () => {
    test("[C0159] duplica formulario exitosamente", async () => {
      const mockDuplicated: Formulario = {
        id: 4,
        nombre: "Formulario Test (Copia)",
        descripcion: "Descripción test",
        paginas: [],
      };

      (api.post as jest.Mock).mockResolvedValueOnce({ data: mockDuplicated });

      const result = await duplicateFormulario("1");

      expect(api.post).toHaveBeenCalledWith(
        "/api/formularios/1/duplicar/",
        {},
        expect.objectContaining({})
      );
      expect(result).toEqual(mockDuplicated);
      expect(result.id).toBe(4);
    });
  });

  describe("crearAsignacion", () => {
    test("[C0160] crea asignación exitosamente", async () => {
      const payload = {
        usuario: "user123",
        formularios: ["form1", "form2"],
      };

      const mockResponse = { detail: "Asignación creada", id: "assign123" };

      (api.post as jest.Mock).mockResolvedValueOnce({ data: mockResponse });

      const result = await crearAsignacion(payload);

      expect(api.post).toHaveBeenCalledWith(
        "/api/asignaciones/crear-asignacion/",
        payload,
        expect.objectContaining({})
      );
      expect(result).toEqual(mockResponse);
    });

    test("[C0161] maneja error al crear asignación", async () => {
      const payload = {
        usuario: "user123",
        formularios: ["form1"],
      };

      (api.post as jest.Mock).mockRejectedValueOnce(
        new Error("Usuario no encontrado")
      );

      await expect(crearAsignacion(payload)).rejects.toThrow(
        "Usuario no encontrado"
      );
    });
  });

  describe("crearAsignacionMultipleUsuarios", () => {
    test("[C0162] crea asignaciones para múltiples usuarios exitosamente", async () => {
      const usuarios = ["user1", "user2", "user3"];
      const formularios = ["form1", "form2"];

      (api.post as jest.Mock)
        .mockResolvedValueOnce({ data: { detail: "OK" } })
        .mockResolvedValueOnce({ data: { detail: "OK" } })
        .mockResolvedValueOnce({ data: { detail: "OK" } });

      const result = await crearAsignacionMultipleUsuarios(
        usuarios,
        formularios
      );

      expect(api.post).toHaveBeenCalledTimes(3);
      expect(result.ok).toHaveLength(3);
      expect(result.errors).toHaveLength(0);
    });

    test("[C0163] maneja errores parciales en asignaciones múltiples", async () => {
      const usuarios = ["user1", "user2", "user3"];
      const formularios = ["form1"];

      (api.post as jest.Mock)
        .mockResolvedValueOnce({ data: { detail: "OK" } })
        .mockRejectedValueOnce(new Error("Usuario no encontrado"))
        .mockResolvedValueOnce({ data: { detail: "OK" } });

      const result = await crearAsignacionMultipleUsuarios(
        usuarios,
        formularios
      );

      expect(result.ok).toHaveLength(2);
      expect(result.errors).toHaveLength(1);
      expect(result.errors[0].usuario).toBe("user2");
      expect(result.errors[0].message).toContain("Usuario no encontrado");
    });

    test("[C0164] retorna todos los errores cuando todas las asignaciones fallan", async () => {
      const usuarios = ["user1", "user2"];
      const formularios = ["form1"];

      (api.post as jest.Mock)
        .mockRejectedValueOnce(new Error("Error 1"))
        .mockRejectedValueOnce(new Error("Error 2"));

      const result = await crearAsignacionMultipleUsuarios(
        usuarios,
        formularios
      );

      expect(result.ok).toHaveLength(0);
      expect(result.errors).toHaveLength(2);
    });
  });
});