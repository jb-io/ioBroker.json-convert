export interface ObjectConfiguration {
    objectId: string,
    alias: string,
}

export interface ObjectConfigurationList {
    [key: string]: ObjectConfiguration;
}
