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

    class TestModel {
        @LightValidate(RuleIsBool)
        var_bool: boolean = undefined;

        @LightValidate(RuleIsNumber)
        var_number: number = undefined;

        @LightValidate(RuleIsString)
        var_string: string = undefined;
    }

    class Test2Model {
        @LightValidate(RuleIsBool)
        var_bool: boolean = undefined;

        @LightExtend(TestModel)
        var_testModel: TestModel = undefined;

    }

    class Test3Model {
        @LightValidate(RuleHaveNumber, RuleHaveString, RuleMaxLenght6)
        var_array: Array<any> = undefined;
    }

    it('should throw 3 errors on one item', async () => {

        await lightValidate({}, TestModel)
            .catch((errors: LightException[]) => {
                expect(errors.length).toBe(3);
            });

    });

    it('should throw 2 errors on one item', async () => {

        await lightValidate({ var_bool: true }, TestModel)
            .catch((errors: LightException[]) => {
                expect(errors.length).toBe(2);
            });

    });

    it('should throw 1 errors on one item', async () => {

        await lightValidate({ var_bool: true, var_number: 1 }, TestModel)
            .catch((errors: LightException[]) => {
                expect(errors.length).toBe(1);
            });

    });

    it('should throw 0 errors on one item', async () => {

        await lightValidate({ var_bool: true, var_number: 1, var_string: 'shusaihuisa' }, TestModel)
            .catch((errors: LightException[]) => {
                expect(errors.length).toBe(0);
            });

    });

    it('should throw 1 errors on one item with 3 properties map, but some 1 as specified on LightValidate', async () => {

        await lightValidate({}, TestModel, 'var_number')
            .catch((errors: LightException[]) => {
                expect(errors.length).toBe(1);
                // console.log('rejeitada',errors.length)
            });

    });

    it('should throw 2 errors on one item with 3 properties map, but some 2 as specified on LightValidate', async () => {

        await lightValidate({}, TestModel, 'var_number', 'var_bool')
            .catch((errors: LightException[]) => {
                expect(errors.length).toBe(2);
            });

    });

    it('should throw 3 errors on array of item', async () => {

        await lightValidate([{}, {}, {}], TestModel)
            .catch((errors: LightException[]) => {
                expect(errors.length).toBe(9);
            });

    });

    it('should throw 2 errors on array of item', async () => {

        await lightValidate([
            { var_bool: true },
            { var_bool: true },
            { var_bool: true }
        ], TestModel)
            .catch((errors: LightException[]) => {
                expect(errors.length).toBe(6);
            });

    });

    it('should throw 1 errors on array of item', async () => {

        await lightValidate([
            { var_bool: true, var_number: 1 },
            { var_bool: true, var_number: 1 },
            { var_bool: true, var_number: 1 }
        ], TestModel)
            .catch((errors: LightException[]) => {
                expect(errors.length).toBe(3);
            });

    });

    it('should throw 0 errors on array of item', async () => {

        await lightValidate([
            { var_bool: true, var_number: 1, var_string: 'shusaihuisa' },
            { var_bool: true, var_number: 1, var_string: 'shusaihuisa' },
            { var_bool: true, var_number: 1, var_string: 'shusaihuisa' }
        ], TestModel)
            .catch((errors: LightException[]) => {
                expect(errors.length).toBe(0);
            });

    });

    it('should throw 3 errors on array of 3 itens with 3 properties map, but some 1 as specified on LightValidate', async () => {

        await lightValidate([{}, {}, {}], TestModel, 'var_number')
            .catch((errors: LightException[]) => {
                expect(errors.length).toBe(3);
            });

    });

    it('should throw 3 errors on array of 3 itens with 3 properties map, but some 1 as specified on LightValidate', async () => {

        await lightValidate([{}, {}, {}], TestModel, 'var_number', 'var_bool')
            .catch((errors: LightException[]) => {
                expect(errors.length).toBe(6);
            });

    });

    it('should LightValidate property with use decorator and throw 3 errors on second level property', async () => {

        await lightValidate({
            var_bool: true,
            var_testModel: {}
        }, Test2Model)
            .catch((errors: LightException[]) => {
                expect(errors.length).toBe(3);
            });

    });

    it('should LightValidate property with use decorator and throw 3 errors on second level property and 1 on first level', async () => {

        await lightValidate({
            var_testModel: {}
        }, Test2Model)
            .catch((errors: LightException[]) => {
                expect(errors.length).toBe(4);
            });

    });

    it('should LightValidate property with use decorator and throw 0 errors on second level property and 1 on first level', async () => {

        await lightValidate({}, Test2Model)
            .catch((errors: LightException[]) => {
                expect(errors.length).toBe(1);
            });

    });

    it('should LightValidate a property with two or more rules and return 3 errors', async () => {

        await lightValidate({
            var_array: []
        }, Test3Model)
            .catch((errors: LightException[]) => {
                expect(errors.length).toBe(3);
            });

    });

    it('should LightValidate a property with two or more rules and return 2 errors', async () => {

        await lightValidate({
            var_array: ['a']
        }, Test3Model)
            .catch((errors: LightException[]) => {
                expect(errors.length).toBe(2);
            });

    });

    it('should LightValidate a property with two or more rules and return 1 errors', async () => {

        await lightValidate({
            var_array: ['a', 1]
        }, Test3Model)
            .catch((errors: LightException[]) => {
                expect(errors.length).toBe(1);
            });

    });

    it('should LightValidate a property with two or more rules and return 0 errors', async () => {

        await lightValidate({
            var_array: ['a', 'b', 'c', 1, 2, 3]
        }, Test3Model)
            .catch((errors: LightException[]) => {
                expect(errors.length).toBe(1);
            });

    });

});