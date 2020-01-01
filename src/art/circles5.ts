import { Draw, Value, DrawableFunction } from "../types"
import AnimatedCircle from "../animated/AnimatedCircle"
import { GenArc } from "../utils"

const circlesGen5: DrawableFunction = ({ unwrap }) => {
    const randomArc = (config: {
        x: Value
        y: Value
        radius: Value
        fill: string
        key?: number
    }) => {
        return GenArc(config.x, config.y, config.radius, {
            start: 0,
            end: 0,
            fill: config.fill,
            zIndex: config.key
        })
    }

    const minRadius = 300
    const maxRadius = 350
    const maxEdge = 400
    const circles = new Map<number, AnimatedCircle>()
    // top left
    const calc = (key: number) => ({
        radius: unwrap([minRadius, maxRadius]),
        fill: `rgba(${unwrap([150, 200])}, 
                ${unwrap([50, 100])}, 
                ${unwrap([50, 200])}, ${0.5})`,
        key
    })

    circles.set(
        0,
        new AnimatedCircle(
            randomArc({
                x: [-maxEdge + 100, -maxEdge],
                y: [maxEdge - 100, maxEdge],
                ...calc(0)
            }),
            unwrap([0, 2 * Math.PI]),
            unwrap([0, 20])
        )
    )
    // middle
    circles.set(
        1,
        new AnimatedCircle(
            randomArc({
                x: [-50, -50],
                y: [1, 0],
                ...calc(0)
            }),
            unwrap([0, 2 * Math.PI]),
            unwrap([0, 20])
        )
    )
    // bottom left
    circles.set(
        2,
        new AnimatedCircle(
            randomArc({
                x: [-maxEdge + 100, -maxEdge],
                y: [-maxEdge, -maxEdge + 50],
                ...calc(2)
            }),
            unwrap([0, 2 * Math.PI]),
            unwrap([0, 20])
        )
    )
    // bottom right
    circles.set(
        3,
        new AnimatedCircle(
            randomArc({
                x: [maxEdge - 50, maxEdge],
                y: [-maxEdge, -maxEdge + 50],
                ...calc(3)
            }),
            unwrap([0, 2 * Math.PI]),
            unwrap([0, 20])
        )
    )
    // top right
    circles.set(
        4,
        new AnimatedCircle(
            randomArc({
                x: [maxEdge - 100, maxEdge],
                y: [maxEdge - 100, maxEdge],
                ...calc(4)
            }),
            unwrap([0, 2 * Math.PI]),
            unwrap([0, 20])
        )
    )
    //middle top
    circles.set(
        5,
        new AnimatedCircle(
            randomArc({
                x: [-50, 50],
                y: [maxEdge - 100, maxEdge],
                ...calc(4)
            }),
            unwrap([0, 2 * Math.PI]),
            unwrap([0, 20])
        )
    )
    circles.set(
        6,
        new AnimatedCircle(
            randomArc({
                x: [-50, 50],
                y: [-maxEdge + 100, -maxEdge],
                ...calc(4)
            }),
            unwrap([0, 2 * Math.PI]),
            unwrap([0, 20])
        )
    )
    circles.set(
        7,
        new AnimatedCircle(
            randomArc({
                x: [-maxEdge, -maxEdge + 50],
                y: [-50, -50],
                ...calc(4)
            }),
            unwrap([0, 2 * Math.PI]),
            unwrap([0, 20])
        )
    )
    circles.set(
        8,
        new AnimatedCircle(
            randomArc({
                x: [maxEdge, maxEdge - 50],
                y: [-50, -50],
                radius: [minRadius, maxRadius],
                fill: `rgba(${unwrap([150, 200])}, 
                        ${unwrap([50, 100])}, 
                        ${unwrap([50, 200])}, ${0.5})`,
                ...calc(4)
            }),
            unwrap([0, 2 * Math.PI]),
            unwrap([0, 20])
        )
    )

    let circlesCount = circles.size

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
                    randomArc({
                        x: [
                            unwrap(circle.x) - dr / 2,
                            unwrap(circle.x) + dr / 2
                        ],
                        y: [
                            unwrap(circle.y) - dr / 2,
                            unwrap(circle.y) + dr / 2
                        ],
                        radius,
                        fill: `rgba(${unwrap([150, 200])}, ${unwrap([
                            50,
                            100
                        ])}, ${unwrap([50, 200])}, ${0.5})`,
                        key: circlesCount
                    }),
                    unwrap([0, 2 * Math.PI]),
                    unwrap([0, 10])
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

export default circlesGen5
