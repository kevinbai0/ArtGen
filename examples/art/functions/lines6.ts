import {
    Draw,
    Point,
    DecoratedLine,
    DrawableFunction
} from "../../../src/types"
import AnimatedLine from "../../../src/animated/AnimatedLine"
import { generate, GenLine } from "../../../src/utils"

const linesGen6: DrawableFunction = ({ unwrap, rgba }) => {
    const func = (theta: number, r: number): Point => {
        return {
            x: r * Math.cos(theta),
            y: r * Math.sin(theta)
        }
    }

    let options: number[] = []
    for (let i = 0; i < 400; ++i) {
        options.push(i * 2)
    }

    const generateLine = (z: number) => {
        const rand = Math.floor(unwrap([0, options.length]))
        let r = options[rand]
        options = options.filter((option, i) => i !== rand)
        const max = Math.max(50, r * 2)
        const start = Math.floor(unwrap([0, max]))
        const points = generate(max, i =>
            func(((start + i) / (max - 1)) * 2 * Math.PI, r)
        )
        let color = Math.min(255, Math.round(Math.sqrt((r * r) / 6)))
        const shade = unwrap([0, 150])
        return new AnimatedLine(
            GenLine(points, {
                stroke: rgba(shade, shade, shade, 1),
                zIndex: z,
                lineWidth: 3
            })
        )
    }
    let lines = new Map<number, AnimatedLine>()
    lines.set(0, generateLine(0))
    let count = lines.size

    let ended: DecoratedLine[] = []

    const draw: Draw = x => {
        if (x < 300) {
            lines.set(count, generateLine(count))
            count += 1
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
        iterate: x => x + 1,
        endIf: duration => duration >= 10000
    }
}

export default linesGen6
