import 'reflect-metadata';
import { LightRule } from './light-rule.interface';

const hash = '__light__validate__';

export const LightValidate = (...config: LightRule[]): Function => (target: any, property: string) => {
    const key = getMetadataKey(property);
    Reflect.defineMetadata(key, config, target);
};

export function getMetadataKey(property: string) {
    return `${hash}:${property}`;
}

export function getMetadataValue(property: string, target: any) {
    return Reflect.getMetadata(getMetadataKey(property), target) as LightRule[];
}

export function hasMetadata(property: string, target: object) {
    return Reflect.hasMetadata(getMetadataKey(property), target);
}