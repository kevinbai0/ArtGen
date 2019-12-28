import {
    DrawableFunction,
    Value,
    Range,
    DecoratedShape,
    Color
} from "../src/types"
import { unwrap, rgba } from "../src/utils"

/**
 * instead of a random number between two values, it returns the midpoint of 2 numbers
 * @param value
 */
let customUnwrap = (value: Value): number => {
    if (typeof value === "number") return value
    if (typeof value[0] !== "number") {
        const newRange = value as Array<Range<number>>
        let rI = Math.floor(0.5 * value.length)
        return 0.5 * (newRange[rI][1] - newRange[rI][0]) + newRange[rI][0]
    }
    const newRange = value as Range<number>
    return 0.5 * (newRange[1] - newRange[0]) + newRange[0]
}

const customRgba = (r: Value, g: Value, b: Value, a: Value): Color => {
    return {
        r: customUnwrap(r),
        g: customUnwrap(g),
        b: customUnwrap(b),
        a: customUnwrap(a)
    }
}

const TestingDrawingEngine = (
    testingFunction: (
        unwrapper: typeof unwrap,
        rgbaUnwrapper: typeof rgba
    ) => DrawableFunction
) => {
    let count = 0
    let x = 0
    let duration = 0

    const fun = testingFunction(customUnwrap, customRgba)

    let shapes: DecoratedShape[][] = []

    while (!fun.endIf(duration, x)) {
        let output = fun.lambda(x, count)
        shapes = shapes.concat(output)
        count += 1
        x = fun.iterate(x, duration)
        duration += 100
    }

    return shapes
}

export default TestingDrawingEngine
