import { Lambda, Shape, unwrap } from "../types"
import AnimatedCircle from "../animations/AnimatedCircle"

const circlesGen4 = () => {
    const randomArc = (x: number, y: number, radius: number, key?: number) => {
        const color = `rgba(${Math.random() * 150 + 50}, 0, 0, 1)`
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
                (Math.random() * 0.1 + (circle.r > 50 ? 0.8 : 0.65))
            const dr = unwrap(circle.r) - radius
            circles.set(
                circlesCount,
                new AnimatedCircle(
                    randomArc(
                        unwrap(circle.x) + Math.random() * dr - dr / 2,
                        unwrap(circle.y) + Math.random() * dr - dr / 2,
                        radius,
                        circlesCount
                    ),
                    Math.random() * 20
                )
            )
            circlesCount += 1

            /*for (let i = 0; i < 6; ++i) {
                let radius = circle.r / (Math.random() * 1.5 + 2.9)
                let th = i / 6 * Math.PI * 2;

                circles.set(circlesCount, 
                    new AnimatingCircle(
                        Shape.arc(
                            randomArc(
                                circle.x + Math.cos(th) * (circle.r - radius),
                                circle.y + Math.sin(th) * (circle.r - radius),
                                radius,
                                circlesCount
                            )
                        ), 
                        Math.random() * 20
                    )
                );
                circlesCount += 1;
            }
            circles.set(circlesCount, 
                new AnimatingCircle(
                    Shape.arc(
                        randomArc(
                            circle.x,
                            circle.y,
                            circle.r / (Math.random() * 1.5 + 2.9),
                            circlesCount
                        )
                    ), 
                    Math.random() * 20
                )
            );
            circlesCount += 1;*/
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
