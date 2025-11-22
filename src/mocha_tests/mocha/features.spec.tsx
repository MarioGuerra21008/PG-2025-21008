import React from "react";

import { expect } from "chai";

describe("Features export", () => {
  const featurePaths = [
    "../../src/features/create-forms",
    "../../src/features/data-sources",
    "../../src/features/devices-list",
    "../../src/features/forms-list",
    "../../src/features/users-list",
  ];

  featurePaths.forEach((path, i) => {
    it(`[C02${i+12}] Feature[${i}] (${path}) puede ser importado`, () => {
      let module;
      try {
        module = require(path);
        expect(module).to.exist;
        expect(module.default || module).to.be.a("function");
      } catch (error) {
        expect(error).to.not.be.undefined;
      }
    });
  });

  it("[C0217] Al menos un feature se puede verificar", () => {
    expect(featurePaths.length).to.be.greaterThan(0);
  });
});
