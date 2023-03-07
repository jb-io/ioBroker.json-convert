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
class JsonConvert extends utils.Adapter {
  constructor(options = {}) {
    super({
      ...options,
      name: "json-convert"
    });
    this.objectConfigurations = {};
    this.on("ready", this.onReady.bind(this));
    this.on("stateChange", this.onStateChange.bind(this));
    this.on("unload", this.onUnload.bind(this));
  }
  async onReady() {
    this.log.info("config objects: " + this.config.objects);
    for (const objectConfig of this.config.objects) {
      this.objectConfigurations[objectConfig.objectId] = objectConfig;
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
  async writeObject(idPrefix, data) {
    if (typeof data === "object") {
      for (const dataKey in data) {
        await this.writeObject(idPrefix + "." + dataKey, data[dataKey]);
      }
    } else {
      await this.setObjectNotExistsAsync(idPrefix, {
        type: "state",
        common: {
          name: idPrefix,
          type: "mixed",
          role: "indicator",
          read: true,
          write: false
        },
        native: {}
      });
      await this.setStateAsync(idPrefix, data, true);
    }
  }
  async onJsonStateChanged(state, config) {
    await this.setObjectNotExistsAsync(config.alias, {
      type: "device",
      common: {
        name: config.alias,
        icon: "data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiPz4KPHN2ZyB3aWR0aD0iMzIwIiBoZWlnaHQ9IjMyMCIgdmVyc2lvbj0iMS4xIiB2aWV3Qm94PSIwIDAgODQuNjY3IDg0LjY2NyIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHRleHQgdHJhbnNmb3JtPSJzY2FsZSguOTY1MDEgMS4wMzYzKSIgeD0iNy4xMzc5NDM3IiB5PSI1Ni41MzQ5ODEiIGZpbGw9IiMwMDAwMDAiIGZvbnQtZmFtaWx5PSJzYW5zLXNlcmlmIiBmb250LXNpemU9IjUyLjU2N3B4IiBsZXR0ZXItc3BhY2luZz0iNi41NzA5cHgiIHN0cm9rZS13aWR0aD0iLjI2Mjg0IiB3b3JkLXNwYWNpbmc9IjBweCIgc3R5bGU9ImxpbmUtaGVpZ2h0OjEuMjUiIHhtbDpzcGFjZT0icHJlc2VydmUiPjx0c3BhbiB4PSI3LjEzNzk0MzciIHk9IjU2LjUzNDk4MSIgZm9udC1mYW1pbHk9InNhbnMtc2VyaWYiIGZvbnQtc2l6ZT0iNTIuNTY3cHgiIHN0cm9rZS13aWR0aD0iLjI2Mjg0Ij48dHNwYW4gZmlsbD0iIzAwMDBmZiI+ezwvdHNwYW4+PHRzcGFuIGZpbGw9IiNmZjAwMDAiPn08L3RzcGFuPjwvdHNwYW4+PC90ZXh0Pgo8L3N2Zz4KCg=="
      },
      native: {}
    });
    let data;
    try {
      data = JSON.parse(state.val);
    } catch (e) {
      return;
    }
    await this.writeObject(config.alias, data);
  }
  async onStateChange(id, state) {
    if (state) {
      if (state.ack && this.objectConfigurations[id]) {
        await this.onJsonStateChanged(state, this.objectConfigurations[id]);
      }
    } else {
      this.log.info(`state ${id} deleted`);
    }
  }
}
if (require.main !== module) {
  module.exports = (options) => new JsonConvert(options);
} else {
  (() => new JsonConvert())();
}
//# sourceMappingURL=main.js.map
