import { Draw, DecoratedPoint, DrawableFunction } from "../types"
import { generate, updateShapes, GenPoint } from "../utils"

const particlesGen7: DrawableFunction = ({ unwrap, rgba }) => {
    const baseParticles = generate(100, i => {
        let th = (unwrap([0, 500]) / 500) * 2 * Math.PI
        return GenPoint(Math.cos(th), Math.sin(th), {
            fill: rgba([255, 200], 0, 0, 0),
            radius: 1,
            stateIndex: i
        })
    })

    const draw: Draw = (x: number) => {
        const seed = unwrap([10, 50])

        let residualParticles = baseParticles.reduce((accum, point) => {
            if (unwrap([0, 50]) < seed) return accum
            accum.push({
                ...point,
                fill: rgba([0, 50], [255, 150], [200, 150], unwrap([0.2, 0.7])),
                radius: unwrap([
                    Math.min(x / 200, 2),
                    Math.min(x / 200, 2) + 2
                ]),
                stateIndex: undefined
            })
            return accum
        }, new Array<DecoratedPoint>())

        const separation = unwrap([0, 1])
        const radial = unwrap([5, 20])
        updateShapes(baseParticles, (point, i) => {
            const baseAngle = (i / 500) * 2 * Math.PI
            let theta = baseAngle + x * 2 + separation
            return {
                x: Math.sin(theta) * (x / 1.2 + radial),
                y: Math.cos(theta) * (x / 1.2 + radial)
            }
        })

        return residualParticles
    }

    return {
        draw,
        iterate: x => x + 1.5,
        endIf: duration => duration >= 10000
    }
}

export default particlesGen7
