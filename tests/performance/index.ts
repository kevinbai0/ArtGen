import TestingDrawingEngine from "../../snapshots/TestingDrawingEngine"
import { performance } from "perf_hooks"

import * as art from "../../src/art"
import { DrawableFunction } from "../../src/types"

function benchmark() {
    console.log("Starting test")
    console.log("-----------------------")
    const startTime = performance.now()
    const times = Object.keys(art)
        .map(key => ({ key, f: art[key] }))
        .map(({ key, f }: { key: string; f: DrawableFunction }) => {
            const time = performance.now()
            void TestingDrawingEngine(f)
            return {
                key,
                time: performance.now() - time
            }
        })

    times.forEach(({ key, time }) => {
        console.log(`${key}: ${time.toFixed(2)}ms`)
    })

    const timeElapsed = performance.now() - startTime
    console.log("-----------------------")
    console.log(`Total time: ${timeElapsed.toFixed(2)}ms`)
    console.log("Ending test")
}

benchmark()
