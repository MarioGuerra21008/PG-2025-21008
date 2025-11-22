import React from 'react';
import { render as rtlRender } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from '../src/pages/AuthContext';

export function createTestQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
        cacheTime: 0,
      },
      mutations: {
        retry: false,
      },
    },
    logger: {
      log: console.log,
      warn: console.warn,
      error: () => {},
    },
  });
}

interface WrapperProps {
  children: React.ReactNode;
}

export function TestWrapper({ children }: WrapperProps) {
  const testQueryClient = createTestQueryClient();

  return (
    <QueryClientProvider client={testQueryClient}>
      <BrowserRouter>
        <AuthProvider> {/* ⬅️ Agregar AuthProvider */}
          {children}
        </AuthProvider>
      </BrowserRouter>
    </QueryClientProvider>
  );
}

// Para componentes individuales (con Router)
export function renderWithProviders(ui: React.ReactElement) {
  return rtlRender(ui, { wrapper: TestWrapper });
}

// Para App (que ya tiene Router) ⬅️ Nueva función
export function renderApp(ui: React.ReactElement) {
  const testQueryClient = createTestQueryClient();
  
  const AppWrapper = ({ children }: WrapperProps) => (
    <QueryClientProvider client={testQueryClient}>
      {children}
    </QueryClientProvider>
  );
  
  return rtlRender(ui, { wrapper: AppWrapper });
}