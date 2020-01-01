import { Draw, DrawableFunction } from "../types"
import { generate, updateShapes, GenPoint } from "../utils"

const particlesGen6: DrawableFunction = ({ rgba }) => {
    const baseParticles = generate(500, i => {
        const th = (i / 500) * 2 * Math.PI
        return GenPoint(Math.cos(th) * 100, Math.sin(th) * 100, {
            fill: rgba([255, 200], 0, 0, 1),
            radius: 1,
            stateIndex: i
        })
    })

    const draw: Draw = x => {
        const residualParticles = baseParticles.map(point => ({
            ...point,
            fill: rgba([200, 150], [100, 0], 0, Math.min(x / 600, 0.5)),
            radius: 2,
            stateIndex: undefined
        }))
        updateShapes(baseParticles, (point, i) => {
            const baseAngle = (i / 500) * 2 * Math.PI
            const theta = baseAngle

            return {
                x: Math.sin(theta) * x,
                y: Math.cos(theta) * x,
                fill: `rgba(0, 0, 0, ${Math.max(0.5 - i / 600, 0.01)})`,
                radius: Math.max(1, x / 30)
            }
        })

        return baseParticles.concat(residualParticles)
    }

    return {
        draw,
        iterate: x => x + 1.5,
        endIf: duration => duration >= 10000
    }
}

export default particlesGen6
