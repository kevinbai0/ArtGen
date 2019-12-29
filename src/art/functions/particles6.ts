import { Lambda, Shape, DrawableFunction, Injectables } from "../../types"
import {
    unwrap as productionWrap,
    rgba as productionRGBA,
    generate,
    updateShapes
} from "../../utils"

const particlesGen6: DrawableFunction = (
    { unwrap, rgba }: Injectables = {
        unwrap: productionWrap,
        rgba: productionRGBA
    }
) => {
    const baseParticles = generate(500, i => {
        let th = (i / 500) * 2 * Math.PI
        return Shape.point({
            x: Math.cos(th) * 100,
            y: Math.sin(th) * 100,
            fill: rgba([255, 200], 0, 0, 1),
            radius: 1,
            stateIndex: i
        })
    })

    const lambda: Lambda = x => {
        let residualParticles = baseParticles.map(point => ({
            ...point,
            fill: rgba([200, 150], [100, 0], 0, Math.min(x / 600, 0.5)),
            radius: 2,
            stateIndex: undefined
        }))
        updateShapes(baseParticles, (point, i) => {
            const baseAngle = (i / 500) * 2 * Math.PI
            let theta = baseAngle
            let dX = unwrap([0, x / 30]) * Math.cos(theta + unwrap([-0.1, 0.1]))
            let dY = unwrap([0, x / 30]) * Math.sin(theta + unwrap([-0.1, 0.1]))
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
        lambda,
        iterate: x => x + 1.5,
        endIf: duration => duration >= 10000
    }
}

export default particlesGen6