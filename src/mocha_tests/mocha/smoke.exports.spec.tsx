import { expect } from "chai";

import { api } from "../../src/features/user-autentication/services/auth.service";
import * as Types from "../../src/features/forms-list/services/types.ts";

describe("Smoke de exports", () => {
  it("[C0240] services exporta api", () => {
    expect(api).to.exist;
  });

  it("[C0241] types módulo existe", () => {
    expect(Types).to.exist;
    expect(Types).to.be.an("object");
  });

  it("[C0242] services tiene métodos axios", () => {
    expect(api.get).to.be.a("function");
    expect(api.post).to.be.a("function");
    expect(api.put).to.be.a("function");
    expect(api.delete).to.be.a("function");
  });

  it("[C0243] api tiene configuración base", () => {
    expect(api.defaults).to.exist;
    expect(api.defaults.baseURL).to.be.a("string");
  });
});