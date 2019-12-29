import fs from "fs"
import { DrawableFunction } from "../src/types"
import TestingDrawingEngine from "./TestingDrawingEngine"

import * as art from "../src/art"

const args = process.argv.slice(2)

const dir = `./dist/${
    args.length > 0 && args[0] === "--save" ? "test-" : ""
}snapshots`

const SaveSnapShot = (fun: DrawableFunction, name: string) => {
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

const snapshots: [DrawableFunction, string][] = Object.keys(art).map(key => {
    return [art[key], key]
})

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
