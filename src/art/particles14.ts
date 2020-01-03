import { GenPoint, generate } from "../utils"
import { DrawableFunction, Draw } from "../types"

const particlesGen14: DrawableFunction = ({ unwrap, rgba }) => {
    const seed = 3.9559408429359513 //unwrap([3,5])
    console.log(seed)
    const points = generate(1500, i => {
        return GenPoint([-100, 100], [-100, 100], {
            radius: 1,
            zIndex: i
        })
    })

    let otherX = 0,
        otherY = 0

    const draw: Draw = value => {
        const drawPoints = points.map((point, i) => {
            const x = unwrap(point.x)
            const y = unwrap(point.y)
            return point
                .mutate({
                    x: Math.sin(x * y * seed) + Math.cos(y) * seed,
                    y:
                        y +
                        1.01 +
                        Math.sin(x * y) * seed +
                        Math.cos(Math.sin(x * y))
                })
                .clone({
                    x: x * 150,
                    y: y - 512,
                    fill: rgba(i / 4, value / 4, (x + 10) * 10, 0.1)
                })
        })

        for (let i = 0; i < 400; ++i) {
            const x = otherX
            const y = otherY
            otherX = Math.sin(x * y * seed) + Math.cos(y * Math.sqrt(2))
            otherY = Math.sin(x * y) * seed + Math.cos(3 * Math.sin(x * y))
            drawPoints.push(
                GenPoint(otherX * 150, otherY * 150, {
                    fill: rgba(i / 4, value / 4, (x + 10) * 10, 0.1),
                    radius: 1
                })
            )
        }
        return drawPoints
    }

    return {
        draw,
        iterate: x => x + 1,
        endIf: duration => duration >= 10000
    }
}

export default particlesGen14
