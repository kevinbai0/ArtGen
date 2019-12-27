import { Lambda, Shape } from "../types"
import AnimatedCircle from "../animations/AnimatedCircle"
import { unwrap } from "../utils"

const circlesGen4 = () => {
    const randomArc = (x: number, y: number, radius: number, key?: number) => {
        const color = `rgba(${unwrap([50, 200])}, 0, 0, 1)`
        return Shape.arc({
            x,
            y,
            radius,
            start: 0,
            end: 0,
            fill: color,
            zIndex: key
        })
    }

    let circlesCount = 1
    let circles = new Map<number, AnimatedCircle>()
    circles.set(0, new AnimatedCircle(randomArc(0, 0, 800)))

    const lambda: Lambda = (x: number) => {
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
                    unwrap([0, 20])
                )
            )
            circlesCount += 1
        })

        return {
            shapes: Array.from(circles.entries()).map(circle =>
                circle[1].line(0.05)
            ),
            dx: 1
        }
    }

    return lambda
}

export default circlesGen4
