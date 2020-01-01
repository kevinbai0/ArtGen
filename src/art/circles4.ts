import { Draw, DrawableFunction } from "../types"
import AnimatedCircle from "../animated/AnimatedCircle"
import { GenArc } from "../utils"

const circlesGen4: DrawableFunction = ({ unwrap }) => {
    const randomArc = (x: number, y: number, radius: number, key?: number) => {
        const color = `rgba(${unwrap([50, 200])}, 0, 0, 1)`
        return GenArc(x, y, radius, {
            start: 0,
            end: 0,
            fill: color,
            zIndex: key
        })
    }

    let circlesCount = 1
    const circles = new Map<number, AnimatedCircle>()
    circles.set(
        0,
        new AnimatedCircle(randomArc(0, 0, 800), unwrap([0, 2 * Math.PI]))
    )

    const draw: Draw = () => {
        circles.forEach((circle, key) => {
            if (!circle.ended) return
            circles.delete(key)

            const radius =
                unwrap(circle.r) *
                (unwrap([0, 0.1]) + (circle.r > 50 ? 0.8 : 0.65))
            const dr = unwrap(circle.r) - radius
            circles.set(
                circlesCount,
                new AnimatedCircle(
                    randomArc(
                        unwrap(circle.x) + unwrap([-dr / 2, dr / 2]),
                        unwrap(circle.y) + unwrap([-dr / 2, dr / 2]),
                        radius,
                        circlesCount
                    ),
                    unwrap([0, 2 * Math.PI]),
                    unwrap([0, 20])
                )
            )
            circlesCount += 1
        })

        return Array.from(circles.entries()).map(circle => circle[1].line(0.05))
    }

    return {
        draw,
        iterate: x => x + 1,
        endIf: duration => duration >= 10000
    }
}

export default circlesGen4
