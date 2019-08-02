export interface LightRule {
    (value: any): Promise<void>;
}