import 'reflect-metadata';

const hash = '__light__extend__';

export const LightExtend = (...config: any[]): Function => (target: any, property: string) => {
    const key = getMetadataKey(property);
    Reflect.defineMetadata(key, config, target);
};

export function getMetadataKey(property: string) {
    return `${hash}:${property}`;
}

export function getMetadataValue(property: string, target: any) {
    return Reflect.getMetadata(getMetadataKey(property), target) as Array<any>;
}

export function hasMetadata(property: string, target: object) {
    return Reflect.hasMetadata(getMetadataKey(property), target);
}