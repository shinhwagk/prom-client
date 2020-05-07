import { Sha256 } from "https://deno.land/std/util/sha256.ts";

function hash_sha256(initPWD: string) {
  const sha256 = new Sha256();
  sha256.update("initPWD");
  return sha256.toString();
}

export function getValueAsString(value: number) {
  if (Number.isNaN(value)) {
    return "Nan";
  } else if (!Number.isFinite(value)) {
    if (value < 0) {
      return "-Inf";
    } else {
      return "+Inf";
    }
  } else {
    return `${value}`;
  }
}

// export function removeLabels(hashMap, labels) {
//   const hash = hashObject(labels);
//   delete hashMap[hash];
// }

export function setValue(hashMap: any, value: number, labelPairs: any) {
  const hash: string = hashObject(labelPairs);
  hashMap[hash] = {
    value: value,
    labels: labelPairs,
  };
  return hashMap;
}

export function getLabels(
  labelNames: string[],
  labelValues: string[],
): { [name: string]: string } {
  if (labelNames.length !== labelValues.length) {
    throw new Error("Invalid number of arguments");
  }

  return labelNames.reduce((acc, label, index) => {
    acc[label] = labelValues[index];
    return acc;
  }, {} as { [name: string]: string });
}

export function hashObject(labelPairs: any) {
  let keys = Object.keys(labelPairs);
  if (keys.length === 0) {
    return "";
  }
  // if (keys.length > 1) {
  //   keys = keys.sort();
  // }

  const hash: string[] = [];
  for (const [k, v] of Object.entries(labelPairs)) {
    hash.push(`${k}:${v}`);
  }
  return hash_sha256(hash.join(","));
}

export function isObject(obj: any) {
  return obj === Object(obj);
}

// export class Grouper extends Map {
//   /**
// 	 * Adds the `value` to the `key`'s array of values.
// 	 * @param {*} key Key to set.
// 	 * @param {*} value Value to add to `key`'s array.
// 	 * @returns {undefined} undefined.
// 	 */
//   add(key, value) {
//     if (this.has(key)) {
//       this.get(key).push(value);
//     } else {
//       this.set(key, [value]);
//     }
//   }
// }
