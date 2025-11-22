// Mock de axios instance para forms-services
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
            // Simular el interceptor CSRF
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

// Exportar funciones stub y la instancia api
module.exports = {
  api: mockApi,
  getFormularios: async () => [],
  getFormularioById: async (id) => ({ id, nombre: 'Mock Form' }),
  createFormulario: async (data) => ({ ...data, id: 1 }),
  updateFormulario: async (id, data) => ({ id, ...data }),
  deleteFormulario: async (id) => ({ success: true }),
  duplicarFormulario: async (id) => ({ id: id + 1, nombre: 'Copia' }),
};