import { Draw, DecoratedPoint, DrawableFunction } from "../../../src/types"
import { generate, updateShapes, GenPoint } from "../../../src/utils"

const particlesGen: DrawableFunction = ({ unwrap }) => {
    const len = 800
    const radius = 400
    let particles: DecoratedPoint[] = generate(len, i => {
        const theta = (i / len) * Math.PI
        if (i == 0)
            return GenPoint(radius, 0, {
                y: 0,
                fill: `rgba(120,120,120,${Math.min(
                    1,
                    0.2 / (Math.pow(0, 1 / 3) + 1)
                )})`,
                radius: 2
            })
        return GenPoint(
            radius * Math.cos(theta),
            (i % 2 === 0 ? -1 : 1) * radius * Math.sin(theta),
            {
                fill: `rgba(120,120,120,${Math.min(
                    1,
                    0.2 / (Math.pow(0, 1 / 3) + 1)
                )})`,
                radius: 2
            }
        )
    })

    const len2 = 500
    const radius2 = 150
    let particles2 = generate(len2, i => {
        const theta = (i / len2) * Math.PI
        if (i == 0)
            return GenPoint(radius2, 0, {
                fill: `rgba(120,120,120,${Math.min(
                    1,
                    0.2 / (Math.pow(0, 1 / 3) + 1)
                )})`,
                radius: 2
            })
        return GenPoint(
            radius2 * Math.cos(theta),
            (i % 2 === 0 ? -1 : 1) * radius2 * Math.sin(theta),
            {
                fill: `rgba(120,120,120,${Math.min(
                    1,
                    0.2 / (Math.pow(0, 1 / 3) + 1)
                )})`,
                radius: 2
            }
        )
    })

    const draw: Draw = (x, count) => {
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
        draw,
        iterate: x => x + 1,
        endIf: duration => duration >= 10000
    }
}

export default particlesGen
