/**
 * This is a dummy TypeScript test file using chai and mocha
 *
 * It's automatically excluded from npm and its build output is excluded from both git and npm.
 * It is advised to test all your modules with accompanying *.test.ts-files
 */

import { expect } from 'chai';
import JsonFlattener from './json-flattener';

describe('module to test => function to test', () => {
    // initializing logic
    const expected = 5;

    const jsonFlattener = new JsonFlattener();

    it(`should return ${expected}`, () => {
        const result = jsonFlattener.flattenJson(JSON.stringify(5));
        // assign result a value from functionToTest
        expect(result).to.deep.equal({
            data: 5,
        });
    });

    it(`should return ${expected}`, () => {
        const result = jsonFlattener.flattenJson(JSON.stringify('x'));
        // assign result a value from functionToTest
        expect(result).to.deep.equal({
            data: 'x',
        });
    });

    it(`should return ${expected}`, () => {
        const result = jsonFlattener.flattenJson(JSON.stringify(true));
        // assign result a value from functionToTest
        expect(result).to.deep.equal({
            data: true,
        });
    });

    it(`should return ${expected}`, () => {
        const result = jsonFlattener.flattenJson(JSON.stringify({
            boolean: true,
            string: 'STRING',
            number: 5,
        }));
        // assign result a value from functionToTest
        expect(result).to.deep.equal({
            boolean: true,
            string: 'STRING',
            number: 5,
        });
    });

    it(`should return ${expected}`, () => {
        const result = jsonFlattener.flattenJson(JSON.stringify({
            array: [
                null,
                1,
                2,
                3,
            ],
        }));
        // assign result a value from functionToTest
        console.log(JSON.stringify({
            array: [
                null,
                1,
                2,
                3,
            ],
        }));
        expect(result).to.deep.equal({
            'array.1': 1,
            'array.2': 2,
            'array.3': 3,
        });
    });
    // ... more tests => it

});

// ... more test suites => describe
