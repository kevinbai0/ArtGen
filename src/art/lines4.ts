import { Draw, Point, DrawableFunction } from "../types"
import AnimatedLine from "../animated/AnimatedLine"
import { generate, GenLine } from "../utils"

const linesGen4: DrawableFunction = ({ unwrap, rgba }) => {
    const func = (theta: number, r: number): Point => {
        return {
            x: -250 + r * (0.5 + Math.cos(theta * Math.sqrt(2))),
            y: r * Math.sin(theta)
        }
    }

    const generateLine = (z: number) => {
        const r = Math.floor(unwrap([5, 500]))
        const points = generate(Math.max(100, r * 2), i =>
            func((i / (r - 1)) * Math.PI, r)
        )
        return new AnimatedLine(
            GenLine(points, {
                stroke: rgba([50, 150], [200, 255], [200, 255], 1),
                zIndex: z,
                lineWidth: 5
            })
        )
    }
    const lines = new Map<number, AnimatedLine>()
    lines.set(0, generateLine(0))
    let count = lines.size

    const draw: Draw = (x: number) => {
        if (x % 2 === 0) {
            lines.set(count, generateLine(count))
            count += 1
        }

        lines.forEach((line, key) => {
            if (line.ended) {
                lines.delete(key)
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

export default linesGen4
