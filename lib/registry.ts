import { getValueAsString } from "./util.ts";
import { Metric } from "./metric.ts";
import { LabelPairs } from "./interface.ts";

function escapeString(str: string) {
  return str.replace(/\n/g, "\\n").replace(/\\(?!n)/g, "\\\\");
}
function escapeLabelValue(str: any) {
  if (typeof str !== "string") {
    return str;
  }
  return escapeString(str).replace(/"/g, '\\"');
}

class Registry {
  _metrics: { [name: string]: Metric } = {};
  _collectors = [];
  _defaultLabels: LabelPairs = {};
  constructor() {}

  getMetricsAsArray() {
    return Object.values(this._metrics);
  }

  getMetricAsPrometheusString(metric: Metric) {
    const item = metric.get();
    const name = escapeString(item.name);
    const help = `# HELP ${name} ${escapeString(item.help)}`;
    const type = `# TYPE ${name} ${item.type}`;
    const defaultLabelNames = Object.keys(this._defaultLabels);

    let values = "";
    for (const val of item.values) {
      if (defaultLabelNames.length > 0) {
        // Make a copy before mutating
        val.labels = Object.assign({}, val.labels);

        for (const labelName of defaultLabelNames) {
          val.labels[labelName] = val.labels[labelName] ||
            this._defaultLabels[labelName];
        }
      }

      let metricName = item.name;

      const keys = Object.keys(val.labels);
      const size = keys.length;
      if (size > 0) {
        let labels = "";
        let i = 0;
        for (; i < size - 1; i++) {
          labels += `${keys[i]}="${escapeLabelValue(val.labels[keys[i]])}",`;
        }
        labels += `${keys[i]}="${escapeLabelValue(val.labels[keys[i]])}"`;
        metricName += `{${labels}}`;
      }

      values += `${metricName} ${getValueAsString(val.value)}\n`;
    }

    return `${help}\n${type}\n${values}`.trim();
  }

  // metrics() {
  //   let metrics = "";

  //   this.collect();

  //   for (const metric of this.getMetricsAsArray()) {
  //     metrics += `${this.getMetricAsPrometheusString(metric)}\n\n`;
  //   }

  //   return metrics.substring(0, metrics.length - 1);
  // }

  registerMetric(metric: Metric) {
    if (this._metrics[metric.name] && this._metrics[metric.name] !== metric) {
      throw new Error(
        `A metric with the name ${metric.name} has already been registered.`,
      );
    }

    this._metrics[metric.name] = metric;
  }

  // registerCollector(collectorFn: any) {
  //   if (this._collectors.includes(collectorFn)) {
  //     return; // Silently ignore repeated registration.
  //   }
  //   this._collectors.push(collectorFn);
  // }

  // collectors() {
  //   return this._collectors;
  // }

  // collect() {
  //   this._collectors.forEach((collector) => collector());
  // }

  clear() {
    this._metrics = {};
    this._collectors = [];
    this._defaultLabels = {};
  }

  // getMetricsAsJSON() {
  //   const metrics = [];
  //   const defaultLabelNames = Object.keys(this._defaultLabels);

  //   this.collect();

  //   for (const metric of this.getMetricsAsArray()) {
  //     const item = metric.get();

  //     if (item.values && defaultLabelNames.length > 0) {
  //       for (const val of item.values) {
  //         // Make a copy before mutating
  //         val.labels = Object.assign({}, val.labels);

  //         for (const labelName of defaultLabelNames) {
  //           val.labels[labelName] = val.labels[labelName] ||
  //             this._defaultLabels[labelName];
  //         }
  //       }
  //     }

  //     metrics.push(item);
  //   }

  //   return metrics;
  // }

  removeSingleMetric(name: string | number) {
    delete this._metrics[name];
  }

  getSingleMetricAsString(name: string | number) {
    return this.getMetricAsPrometheusString(this._metrics[name]);
  }

  getSingleMetric(name: string | number) {
    return this._metrics[name];
  }

  setDefaultLabels(labels: LabelPairs) {
    this._defaultLabels = labels;
  }

  resetMetrics() {
    for (const metric in this._metrics) {
      this._metrics[metric].reset();
    }
  }

  get contentType() {
    return "text/plain; version=0.0.4; charset=utf-8";
  }

  static merge(registers: any[]) {
    const mergedRegistry = new Registry();

    const metricsToMerge = registers.reduce(
      (acc: string | any[], reg: { getMetricsAsArray: () => any }) =>
        acc.concat(reg.getMetricsAsArray()),
      [],
    );

    metricsToMerge.forEach(mergedRegistry.registerMetric, mergedRegistry);
    return mergedRegistry;
  }
}

export default Registry;
export const globalRegistry = new Registry();
