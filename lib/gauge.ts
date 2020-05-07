import { setValue, hashObject } from "./util.ts";
import { validateLabel as validateLabelPairs } from "./validation.ts";

import { Metric } from "./metric.ts";
import { LabelPairs } from "./interface.ts";

const type = "gauge";

export class Gauge extends Metric {
  /**
	 * Set a gauge to a value
	 * @param {object} labelPairs - Object with labels and their values
	 * @param {Number} value - Value to set the gauge to, must be positive
	 * @returns {void}
	 */
  set(labelPairs: LabelPairs = {}, value: number = 0) {
    validateLabelPairs(this.labelNames, labelPairs);
    this.hashMap = setValue(this.hashMap, value, labelPairs);
  }

  /**
	 * Reset gauge
	 * @returns {void}
	 */
  reset() {
    this.hashMap = {};

    if (this.labelNames.length === 0) {
      this.hashMap = setValue({}, 0, {});
    }
  }

  /**
	 * Increment a gauge value
	 * @param {object} labelPairs - Object with labels where key is the label key and value is label value. Can only be one level deep
	 * @param {Number} value - Value to increment - if omitted, increment with 1
	 * @returns {void}
	 */
  inc(labelPairs: any, value: number = 1) {
    const data = convertLabelsAndValues(labelPairs, value);
    this.set(
      data.labelPairs,
      this._getValue(data.labelPairs) + (data.value || 1),
    );
  }

  /**
	 * Decrement a gauge value
	 * @param {object} labels - Object with labels where key is the label key and value is label value. Can only be one level deep
	 * @param {Number} value - Value to decrement - if omitted, decrement with 1
	 * @returns {void}
	 */
  // dec(labels, value) {
  //   dec.call(this, labels)(value);
  // }

  /**
	 * Set the gauge to current unix epoch
	 * @param {object} labels - Object with labels where key is the label key and value is label value. Can only be one level deep
	 * @returns {void}
	 */
  // setToCurrentTime(labels) {
  //   return setToCurrentTime.call(this, labels)();
  // }

  /**
	 * Start a timer
	 * @param {object} labels - Object with labels where key is the label key and value is label value. Can only be one level deep
	 * @returns {function} - Invoke this function to set the duration in seconds since you started the timer.
	 * @example
	 * var done = gauge.startTimer();
	 * makeXHRRequest(function(err, response) {
	 *	done(); //Duration of the request will be saved
	 * });
	 */
  // startTimer(labels) {
  //   return startTimer.call(this, labels)();
  // }

  get() {
    return {
      help: this.help,
      name: this.name,
      type,
      values: Object.values(this.hashMap),
      aggregator: this.aggregator,
    };
  }

  _getValue(labels: any = {}) {
    const hash = hashObject(labels);
    return this.hashMap[hash] ? this.hashMap[hash].value : 0;
  }

  // labels() {
  //   const labels = getLabels(this.labelNames, arguments);
  //   return {
  //     inc: inc.call(this, labels),
  //     dec: dec.call(this, labels),
  //     set: set.call(this, labels),
  //     setToCurrentTime: setToCurrentTime.call(this, labels),
  //     startTimer: startTimer.call(this, labels),
  //   };
  // }

  // remove() {
  //   const labels = getLabels(this.labelNames, labelValues);
  //   removeLabels.call(this, this.hashMap, labels);
  // }
}

// function setToCurrentTime(labels) {
//   return () => {
//     const now = Date.now() / 1000;
//     if (labels === undefined) {
//       this.set(now);
//     } else {
//       this.set(labels, now);
//     }
//   };
// }

// function startTimer(startLabels) {
//   return () => {
//     const start = process.hrtime();
//     return (endLabels) => {
//       const delta = process.hrtime(start);
//       this.set(
//         Object.assign({}, startLabels, endLabels),
//         delta[0] + delta[1] / 1e9,
//       );
//     };
//   };
// }

// function dec(labels) {
//   return (value) => {
//     const data = convertLabelsAndValues(labels, value);
//     this.set(
//       data.labelPairs,
//       this._getValue(data.labelPairs) - (data.value || 1),
//     );
//   };
// }

function convertLabelsAndValues(labelPairs: LabelPairs, value: number) {
  return {
    labelPairs: labelPairs,
    value,
  };
}
