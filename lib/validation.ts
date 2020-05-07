import { LabelPairs } from "./interface.ts";

const metricRegexp = /^[a-zA-Z_:][a-zA-Z0-9_:]*$/;
const labelRegexp = /^[a-zA-Z_][a-zA-Z0-9_]*$/;

export function validateMetricName(name: string) {
  return metricRegexp.test(name);
}

export function validateLabelNames(names: string[]): boolean {
  for (const name of names) {
    if (!labelRegexp.test(name)) {
      return false;
    }
  }
  return true;
}

export function validateLabel(
  labelNames: string[],
  labelPairs: LabelPairs,
) {
  Object.keys(labelPairs).forEach((labelName) => {
    if (labelNames.indexOf(labelName) === -1) {
      throw new Error(
        `Added label "${labelName}" is not included in initial labelset: ${labelNames}`,
      );
    }
  });
}
