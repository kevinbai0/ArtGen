import fs from "fs"
import { DrawableFunction } from "../src/types"
import TestingDrawingEngine from "./TestingDrawingEngine"

import { linesGen, particlesGen11, circlesGen5 } from "../src/art"

const toTest = { linesGen, particlesGen11, circlesGen5 }

const args = process.argv.slice(2)

const dir = `./snapshots/${
    args.length > 0 && args[0] === "--save" ? "save/" : "/temp/"
}`

const SaveSnapShot = (fun: DrawableFunction, name: string) => {
    console.log("-------------------------------------")
    console.log(`Saving snapshot for ${name} to ${name}.txt`)
    const json = JSON.stringify(TestingDrawingEngine(fun))
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

const snapshots: [DrawableFunction, string][] = Object.keys(toTest).map(key => {
    return [toTest[key], key]
})

const saveSnapshots = (values: typeof snapshots) => {
    if (values.length === 0) {
        console.log("---------------------------------------")
        return
    }
    SaveSnapShot(values[0][0], values[0][1]).then(() => {
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
