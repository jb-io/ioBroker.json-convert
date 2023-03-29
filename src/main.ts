/*
 * Created with @iobroker/create-adapter v2.3.0
 */

// The adapter-core module gives you access to the core ioBroker functions
// you need to create an adapter
import * as utils from '@iobroker/adapter-core';
import {FlattenedObject, ObjectConfiguration, ObjectConfigurationList, ScalarValue} from './lib/typedef';
import JsonFlattener from './json-flattener';

// Load your modules here, e.g.:
// import * as fs from "fs";

class JsonConvert extends utils.Adapter {

    private objectConfigurations: ObjectConfigurationList = {};
    private flattener: JsonFlattener;

    public constructor(options: Partial<utils.AdapterOptions> = {}) {
        super({
            ...options,
            name: 'json-convert',
        });
        this.flattener = new JsonFlattener();
        this.on('ready', this.onReady.bind(this));
        this.on('stateChange', this.onStateChange.bind(this));
        // this.on('objectChange', this.onObjectChange.bind(this));
        // this.on('message', this.onMessage.bind(this));
        this.on('unload', this.onUnload.bind(this));
    }

    /**
     * Is called when databases are connected and adapter received configuration.
     */
    private async onReady(): Promise<void> {
        // Initialize your adapter here

        for (const objectConfig of this.config.objects) {
            this.objectConfigurations[objectConfig.objectId] = objectConfig;
            this.assertDeviceObject(objectConfig.alias);
            this.subscribeForeignStates(objectConfig.objectId)
        }
    }

    /**
     * Is called when adapter shuts down - callback has to be called under any circumstances!
     */
    private onUnload(callback: () => void): void {
        try {
            // Here you must clear all timeouts or intervals that may still be active
            callback();
        } catch (e) {
            callback();
        }
    }

    /**
     * Is called if a subscribed state changes
     */
    private async onStateChange(id: string, state: ioBroker.State | null | undefined): Promise<void> {
        if (!state) {
            // The state was deleted
            this.log.info(`state ${id} deleted`);
            return;
        }

        // The state was changed
        if (state.ack && this.objectConfigurations[id]) {
            await this.onJsonStateChanged(state, this.objectConfigurations[id]);
        }
    }

    private assertDeviceObject(deviceName: string): void {
        this.setObjectNotExists(deviceName, {
            type: 'device',
            common: {
                name: deviceName,
                icon: '/icons/device-icon.svg',
            },
            native: {},
        });
    }

    private async writeObject(id: string, value: ioBroker.StateValue): Promise<void> {
        await this.setObjectNotExistsAsync(id, {
            type: 'state',
            common: {
                name: id,
                type: 'mixed',
                role: 'indicator',
                read: true,
                write: false,
            },
            native: {},
        });
        await this.setStateAsync(id, value, true);
    }

    private async iterateAsync(iterable: FlattenedObject, callback: (key: string, item: ScalarValue) => Promise<void>): Promise<void> {
        const promises: Promise<void>[] = [];
        for (const key in iterable) {
            promises.push(callback(key, iterable[key]));
        }

        await Promise.allSettled(promises);
    }

    private async onJsonStateChanged(state: ioBroker.State, config: ObjectConfiguration): Promise<void> {

        const flatStates = this.flattener.flattenJson(state.val as string);
        if (flatStates) {
            await this.iterateAsync(
                flatStates,
                (key, value) => this.writeObject(`${(config.alias)}.${key}`, value)
            );
        }
    }

}

if (require.main !== module) {
    // Export the constructor in compact mode
    module.exports = (options: Partial<utils.AdapterOptions> | undefined) => new JsonConvert(options);
} else {
    // otherwise start the instance directly
    (() => new JsonConvert())();
}
