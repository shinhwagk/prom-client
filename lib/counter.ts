import { hashObject } from "./util.ts";
import { validateLabel } from "./validation.ts";
import { Metric } from "./metric.ts";
import { LabelPairs } from "./interface.ts";

const type = "counter";

export class Counter extends Metric {
  /**
	 * Increment counter
	 * @param {object} labelPairs - What label you want to be incremented
	 * @param {Number} value - Value to increment, if omitted increment with 1
	 * @returns {void}
	 */
  inc(incValue: number = 1, labelPairs: LabelPairs = {}): void {
    const hash = hashObject(labelPairs);

    if (incValue < 0) {
      throw new Error("It is not possible to decrease a counter");
    } else {
      validateLabel(this.labelNames, labelPairs);
      this.hashMap = setValue(this.hashMap, incValue, labelPairs, hash);
    }
  }

  /**
	 * Reset counter
	 * @returns {void}
	 */
  reset(): void {
    this.hashMap = {};
    if (this.labelNames.length === 0) {
      this.hashMap = setValue({}, 0);
    }
  }

  get() {
    return {
      help: this.help,
      name: this.name,
      type,
      values: Object.values(this.hashMap),
    };
  }

  // labels(...labelValues: string[]) {
  //   const labels = getLabels(this.labelNames, labelValues);
  //   const hash = hashObject(labels);
  //   validateLabel(this.labelNames, labels);
  //   return {
  //     inc: inc.call(this, labels, hash),
  //   };
  // }

  remove() {
    // const labels = getLabels(this.labelNames, arguments) || {};
    // return removeLabels.call(this, this.hashMap, labels);
  }
}

function setValue(
  hashMap: { [hash: string]: { value: number; labelPairs: LabelPairs } },
  value: number,
  labelPairs: LabelPairs = {},
  hash?: string | undefined,
) {
  hash = hash || "";
  if (hashMap[hash]) {
    hashMap[hash].value += value;
  } else {
    hashMap[hash] = { value, labelPairs };
  }
  return hashMap;
}
