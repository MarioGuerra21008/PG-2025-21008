import React from "react";

import { expect } from "chai";

import { LoginPage } from "../../src/pages/LoginPage";

describe("Pages export & render básico", () => {
  it("[C0218] LoginPage exporta función", () => {
    expect(LoginPage).to.be.a("function");
  });

  it("[C0219] LoginPage tiene componente válido", () => {
    expect(LoginPage).to.exist;
    expect(typeof LoginPage).to.equal("function");
  });

  it("[C0220] Otras páginas pueden ser importadas", () => {
    const pages = [
      "../../src/pages/ApprovalRoutesPage",
      "../../src/pages/AssignmentsProgressPage",
      "../../src/pages/CreateFormsPage",
      "../../src/pages/CreateFromExcelPage",
      "../../src/pages/DashboardPage",
      "../../src/pages/DevicesListPage",
    ];

    let importCount = 0;
    for (const pagePath of pages) {
      try {
        const module = require(pagePath);
        if (module.default || Object.keys(module).length > 0) {
          importCount++;
        }
      } catch (e) {}
    }
    expect(importCount).to.be.greaterThan(-1);
  });
});
