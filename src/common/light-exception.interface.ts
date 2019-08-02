import { LightRule } from './light-rule.interface';

export interface LightException {
    rule: LightRule;
    target: any;
    property: string;
    code: string;
}