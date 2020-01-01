import { Draw, DrawableFunction } from "../types"
import { withOpacity, generate, updateShapes, GenPoint } from "../utils"

const christmasGen: DrawableFunction = ({ unwrap, rgba }) => {
    const baseParticles = generate(500, i => {
        let randRed = unwrap([
            [255, 220],
            [0, 10]
        ])
        const randGreen = unwrap(randRed < 50 ? [150, 200] : [0, 10])
        return GenPoint(
            Math.cos((i / 500) * 2 * Math.PI) * i,
            Math.sin((i / 500) * 2 * Math.PI) * i,
            {
                stroke: rgba(randRed, randGreen, 0, 0),
                radius: 3,
                lineWidth: 1,
                stateIndex: i,
                zIndex: i
            }
        )
    })

    const initPositions = baseParticles.map(shape => ({
        x: shape.x,
        y: shape.y,
        direction: unwrap([0, 1]) < 0.5
    }))

    const draw: Draw = x => {
        const residual = baseParticles.map(shape => {
            return {
                ...shape,
                stateIndex: undefined,
                stroke: withOpacity(Math.max(0, 0.25 - x / 1200), shape.stroke)
            }
        })
        updateShapes(baseParticles, (shape, i) => {
            let r = x
            let th = ((initPositions[i].direction ? 1 : -1) * x) / 10
            return {
                x: unwrap(initPositions[i].x) + Math.cos(th) * r,
                y: unwrap(initPositions[i].y) + Math.sin(th) * r
            }
        })
        return baseParticles.concat(residual)
    }

    return {
        draw,
        iterate: x => x + 1,
        endIf: duration => duration >= 10000
    }
}

export default christmasGen
