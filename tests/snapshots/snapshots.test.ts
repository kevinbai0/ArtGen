import linesGen from "../../src/art/functions/lines"
import linesGen2 from "../../src/art/functions/lines2"
import linesGen3 from "../../src/art/functions/lines3"
import linesGen4 from "../../src/art/functions/lines4"
import linesGen5 from "../../src/art/functions/lines5"
import linesGen6 from "../../src/art/functions/lines6"
import linesGen7 from "../../src/art/functions/lines7"
import linesGen8 from "../../src/art/functions/lines8"
import circlesGen, { CirclesConfig } from "../../src/art/functions/circles"
import circlesGen2 from "../../src/art/functions/circles2"
import circlesGen3 from "../../src/art/functions/circles3"
import circlesGen4 from "../../src/art/functions/circles4"
import circlesGen5 from "../../src/art/functions/circles5"
import christmasGen from "../../src/art/functions/christmas"
import christmasGen2 from "../../src/art/functions/christmas2"
import particlesGen from "../../src/art/functions/particles"
import particlesGen2 from "../../src/art/functions/particles2"
import particlesGen3 from "../../src/art/functions/particles3"
import particlesGen4 from "../../src/art/functions/particles4"
import particlesGen5 from "../../src/art/functions/particles5"
import particlesGen6 from "../../src/art/functions/particles6"
import particlesGen7 from "../../src/art/functions/particles7"
import particlesGen8 from "../../src/art/functions/particles8"

import fs from "fs"
import particlesGen9 from "../../src/art/functions/particles9"

const circlesGenConfig: CirclesConfig = {
    colorRange: {
        r: [
            [0, 100],
            [200, 255]
        ],
        g: [100, 255],
        b: [
            [0, 0],
            [100, 150]
        ],
        a: [0.5, 0.8]
    },
    radius: [
        [2, 5],
        [2, 5],
        [3, 7],
        [8, 20]
    ]
}

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

const snapshots: [typeof linesGen, string][] = [
    [linesGen, "lines"],
    [linesGen2, "lines2"],
    [linesGen3, "lines3"],
    [linesGen4, "lines4"],
    [linesGen5, "lines5"],
    [linesGen6, "lines6"],
    [linesGen7, "lines7"],
    [linesGen8, "lines8"],
    [circlesGen(circlesGenConfig), "circles"],
    [circlesGen2, "circles2"],
    [circlesGen3, "circles3"],
    [circlesGen4, "circles4"],
    [circlesGen5, "circles5"],
    [christmasGen, "circles3"],
    [christmasGen2, "circles3"],
    [particlesGen, "particles"],
    [particlesGen2, "particles2"],
    [particlesGen3, "particles3"],
    [particlesGen4, "particles4"],
    [particlesGen5, "particles5"],
    [particlesGen6, "particles6"],
    [particlesGen7, "particles7"],
    [particlesGen8, "particles8"],
    [particlesGen9, "particles9"]
]

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
