import * as art from "../../src/art"

import fs from "fs"
import { DrawableFunction } from "../../src/types"

declare global {
    namespace jest {
        interface Matchers<R, T> {
            toBeAbbr(a: string, abbr: string): R
        }
    }
}

expect.extend({
    toBeAbbr(received: string, expect: string, abbr: string) {
        const pass = received === expect
        if (pass) {
            return {
                message: () => "Pass",
                pass: true
            }
        } else {
            return {
                message: () => `Expected ${abbr} to match`,
                pass: false
            }
        }
    }
})

const snapshots: [DrawableFunction, string][] = Object.keys(art).map(key => [
    art[key],
    key
])

function runExpect(pair: typeof snapshots[0], done: jest.DoneCallback) {
    const promise1 = new Promise<string>((res, rej) =>
        fs.readFile(
            `./dist/test-snapshots/${pair[1]}.txt`,
            "utf8",
            (err, data) => (err ? rej(err) : res(data))
        )
    )
    const promise2 = new Promise<string>((res, rej) =>
        fs.readFile(`./dist/snapshots/${pair[1]}.txt`, "utf8", (err, data) =>
            err ? rej(err) : res(data)
        )
    )
    Promise.all([promise1, promise2])
        .then(values => {
            expect(values[0]).toBeAbbr(values[1], pair[1])
        })
        .then(_ => done())
}

snapshots.forEach(snapshot =>
    test(`Testing snapshot ${snapshot[1]}`, done => {
        runExpect(snapshot, done)
    })
)
