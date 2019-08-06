import { LightException } from './common/light-exception';
import { LightRule } from './common/light-rule.interface';
import { LightValidate } from './common/light-validate.decorator';
import { lightValidate } from './callable';
import { LightExtend } from './common/light-extend.decorator';

describe('callable', () => {

    const RuleIsBool: LightRule = async function (value, target) {
        if (value !== true) {
            throw 'INVALID_IS_NOT_TRUTY';
        };
    }

    const RuleIsNumber: LightRule = async function (value, target) {
        if (typeof value !== 'number') {
            throw 'INVALID_IS_NOT_A_NUMBER';
        };
    }

    const RuleIsString: LightRule = async function (value, target) {
        if (typeof value !== 'string') {
            throw 'INVALID_IS_NOT_STRING';
        };
    }

    const RuleHaveNumber: LightRule = async function (value: Array<any>, target) {
        if (!value.some(item => typeof item === 'number')) {
            throw 'INVALID_NOT_HAVE_HUMBER';
        }
    }

    const RuleHaveString: LightRule = async function (value: Array<any>, target) {
        if (!value.some(item => typeof item === 'string')) {
            throw 'INVALID_NOT_HAVE_STRING';
        }
    }

    const RuleMaxLenght6: LightRule = async function (value: Array<any>, target) {
        if (value.length !== 6) {
            throw 'INVALID_IS_MAX_LENGTH_6';
        };
    }

    const RuleMustNotBeSameThan = function (key: string) {
        return async function (value: string,target:any) {
            if(value===target[key]){
                throw 'input-not-be-same-than';
            }
        } as LightRule;
    }

    class FirstLevelTestMapping {
        @LightValidate(RuleIsBool)
        pBoolean: boolean = undefined;

        @LightValidate(RuleIsNumber)
        pNumeric: number = undefined;

        @LightValidate(RuleIsString)
        pText: string = undefined;
    }

    class SecondLevelTestMapping {
        @LightValidate(RuleIsBool)
        pBoolean: boolean = undefined;

        @LightExtend(FirstLevelTestMapping)
        pTest: FirstLevelTestMapping = undefined;

    }

    class ThirdyLevelTestMapping {
        @LightValidate(RuleHaveNumber, RuleHaveString, RuleMaxLenght6)
        pArray: Array<any> = undefined;
    }

    class UserTestMapping {
        name:string = undefined;

        @LightValidate(RuleMustNotBeSameThan('name'))
        username:string = undefined;
    }

    it('should throw 3 errors on one item', async () => {

        await lightValidate({}, FirstLevelTestMapping)
            .catch((errors: LightException[]) => {
                expect(errors.length).toBe(3);
            });

    });

    it('should throw 2 errors on one item', async () => {

        await lightValidate({ pBoolean: true }, FirstLevelTestMapping)
            .catch((errors: LightException[]) => {
                expect(errors.length).toBe(2);
            });

    });

    it('should throw 1 errors on one item', async () => {

        await lightValidate({ pBoolean: true, pNumeric: 1 }, FirstLevelTestMapping)
            .catch((errors: LightException[]) => {
                expect(errors.length).toBe(1);
            });

    });

    it('should throw 0 errors on one item', async () => {

        await lightValidate({ pBoolean: true, pNumeric: 1, pText: 'shusaihuisa' }, FirstLevelTestMapping)
            .catch((errors: LightException[]) => {
                expect(errors.length).toBe(0);
            });

    });

    it('should throw 1 errors on one item with 3 properties map, but some 1 as specified on LightValidate', async () => {

        await lightValidate({}, FirstLevelTestMapping, 'pNumeric')
            .catch((errors: LightException[]) => {
                expect(errors.length).toBe(1);
                // console.log('rejeitada',errors.length)
            });

    });

    it('should throw 2 errors on one item with 3 properties map, but some 2 as specified on LightValidate', async () => {

        await lightValidate({}, FirstLevelTestMapping, 'pNumeric', 'pBoolean')
            .catch((errors: LightException[]) => {
                expect(errors.length).toBe(2);
            });

    });

    it('should throw 3 errors on array of item', async () => {

        await lightValidate([{}, {}, {}], FirstLevelTestMapping)
            .catch((errors: LightException[]) => {
                expect(errors.length).toBe(9);
            });

    });

    it('should throw 2 errors on array of item', async () => {

        await lightValidate([
            { pBoolean: true },
            { pBoolean: true },
            { pBoolean: true }
        ], FirstLevelTestMapping)
            .catch((errors: LightException[]) => {
                expect(errors.length).toBe(6);
            });

    });

    it('should throw 1 errors on array of item', async () => {

        await lightValidate([
            { pBoolean: true, pNumeric: 1 },
            { pBoolean: true, pNumeric: 1 },
            { pBoolean: true, pNumeric: 1 }
        ], FirstLevelTestMapping)
            .catch((errors: LightException[]) => {
                expect(errors.length).toBe(3);
            });

    });

    it('should throw 0 errors on array of item', async () => {

        await lightValidate([
            { pBoolean: true, pNumeric: 1, pText: 'shusaihuisa' },
            { pBoolean: true, pNumeric: 1, pText: 'shusaihuisa' },
            { pBoolean: true, pNumeric: 1, pText: 'shusaihuisa' }
        ], FirstLevelTestMapping)
            .catch((errors: LightException[]) => {
                expect(errors.length).toBe(0);
            });

    });

    it('should throw 3 errors on array of 3 itens with 3 properties map, but some 1 as specified on LightValidate', async () => {

        await lightValidate([{}, {}, {}], FirstLevelTestMapping, 'pNumeric')
            .catch((errors: LightException[]) => {
                expect(errors.length).toBe(3);
            });

    });

    it('should throw 3 errors on array of 3 itens with 3 properties map, but some 1 as specified on LightValidate', async () => {

        await lightValidate([{}, {}, {}], FirstLevelTestMapping, 'pNumeric', 'pBoolean')
            .catch((errors: LightException[]) => {
                expect(errors.length).toBe(6);
            });

    });

    it('should LightValidate property with use decorator and throw 3 errors on second level property', async () => {

        await lightValidate({
            pBoolean: true,
            pTest: {}
        }, SecondLevelTestMapping)
            .catch((errors: LightException[]) => {
                expect(errors.length).toBe(3);
            });

    });

    it('should LightValidate property with use decorator and throw 3 errors on second level property and 1 on first level', async () => {

        await lightValidate({
            pTest: {}
        }, SecondLevelTestMapping)
            .catch((errors: LightException[]) => {
                expect(errors.length).toBe(4);
            });

    });

    it('should LightValidate property with use decorator and throw 0 errors on second level property and 1 on first level', async () => {

        await lightValidate({}, SecondLevelTestMapping)
            .catch((errors: LightException[]) => {
                expect(errors.length).toBe(1);
            });

    });

    it('should LightValidate a property with two or more rules and return 3 errors', async () => {

        await lightValidate({
            pArray: []
        }, ThirdyLevelTestMapping)
            .catch((errors: LightException[]) => {
                expect(errors.length).toBe(3);
            });

    });

    it('should LightValidate a property with two or more rules and return 2 errors', async () => {

        await lightValidate({
            pArray: ['a']
        }, ThirdyLevelTestMapping)
            .catch((errors: LightException[]) => {
                expect(errors.length).toBe(2);
            });

    });

    it('should LightValidate a property with two or more rules and return 1 errors', async () => {

        await lightValidate({
            pArray: ['a', 1]
        }, ThirdyLevelTestMapping)
            .catch((errors: LightException[]) => {
                expect(errors.length).toBe(1);
            });

    });

    it('should LightValidate a property with two or more rules and return 0 errors', async () => {

        await lightValidate({
            pArray: ['a', 'b', 'c', 1, 2, 3]
        }, ThirdyLevelTestMapping)
            .catch((errors: LightException[]) => {
                expect(errors.length).toBe(1);
            });

    });

    it('should LightValidate a rule that uses the target parameter and return 1 errors', async () => {

        await lightValidate({
            name:'minatonda',
            username:'minatonda'
        }, UserTestMapping)
            .catch((errors: LightException[]) => {
                expect(errors.length).toBe(1);
            });

    });

});