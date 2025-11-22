const mock = require("mock-require");
const path = require("path");

const mockApi = {
  defaults: {
    baseURL: 'http://localhost:5173',
    headers: {
      common: {},
    },
  },
  interceptors: {
    request: {
      handlers: [
        {
          fulfilled: (config) => {
            if (config.method && ['post', 'put', 'patch', 'delete'].includes(config.method.toLowerCase())) {
              config.headers = config.headers || {};
              config.headers['X-CSRFToken'] = 'mock-csrf-token';
            }
            return config;
          },
          rejected: null,
        },
      ],
      use: function(fulfilled, rejected) {
        this.handlers.push({ fulfilled, rejected });
        return this.handlers.length - 1;
      },
      eject: function(id) {
        if (this.handlers[id]) {
          this.handlers[id] = null;
        }
      },
    },
    response: {
      handlers: [],
      use: function(fulfilled, rejected) {
        this.handlers.push({ fulfilled, rejected });
        return this.handlers.length - 1;
      },
      eject: function(id) {
        if (this.handlers[id]) {
          this.handlers[id] = null;
        }
      },
    },
  },
  get: async (url, config) => ({
    data: [],
    status: 200,
    statusText: 'OK',
    headers: {},
    config: { url, ...config },
  }),
  post: async (url, data, config) => ({
    data: data || {},
    status: 201,
    statusText: 'Created',
    headers: {},
    config: { url, data, ...config },
  }),
  put: async (url, data, config) => ({
    data: data || {},
    status: 200,
    statusText: 'OK',
    headers: {},
    config: { url, data, ...config },
  }),
  patch: async (url, data, config) => ({
    data: data || {},
    status: 200,
    statusText: 'OK',
    headers: {},
    config: { url, data, ...config },
  }),
  delete: async (url, config) => ({
    data: null,
    status: 204,
    statusText: 'No Content',
    headers: {},
    config: { url, ...config },
  }),
};

mock('react-pdf', {
  Document: ({ children, onLoadSuccess }) => {
    if (onLoadSuccess) {
      setTimeout(() => onLoadSuccess({ numPages: 1 }), 0);
    }
    return children || null;
  },
  Page: () => null,
  pdfjs: {
    GlobalWorkerOptions: {
      workerSrc: '',
    },
  },
});

mock('pdfjs-dist', {
  getDocument: () => ({
    promise: Promise.resolve({
      numPages: 1,
      getPage: () => Promise.resolve({}),
    }),
  }),
  GlobalWorkerOptions: {
    workerSrc: '',
  },
});

mock('pdfjs-dist/build/pdf.worker.entry', { default: '' });

mock('pdfjs-dist/build/pdf.worker.mjs?url', { default: '' });

const realAuthService = path.resolve(
  process.cwd(),
  "src/features/user-autentication/services/auth.service"
);

mock(realAuthService, {
  api: mockApi,
  loginUser: async () => ({ access_token: "t", refresh_token: "r", user: { nombre: "Test" } }),
  logoutUser: async () => ({}),
  refreshToken: async () => ({ access_token: "t2" }),
});

const realFormsServices = path.resolve(
  process.cwd(),
  "src/features/forms-list/services/forms-services"
);

mock(realFormsServices, {
  api: mockApi,
  getFormularios: async () => [],
  getFormularioById: async (id) => ({ id, nombre: 'Mock Form' }),
  createFormulario: async (data) => ({ ...data, id: 1 }),
  deleteFormulario: async () => {},
  duplicateFormulario: async (id) => ({ id: id + 1, nombre: 'Copia' }),
  crearAsignacion: async (payload) => ({ ok: true, ...payload }),
  crearAsignacionMultipleUsuarios: async (usuarios, formularios) => ({ 
    ok: usuarios.map(u => ({ usuario: u, data: {} })), 
    errors: [] 
  }),
});