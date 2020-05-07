import { globalRegistry } from "./registry.ts";
import { validateMetricName, validateLabelNames } from "./validation.ts";
import { LabelPairs } from "./interface.ts";

export abstract class Metric {
  readonly aggregator: "sum" = "sum";
  hashMap: { [hash: string]: { value: number; labelPairs: LabelPairs } } = {};
  constructor(
    readonly name: string,
    readonly help: string = "",
    readonly labelNames: string[] = [],
    readonly registers = [globalRegistry],
  ) {
    if (!validateMetricName(this.name)) {
      throw new Error("Invalid metric name");
    }
    if (!validateLabelNames(this.labelNames)) {
      throw new Error("Invalid label name");
    }

    this.reset();

    for (const register of this.registers) {
      register.registerMetric(this);
    }
  }

  reset() {/* abstract */}
  abstract get(): any;
}
