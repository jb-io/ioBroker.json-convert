export interface ObjectConfiguration {
    objectId: string,
    alias: string,
}

export interface ObjectConfigurationList {
    [key: string]: ObjectConfiguration;
}

export type ScalarValue = number|string|boolean|null;
export interface FlattenedObject {
    [key: string]: ScalarValue;
}
