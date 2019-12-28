import fs from "fs"
import { DrawableFunction } from "../src/types"
import TestingDrawingEngine from "./TestingDrawingEngine"
import { unwrap } from "../src/utils"

import linesGen from "../src/art/functions/lines"
import linesGen2 from "../src/art/functions/lines2"
import linesGen3 from "../src/art/functions/lines3"
import linesGen4 from "../src/art/functions/lines4"
import linesGen5 from "../src/art/functions/lines5"
import linesGen6 from "../src/art/functions/lines6"
import linesGen7 from "../src/art/functions/lines7"
import linesGen8 from "../src/art/functions/lines8"
import linesGen9 from "../src/art/functions/lines9"
import circlesGen, { CirclesConfig } from "../src/art/functions/circles"
import circlesGen2 from "../src/art/functions/circles2"
import circlesGen3 from "../src/art/functions/circles3"
import circlesGen4 from "../src/art/functions/circles4"
import circlesGen5 from "../src/art/functions/circles5"
import christmasGen from "../src/art/functions/christmas"
import christmasGen2 from "../src/art/functions/christmas2"
import particlesGen from "../src/art/functions/particles"
import particlesGen2 from "../src/art/functions/particles2"
import particlesGen3 from "../src/art/functions/particles3"
import particlesGen4 from "../src/art/functions/particles4"
import particlesGen5 from "../src/art/functions/particles5"
import particlesGen6 from "../src/art/functions/particles6"
import particlesGen7 from "../src/art/functions/particles7"
import particlesGen8 from "../src/art/functions/particles8"

const args = process.argv.slice(2)

const dir = `./dist/${
    args.length > 0 && args[0] === "--save" ? "test-" : ""
}snapshots`

const SaveSnapShot = (
    fun: (unwrapper: typeof unwrap) => DrawableFunction,
    name: string
) => {
    console.log("-------------------------------------")
    console.log(`Saving snapshot for ${name} to ${name}.txt`)
    let json = JSON.stringify(TestingDrawingEngine(fun))
    return new Promise((resolve, reject) => {
        fs.writeFile(`${dir}/${name}.txt`, json, err => {
            if (err) {
                reject()
                console.log(`Couldn't save file ${name}.txt`)
                return
            }

            console.log(`Saved ${name} to ${name}.txt`)
            resolve()
        })
    })
}

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

const snapshots: [typeof linesGen, string][] = [
    [linesGen, "lines"],
    [linesGen2, "lines2"],
    [linesGen3, "lines3"],
    [linesGen4, "lines4"],
    [linesGen5, "lines5"],
    [linesGen6, "lines6"],
    [linesGen7, "lines7"],
    [linesGen8, "lines8"],
    [linesGen9, "lines9"],
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
    [particlesGen8, "particles8"]
]

const saveSnapshots = (values: typeof snapshots) => {
    if (values.length === 0) {
        console.log("---------------------------------------")
        return
    }
    SaveSnapShot(values[0][0], values[0][1]).then(success => {
        saveSnapshots(values.slice(1))
    })
}

new Promise((resolve, reject) =>
    fs.exists(dir, exists => {
        if (!exists)
            return new Promise(() =>
                fs.mkdir(dir, err => {
                    if (err) reject()
                    resolve()
                })
            )
        return resolve()
    })
)
    .then(() => {
        saveSnapshots(snapshots)
    })
    .catch(err => console.error("Something went wrong", err))
