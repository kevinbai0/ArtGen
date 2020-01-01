import { Draw, Point, DecoratedLine, DrawableFunction } from "../types"
import AnimatedLine from "../animated/AnimatedLine"
import { generate, GenLine } from "../utils"

const linesGen7: DrawableFunction = ({ unwrap, rgba }) => {
    const eq1 = (theta: number, r: number): Point => {
        return {
            x: r * Math.cos(theta * 0.2),
            y: r * Math.sin(theta * Math.sqrt(unwrap([1.975, 1.976])))
        }
    }

    const generateLine = (
        z: number,
        func: (theta: number, r: number) => Point
    ) => {
        const r = Math.floor(unwrap([400, 500]))
        const max = Math.max(50, r * 4)
        const start = Math.floor(unwrap([0, max]))
        const points = generate(max, i =>
            func(((start + i) / (max - 1)) * 20 * Math.PI, r)
        )
        const shade = unwrap([0, 0])
        return new AnimatedLine(
            GenLine(points, {
                stroke: rgba(shade, shade, shade, 0.1),
                zIndex: z,
                lineWidth: 1
            })
        )
    }
    const lines = new Map<number, AnimatedLine>()
    lines.set(0, generateLine(0, eq1))
    let count = lines.size

    const ended: DecoratedLine[] = []

    const draw: Draw = x => {
        if (x < 300) {
            lines.set(count, generateLine(count, unwrap([0, 1]) ? eq1 : eq1))
            count += 2
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
        iterate: (x, timeLapsed) => (timeLapsed / 10000) * 600,
        endIf: duration => duration >= 10000
    }
}

export default linesGen7
