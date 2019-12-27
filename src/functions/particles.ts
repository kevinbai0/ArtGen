import {
    Lambda,
    DecoratedPoint,
    Shape,
    Point,
    updateShapes,
    generate,
    unwrap
} from "../types"

const particlesGen = (): Lambda => {
    const len = 800
    const radius = 400
    let particles: DecoratedPoint[] = generate(len, i => {
        const theta = (i / len) * Math.PI
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

    const lambda: Lambda = (x: number) => {
        updateShapes(particles, (point, i) => ({
            x: unwrap(point.x) + (Math.random() * 2 - 1) * Math.max(3, x / 100),
            y: unwrap(point.y) + (Math.random() * 2 - 1) * Math.max(3, x / 100),
            fill: `rgba(120,120,120,${Math.min(
                1,
                0.2 / (Math.pow(x, 1 / 3) + 1)
            )})`
        }))
        updateShapes(particles2, (point, i) => ({
            x: unwrap(point.x) + (Math.random() * 2 - 1) * Math.max(4, x / 200),
            y: unwrap(point.y) + (Math.random() * 2 - 1) * Math.max(4, x / 200),
            fill: `rgba(120,120,120,${Math.min(
                1,
                0.2 / (Math.pow(x, 1 / 3) + 1)
            )})`
        }))

        return {
            shapes: particles.concat(particles2),
            dx: 1
        }
    }
    return lambda
}

export default particlesGen
