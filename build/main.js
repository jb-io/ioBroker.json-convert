"use strict";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
var utils = __toESM(require("@iobroker/adapter-core"));
var import_json_flattener = __toESM(require("./json-flattener"));
class JsonConvert extends utils.Adapter {
  constructor(options = {}) {
    super({
      ...options,
      name: "json-convert"
    });
    this.objectConfigurations = {};
    this.flattener = new import_json_flattener.default();
    this.on("ready", this.onReady.bind(this));
    this.on("stateChange", this.onStateChange.bind(this));
    this.on("unload", this.onUnload.bind(this));
  }
  async onReady() {
    for (const objectConfig of this.config.objects) {
      this.objectConfigurations[objectConfig.objectId] = objectConfig;
      this.assertDeviceObject(objectConfig.alias);
      this.subscribeForeignStates(objectConfig.objectId);
    }
  }
  onUnload(callback) {
    try {
      callback();
    } catch (e) {
      callback();
    }
  }
  async onStateChange(id, state) {
    if (!state) {
      this.log.info(`state ${id} deleted`);
      return;
    }
    if (state.ack && this.objectConfigurations[id]) {
      await this.onJsonStateChanged(state, this.objectConfigurations[id]);
    }
  }
  assertDeviceObject(deviceName) {
    this.setObjectNotExists(deviceName, {
      type: "device",
      common: {
        name: deviceName,
        icon: "/icons/device-icon.svg"
      },
      native: {}
    });
  }
  async writeObject(id, value) {
    await this.setObjectNotExistsAsync(id, {
      type: "state",
      common: {
        name: id,
        type: "mixed",
        role: "indicator",
        read: true,
        write: false
      },
      native: {}
    });
    await this.setStateAsync(id, value, true);
  }
  async iterateAsync(iterable, callback) {
    const promises = [];
    for (const key in iterable) {
      promises.push(callback(key, iterable[key]));
    }
    await Promise.allSettled(promises);
  }
  async onJsonStateChanged(state, config) {
    const flatStates = this.flattener.flattenJson(state.val);
    if (flatStates) {
      await this.iterateAsync(
        flatStates,
        (key, value) => this.writeObject(`${config.alias}.${key}`, value)
      );
    }
  }
}
if (require.main !== module) {
  module.exports = (options) => new JsonConvert(options);
} else {
  (() => new JsonConvert())();
}
//# sourceMappingURL=main.js.map
