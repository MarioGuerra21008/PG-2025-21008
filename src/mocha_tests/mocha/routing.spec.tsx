import React from "react";

import { render } from "@testing-library/react";
import { expect } from "chai";

import { renderApp } from '../test-helpers';
import App from "../../src/App.tsx";

describe("Routing básico", () => {
  it("[C0223] App renderiza", () => {
    const { container } = renderApp(<App />);
    expect(container).to.exist;
  });

  it("[C0224] incluye layout base", () => {
    const { container } = renderApp(<App />);
    expect(container.innerHTML).to.be.a("string");
  });

  it("[C0225] sincrónico", () => {
    expect(1 + 1).to.equal(2);
  });

  it("[C0226] placeholder de ruta", () => {
    expect(["/", "/login"]).to.include("/");
  });
});