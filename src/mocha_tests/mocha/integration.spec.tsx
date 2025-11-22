import React from "react";

import { render } from "@testing-library/react";
import { expect } from "chai";

import { renderWithProviders } from '../test-helpers';
import { LoginCard } from "../../src/components/LoginCard";

describe("Integración básica", () => {
  it("[C0206] componentes React se renderizan sin errores", () => {
    // Verificar que el sistema de rendering funciona
    const { container } = renderWithProviders(<LoginCard onFinish={() => { } } isPending={false} />);
    expect(container).to.exist;
    expect(container.querySelector("form")).to.exist;
  });

  it("[C0207] variables de entorno están configuradas correctamente", () => {
    // Verificar que las variables de entorno necesarias están disponibles
    expect(process.env.NODE_ENV).to.equal("test");
    expect(process.env.VITE_API_BASE_URL).to.equal("http://localhost:5173");
  });
});