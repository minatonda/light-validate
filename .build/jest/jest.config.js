module.exports = {
    roots: ['<rootDir>/../../src'],
    transform: {
        '^.+\\.tsx?$': 'ts-jest',
    },
    testRegex: '(/__tests__/.*|(\\.|/)(test|spec))\\.tsx?$',
    globals: {
        'ts-jest': {
            tsConfig: './.build/typescript/tsconfig.test.json'
        }
    },
    moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
}