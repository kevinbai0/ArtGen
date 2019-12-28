import { Lambda, DecoratedPoint, Shape, DrawableFunction } from "../../types"
import { unwrap as productionUnwrap, generate, updateShapes } from "../../utils"

const particlesGen = (unwrap = productionUnwrap): DrawableFunction => {
    const len = 800
    const radius = 400
    let particles: DecoratedPoint[] = generate(len, i => {
        const theta = (i / len) * Math.PI
        if (i == 0)
            return Shape.point({
                x: radius,
                y: 0,
                fill: `rgba(120,120,120,${Math.min(
                    1,
                    0.2 / (Math.pow(0, 1 / 3) + 1)
                )})`,
                radius: 2
            })
        return Shape.point({
            x: radius * Math.cos(theta),
            y: (i % 2 === 0 ? -1 : 1) * radius * Math.sin(theta),
            fill: `rgba(120,120,120,${Math.min(
                1,
                0.2 / (Math.pow(0, 1 / 3) + 1)
            )})`,
            radius: 2
        })
    })

    const len2 = 500
    const radius2 = 150
    let particles2 = generate(len2, i => {
        const theta = (i / len2) * Math.PI
        if (i == 0)
            return Shape.point({
                x: radius2,
                y: 0,
                fill: `rgba(120,120,120,${Math.min(
                    1,
                    0.2 / (Math.pow(0, 1 / 3) + 1)
                )})`,
                radius: 2
            })
        return Shape.point({
            x: radius2 * Math.cos(theta),
            y: (i % 2 === 0 ? -1 : 1) * radius2 * Math.sin(theta),
            fill: `rgba(120,120,120,${Math.min(
                1,
                0.2 / (Math.pow(0, 1 / 3) + 1)
            )})`,
            radius: 2
        })
    })

    const lambda: Lambda = (x, count) => {
        updateShapes(particles, point => ({
            x: unwrap(point.x) + unwrap([-1, 1]) * Math.max(3, count / 100),
            y: unwrap(point.y) + unwrap([-1, 1]) * Math.max(3, count / 100),
            fill: `rgba(120,120,120,${Math.min(
                1,
                0.2 / (Math.pow(x, 1 / 3) + 1)
            )})`
        }))
        updateShapes(particles2, point => ({
            x: unwrap(point.x) + unwrap([-1, 1]) * Math.max(4, count / 200),
            y: unwrap(point.y) + unwrap([-1, 1]) * Math.max(4, count / 200),
            fill: `rgba(120,120,120,${Math.min(
                1,
                0.2 / (Math.pow(count, 1 / 3) + 1)
            )})`
        }))

        return particles.concat(particles2)
    }
    return {
        lambda,
        iterate: x => x + 1,
        endIf: duration => duration >= 10000
    }
}

export default particlesGen
