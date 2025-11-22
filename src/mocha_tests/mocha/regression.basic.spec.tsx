import { expect } from "chai";

describe("Regresión básica", () => {
  it("[C0221] Math y utilidades", () => {
    expect(Number.isFinite(42)).to.equal(true);
  });
  it("[C0222] Strings", () => {
    expect("Santa Ana".includes("Ana")).to.equal(true);
  });
});
