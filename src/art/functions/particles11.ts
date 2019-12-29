import {
    Lambda,
    Shape,
    DecoratedPoint,
    DrawableFunction,
    Injectables
} from "../../types"
import { unwrap as productionUnwrap, rgba as productionRGBA } from "../../utils"

const particlesGen11: DrawableFunction = (
    { unwrap, rgba }: Injectables = {
        unwrap: productionUnwrap,
        rgba: productionRGBA
    }
) => {
    /**
     * Set up, initialize
     */
    const point = Shape.point({
        x: 0.1,
        y: -0.1,
        fill: rgba(20, 0, unwrap([50, 255]), 1),
        radius: 1
    })
    /*const a = unwrap([
        [-3, -1],
        [1, 3]
    ])
    const b = unwrap([
        [-3, -1],
        [1, 3]
    ])
    const c = unwrap([
        [-3, -1],
        [1, 3]
    ])
    const d = unwrap([
        [-3, -1],
        [1, 3]
    ])*/

    const a = 1.174132642135791,
        b = 2.778908116731588,
        c = 1.6669106705876144,
        d = 1.2127556568410314

    /**
     * Create Lambda (takes in number, outputs shapes)
     */

    console.log(a, b, c, d)

    const lambda: Lambda = (t: number, count) => {
        let newPoints: DecoratedPoint[] = []

        for (let i = 0; i < 1000; ++i) {
            const x = unwrap(point.x)
            const y = unwrap(point.y)
            point.x =
                Math.cos(Math.sin(a * x - y * c)) +
                c * Math.sin(Math.cos(a * x * d))
            point.y = Math.sin(Math.cos(b * x)) + d * Math.cos(b * y)

            point.fill = rgba(Math.max(200 - x / 2, 0), 220, x * 200, 0.1)

            point.zIndex = i

            newPoints.push({
                ...point,
                x: unwrap(point.x) * 150,
                y: unwrap(point.y) * 150
            })
        }

        return newPoints
    }

    /**
     * Returns lambda and config? if config is undefined, use default config
     */

    return {
        lambda,
        iterate: x => x + 2,
        endIf: (duration: number, x: number) => duration >= 10000
    }
}

export default particlesGen11
