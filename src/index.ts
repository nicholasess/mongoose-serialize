import mongoose from "mongoose";

interface Options {
  fields: Array<string>;
}

export default function Serialize(
  schema: mongoose.Schema,
  options: Options
): void {
  schema.post("find", function (array) {
    if (options.fields.length === 0) throw "Fields accept not accept empty";
    if (options?.fields.filter((item) => typeof item !== "string").length > 0)
      throw "Fields accept just strings";
    if (options?.fields.length > 0) {
      for (const ar in array) {
        const newItem = {};
        const item = Object.values(array[ar])[3];
        const keys = Object.keys(item);
        for (const i in keys) {
          if (options.fields.includes(keys[i])) {
            newItem[keys[i]] = item[keys[i]];
          }
        }
        array[ar] = newItem;
      }
    }
  });
}
