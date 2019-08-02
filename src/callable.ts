import { LightException } from './common/light-exception.interface';
import * as LightValidateDecorator from './common/light-validate.decorator';
import * as LightExtendDecorator from './common/light-extend.decorator';

export async function lightValidate(target: any, klass: any, ...properties: string[]) {
    if (target && Array.isArray(target)) {
        return lightValidateEach(target, klass, ...properties);
    }
    else if (target) {
        return lightValidateOne(target, klass, ...properties);
    }
}

export async function lightValidateOne(target: any, klass: any, ...properties: string[]) {
    const errors = await exceptionsByOne(target, klass, ...properties);
    return errors.length ? Promise.reject<LightException[]>(errors) : Promise.resolve();
}

export async function lightValidateEach(target: Array<any>, klass: any, ...properties: string[]) {
    const errors = await exceptionsByEach(target, klass, ...properties);
    return errors.length ? Promise.reject<LightException[]>(errors) : Promise.resolve();
}

export async function exceptionsBy(target: any, klass: any, ...properties: string[]) {
    if (target && Array.isArray(target)) {
        return exceptionsByEach(target, klass, ...properties);
    }
    else if (target) {
        return exceptionsByOne(target, klass, ...properties);
    }
    else {
        return [] as LightException[];
    }
}

export async function exceptionsByEach(target: Array<any>, klass: any, ...properties: string[]) {
    return Promise.all(target.map(item => exceptionsByOne(item, klass, ...properties)))
        .then(arrays => arrays.reduce((initial, current) => initial.concat(current), []));
}

export async function exceptionsByOne(target: any, klass: any, ...properties: string[]) {
    return Promise.all([
        exceptionsByLightValidate(target, klass, ...properties),
        exceptionsByLightExtend(target, klass, ...properties)
    ])
        .then(exceptions => exceptions.reduce((initial, current) => initial.concat(current)));
}

export async function exceptionsByLightValidate(target: any, klass: any, ...properties: string[]) {
    const klassInstance = new klass;
    let errors: LightException[] = [];

    const klassProperties = (properties && properties.length) ? properties : Object.keys(klassInstance).filter(property => LightValidateDecorator.hasMetadata(property, klassInstance));
    while (klassProperties.length) {
        const property = klassProperties.shift();
        const rules = [...LightValidateDecorator.getMetadataValue(property, klassInstance)];

        while (rules.length) {
            const rule = rules.shift();
            await rule(target[property])
                .catch((code: string) => {
                    const error: LightException = { rule: rule, target: target, property: property, code: code };
                    errors = [...errors, error];
                });
        }
    }
    return errors;
}

export async function exceptionsByLightExtend(target: any, klass: any, ...properties: string[]) {
    const klassInstance = new klass;
    let errors: LightException[] = [];

    const klassProperties = (properties && properties.length) ? properties : Object.keys(klassInstance).filter(property => LightExtendDecorator.hasMetadata(property, klassInstance));
    while (klassProperties.length) {
        const property = klassProperties.shift();
        const uses = [...LightExtendDecorator.getMetadataValue(property, klassInstance) || []];

        while (uses.length) {
            const use = uses.shift();
            await exceptionsBy(target[property], use)
                .then(targetErrors => errors = [...targetErrors, ...errors]);
        }

    }
    return errors;
}