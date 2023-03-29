"use strict";
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);
var json_flattener_exports = {};
__export(json_flattener_exports, {
  default: () => JsonFlattener
});
module.exports = __toCommonJS(json_flattener_exports);
class JsonFlattener {
  flattenJson(json) {
    try {
      const result = {};
      const data = JSON.parse(json);
      this.flattenObject(result, data);
      return result;
    } catch (e) {
      return null;
    }
  }
  flattenObject(result, data, idPrefix = null) {
    if (typeof data !== "object") {
      result[idPrefix || "data"] = data;
      return;
    }
    for (const dataKey in data) {
      const nestedPrefix = idPrefix ? `${idPrefix}.${dataKey}` : dataKey;
      this.flattenObject(result, data[dataKey], nestedPrefix);
    }
  }
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {});
//# sourceMappingURL=json-flattener.js.map
