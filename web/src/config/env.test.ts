import { describe, it, expect } from "vitest";
import { appConfig, entryFunction } from "./env";

describe("env config", () => {
  it("builds a fully-qualified Move entry function id", () => {
    expect(entryFunction("mint_ticket")).toBe(
      `${appConfig.moduleAddress}::${appConfig.moduleName}::mint_ticket`,
    );
  });

  it("exposes a resolved network", () => {
    expect(appConfig.network).toBeDefined();
  });
});
