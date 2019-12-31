import { Lambda, Shape, Point, DrawableFunction } from "../../types"
import AnimatedLine from "../../animations/AnimatedLine"
import { generate } from "../../utils"

const linesGen3: DrawableFunction = ({ unwrap }) => {
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
            lineWidth: unwrap([5, 25])
        })
        return line
    }

    let animatedLines = new Map<number, AnimatedLine>()
    animatedLines.set(
        0,
        new AnimatedLine(generateLine(0, unwrap([0, 10]), unwrap([0, 1]) < 0.5))
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
                generateLine(count, unwrap([0.2, 1.2]), unwrap([0, 1]) < 0.5)
            )
            animatedLines.set(count, anim)
            count += 1
        }

        return Array.from(animatedLines.entries()).map(l => l[1].update(0.01))
    }

    return {
        lambda,
        iterate: x => x + 1,
        endIf: duration => duration >= 10000
    }
}

export default linesGen3
