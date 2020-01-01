import { unwrap } from "../../src/utils"
/* eslint-disable @typescript-eslint/no-namespace */

declare global {
    namespace jest {
        interface Matchers<R, T> {
            toBeBetween(a: number, b: number): R
        }
    }
}
expect.extend({
    toBeBetween(received: number, lower: number, upper: number) {
        const pass = received >= lower && received < upper
        if (pass) {
            return {
                message: () =>
                    `Expected ${received} not to be within range [${lower}, ${upper})`,
                pass: true
            }
        } else {
            return {
                message: () =>
                    `Expected ${received} to be within range [${lower}, ${upper})`,
                pass: false
            }
        }
    }
})

test("unwrap correctly generates random values", () => {
    for (let i = 0; i < 10; ++i) {
        expect(unwrap([0, 1])).toBeBetween(-1, 1)
    }

    for (let i = 0; i < 10; ++i) {
        expect(unwrap([-1, 1])).toBeBetween(-1, 1)
    }

    for (let i = 0; i < 10; ++i) {
        expect(unwrap([-500, 500])).toBeBetween(-500, 500)
    }

    for (let i = 0; i < 10; ++i) {
        expect(unwrap([-0.001, 0.123131])).toBeBetween(-0.001, 0.123131)
    }

    for (let i = 0; i < 10; ++i) {
        expect(unwrap([-1982.19023, 19.1982])).toBeBetween(-1982.19023, 19.1982)
    }

    for (let i = 0; i < 10; ++i) {
        expect(unwrap([19.1982, -9182])).toBeBetween(-9812, 19.1982)
    }

    expect(unwrap(1)).toBe(1)
    expect(unwrap(-18.192)).toBe(-18.192)

    for (let i = 0; i < 10; ++i) {
        expect(
            unwrap([
                [0, 10],
                [10, 20]
            ])
        ).toBeBetween(0, 20)
    }
})
