import {
    Draw,
    Point,
    DecoratedLine,
    DrawableFunction
} from "../../../src/types"
import AnimatedLine from "../../../src/animated/AnimatedLine"
import { generate, GenPoint, GenLine } from "../../../src/utils"

const linesGen8: DrawableFunction = ({ unwrap, rgba }) => {
    const eq1 = (theta: number, r: number): Point => {
        return {
            x: r * Math.cos(theta * unwrap([0.19, 0.21])),
            y: r * Math.sin(theta * Math.sqrt(unwrap([1.9, 2.0])))
        }
    }

    const eq2 = (theta: number, r: number): Point => {
        return {
            x: r * Math.cos(Math.sqrt(2) * theta),
            y: r * Math.sin(theta)
        }
    }

    const generateLine = (
        z: number,
        func: (theta: number, r: number) => Point
    ) => {
        const r = Math.floor(unwrap([200, 500]))
        const max = Math.max(50, r * 4)
        const start = Math.floor(unwrap([0, max]))
        const points = generate(max, i =>
            func(((start + i) / (max - 1)) * 20 * Math.PI, r)
        )
        return new AnimatedLine(
            GenLine(points, {
                stroke: rgba(
                    [0, 50],
                    unwrap([0, 100]),
                    unwrap([50, 150]),
                    unwrap([0.008, 0.012])
                ),
                zIndex: z,
                lineWidth: 1
            })
        )
    }
    let lines = new Map<number, AnimatedLine>()
    lines.set(0, generateLine(0, eq1))
    let counter = lines.size

    let ended: DecoratedLine[] = []

    const draw: Draw = (x: number, count: number) => {
        if (count % 2 === 0) {
            lines.set(
                counter,
                generateLine(counter, unwrap([0, 1]) < 0.5 ? eq1 : eq1)
            )
            counter += 1
        }

        lines.forEach((line, key) => {
            if (line.ended) {
                lines.delete(key)
                const finished = line.shape
                finished.stateIndex = key
                ended.push(finished)
                return
            }
        })

        return Array.from(lines.entries()).map(val => val[1].update(0.01))
    }

    return {
        draw,
        iterate: (x, timeLapsed) => 600 * (timeLapsed / 10000),
        endIf: duration => duration >= 10000
    }
}

export default linesGen8
