/*
 * Created with @iobroker/create-adapter v2.3.0
 */

// The adapter-core module gives you access to the core ioBroker functions
// you need to create an adapter
import * as utils from '@iobroker/adapter-core';
import {ObjectConfiguration, ObjectConfigurationList} from './lib/typedef';

// Load your modules here, e.g.:
// import * as fs from "fs";

class JsonConvert extends utils.Adapter {

    private objectConfigurations: ObjectConfigurationList = {};

    public constructor(options: Partial<utils.AdapterOptions> = {}) {
        super({
            ...options,
            name: 'json-convert',
        });
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

        // The adapters config (in the instance object everything under the attribute "native") is accessible via
        // this.config:
        this.log.info('config objects: ' + this.config.objects);

        for (const objectConfig of this.config.objects) {
            this.objectConfigurations[objectConfig.objectId] = objectConfig;
            this.subscribeForeignStates(objectConfig.objectId)
        }

        // /*
        // For every state in the system there has to be also an object of type state
        // Here a simple template for a boolean variable named "testVariable"
        // Because every adapter instance uses its own unique namespace variable names can't collide with other adapters variables
        // */
        // await this.setObjectNotExistsAsync('testVariable', {
        //     type: 'state',
        //     common: {
        //         name: 'testVariable',
        //         type: 'boolean',
        //         role: 'indicator',
        //         read: true,
        //         write: true,
        //     },
        //     native: {},
        // });
        //
        // // In order to get state updates, you need to subscribe to them. The following line adds a subscription for our variable we have created above.
        // this.subscribeStates('testVariable');
        // // You can also add a subscription for multiple states. The following line watches all states starting with "lights."
        // // this.subscribeStates('lights.*');
        // // Or, if you really must, you can also watch all states. Don't do this if you don't need to. Otherwise this will cause a lot of unnecessary load on the system:
        // // this.subscribeStates('*');
        //
        // /*
        //     setState examples
        //     you will notice that each setState will cause the stateChange event to fire (because of above subscribeStates cmd)
        // */
        // // the variable testVariable is set to true as command (ack=false)
        // await this.setStateAsync('testVariable', true);
        //
        // // same thing, but the value is flagged "ack"
        // // ack should be always set to true if the value is received from or acknowledged from the target system
        // await this.setStateAsync('testVariable', { val: true, ack: true });
        //
        // // same thing, but the state is deleted after 30s (getState will return null afterwards)
        // await this.setStateAsync('testVariable', { val: true, ack: true, expire: 30 });
        //
        // // examples for the checkPassword/checkGroup functions
        // let result = await this.checkPasswordAsync('admin', 'iobroker');
        // this.log.info('check user admin pw iobroker: ' + result);
        //
        // result = await this.checkGroupAsync('admin', 'admin');
        // this.log.info('check group user admin group admin: ' + result);
    }

    /**
     * Is called when adapter shuts down - callback has to be called under any circumstances!
     */
    private onUnload(callback: () => void): void {
        try {
            // Here you must clear all timeouts or intervals that may still be active
            // clearTimeout(timeout1);
            // clearTimeout(timeout2);
            // ...
            // clearInterval(interval1);

            callback();
        } catch (e) {
            callback();
        }
    }

    private async writeObject(idPrefix: string, data: any): Promise<void> {
        if (typeof data === 'object') {
            for (const dataKey in data) {
                await this.writeObject(idPrefix + '.' + dataKey, data[dataKey]);
            }
        } else {
            await this.setObjectNotExistsAsync(idPrefix, {
                type: 'state',
                common: {
                    name: idPrefix,
                    type: 'mixed',
                    role: 'indicator',
                    read: true,
                    write: false,
                },
                native: {},
            });
            await this.setStateAsync(idPrefix, data, true);
        }
    }

    private async onJsonStateChanged(state: ioBroker.State, config: ObjectConfiguration): Promise<void> {
        const data = JSON.parse(state.val as string);

        await this.setObjectNotExistsAsync(config.alias, {
            type: 'device',
            common: {
                name: config.alias,
                icon: 'data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiPz4KPHN2ZyB3aWR0aD0iMzIwIiBoZWlnaHQ9IjMyMCIgdmVyc2lvbj0iMS4xIiB2aWV3Qm94PSIwIDAgODQuNjY3IDg0LjY2NyIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHRleHQgdHJhbnNmb3JtPSJzY2FsZSguOTY1MDEgMS4wMzYzKSIgeD0iNy4xMzc5NDM3IiB5PSI1Ni41MzQ5ODEiIGZpbGw9IiMwMDAwMDAiIGZvbnQtZmFtaWx5PSJzYW5zLXNlcmlmIiBmb250LXNpemU9IjUyLjU2N3B4IiBsZXR0ZXItc3BhY2luZz0iNi41NzA5cHgiIHN0cm9rZS13aWR0aD0iLjI2Mjg0IiB3b3JkLXNwYWNpbmc9IjBweCIgc3R5bGU9ImxpbmUtaGVpZ2h0OjEuMjUiIHhtbDpzcGFjZT0icHJlc2VydmUiPjx0c3BhbiB4PSI3LjEzNzk0MzciIHk9IjU2LjUzNDk4MSIgZm9udC1mYW1pbHk9InNhbnMtc2VyaWYiIGZvbnQtc2l6ZT0iNTIuNTY3cHgiIHN0cm9rZS13aWR0aD0iLjI2Mjg0Ij48dHNwYW4gZmlsbD0iIzAwMDBmZiI+ezwvdHNwYW4+PHRzcGFuIGZpbGw9IiNmZjAwMDAiPn08L3RzcGFuPjwvdHNwYW4+PC90ZXh0Pgo8L3N2Zz4KCg==',
            },
            native: {},
        });

        await this.writeObject(config.alias , data);
    }

    /**
     * Is called if a subscribed state changes
     */
    private async onStateChange(id: string, state: ioBroker.State | null | undefined): Promise<void> {
        if (state) {
            // The state was changed
            if (state.ack && this.objectConfigurations[id]) {
                await this.onJsonStateChanged(state, this.objectConfigurations[id]);
            }
        } else {
            // The state was deleted
            this.log.info(`state ${id} deleted`);
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
