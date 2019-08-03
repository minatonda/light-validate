export interface LightRule {
    (value: any, target: any): Promise<void>;
}