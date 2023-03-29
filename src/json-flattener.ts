import {FlattenedObject} from './lib/typedef';

export default class JsonFlattener {

    public flattenJson(json: string): FlattenedObject|null {
        try {
            const result = {};
            const data = JSON.parse(json);
            this.flattenObject(result, data);
            return result;
        } catch (e) {
            return null;
        }
    }

    private flattenObject(result: any, data: any, idPrefix: string | null = null): void {
        if (typeof data !== 'object') {
            result[idPrefix || 'data'] = data;
            return;
        }
        for (const dataKey in data) {
            const nestedPrefix = idPrefix ? `${idPrefix}.${dataKey}` : dataKey;
            this.flattenObject(result, data[dataKey], nestedPrefix);
        }
    }
}
