import { Lambda, Shape, DecoratedPoint, DrawableFunction } from "../../types"
import { unwrap as productionUnwrap, rgba as productionRGBA } from "../../utils"

const particlesGen9 = (
    unwrap = productionUnwrap,
    rgba = productionRGBA
): DrawableFunction => {
    /**
     * Set up, initialize
     */
    let point = Shape.point({
        x: 1,
        y: 1,
        fill: rgba(20, 0, unwrap([50, 255]), 0.1),
        radius: 2
    })
    const a = 0.912
    const b = 0.7724381

    /**
     * Create Lambda (takes in number, outputs shapes)
     */

    const lambda: Lambda = (_: number) => {
        let newPoints: DecoratedPoint[] = []

        for (let i = 0; i < 800; ++i) {
            const x = unwrap(point.x)
            const y = unwrap(point.y)
            point.x = Math.sin((x * y) / b) * y + Math.cos(a * x - y)
            point.y = x + Math.sin(y * Math.sqrt(2)) / b / 2
            point.fill = rgba(120, Math.max(200 - x, 0), unwrap([50, 200]), 0.1)
            point.zIndex = i

            newPoints.push({
                ...point,
                x: unwrap(point.x) * 250,
                y: unwrap(point.y) * 250
            })
        }

        return newPoints
    }

    /**
     * Returns lambda and config? if config is undefined, use default config
     */

    return {
        lambda,
        iterate: _ => 0,
        endIf: (duration: number, x: number) => duration >= 10000
    }
}

export default particlesGen9
