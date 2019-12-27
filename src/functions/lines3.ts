import { Lambda, Shape, generate, Point, updateShapes } from "../types"
import AnimatedLine from "../animations/AnimatedLine"

const linesGen3 = (): Lambda => {
    const generateLine = (index: number, n: number, inverted: boolean) => {
        const randStretch = index + 1
        const points: Point[] = generate(1024, i => {
            let x = i - 512
            return {
                x,
                y:
                    ((inverted ? -1 : 1) * 200) /
                    (((x / randStretch) * x) / randStretch + n)
            }
        })
        let line = Shape.line({
            points,
            stroke: "rgba(0,0,0,0.01)",
            lineWidth: Math.random() * 20 + 5
        })
        return line
    }

    let animatedLines = new Map<number, AnimatedLine>()
    animatedLines.set(
        0,
        new AnimatedLine(
            generateLine(0, Math.random() * 10, Math.random() < 0.5)
        )
    )

    let count = 1
    const lambda: Lambda = (x: number) => {
        animatedLines.forEach((line, key) => {
            if (line.ended) {
                animatedLines.delete(key)
                return
            }
        })
        if (x < 500) {
            let anim = new AnimatedLine(
                generateLine(
                    count,
                    Math.random() * 1 + 0.2,
                    Math.random() < 0.5
                )
            )
            animatedLines.set(count, anim)
            count += 1
        }

        return {
            shapes: Array.from(animatedLines.entries()).map(l =>
                l[1].update(0.01)
            ),
            dx: 1
        }
    }

    return lambda
}

export default linesGen3
