import { LightRule } from './light-rule.interface';

export class LightException {
    rule: LightRule;
    target: any;
    property: string;
    code: string;
}