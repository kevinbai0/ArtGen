import { Draw, DecoratedPoint, DrawableFunction } from "../../../src/types"
import { GenPoint } from "../../../src/utils"

const particlesGen9: DrawableFunction = ({ unwrap, rgba }) => {
    /**
     * Set up, initialize
     */
    let point = GenPoint(1, 1, {
        fill: rgba(20, 0, unwrap([50, 255]), 0.1),
        radius: 2
    })
    const a = 0.912
    const b = 0.7724381

    /**
     * Create Draw (takes in number, outputs shapes)
     */

    const draw: Draw = (_: number) => {
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
     * Returns draw and config? if config is undefined, use default config
     */

    return {
        draw,
        iterate: _ => 0,
        endIf: (duration: number, x: number) => duration >= 10000
    }
}

export default particlesGen9
