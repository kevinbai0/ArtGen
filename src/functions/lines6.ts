import {
    Lambda,
    Point,
    Shape,
    generate,
    rgba,
    unwrap,
    DecoratedLine,
    updateShapes
} from "../types"
import AnimatedLine from "../animations/AnimatedLine"

const linesGen6 = (): Lambda => {
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
        const start = Math.floor(Math.random() * max)
        const points = generate(max, i =>
            func(((start + i) / (max - 1)) * 2 * Math.PI, r)
        )
        let color = Math.min(255, Math.round(Math.sqrt((r * r) / 6)))
        const shade = unwrap([0, 150])
        return new AnimatedLine(
            Shape.line({
                points,
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

    const lambda: Lambda = (x: number) => {
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

        return {
            shapes: Array.from(lines.entries()).map(val => val[1].update(0.01)),
            dx: 1
        }
    }

    return lambda
}

export default linesGen6
