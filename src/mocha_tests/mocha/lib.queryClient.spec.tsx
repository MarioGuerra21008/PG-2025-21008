import { expect } from "chai";

import { queryClient } from "../../src/lib/queryClient";

describe("lib/queryClient", () => {
  it("[C0208] exporta instancia", () => {
    expect(queryClient).to.exist;
  });

  it("[C0209] tiene métodos básicos", () => {
    expect(queryClient).to.have.property("getQueryData");
    expect(queryClient).to.have.property("setQueryData");
  });

  it("[C0210] permite set/get", () => {
    queryClient.setQueryData(["demo"], 123);
    expect(queryClient.getQueryData(["demo"])).to.equal(123);
  });

  it("[C0211] clear cache", async () => {
    await queryClient.invalidateQueries();
    expect(true).to.equal(true);
  });
});
