// This file extends the AdapterConfig type from "@types/iobroker"

import { ObjectConfiguration } from './typedef';

// Augment the globally declared type ioBroker.AdapterConfig
declare global {
    namespace ioBroker {
        interface AdapterConfig {
            objects: Array<ObjectConfiguration>;
        }
    }
}

// this is required so the above AdapterConfig is found by TypeScript / type checking
export {};
