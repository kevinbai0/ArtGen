import {
    Lambda,
    Shape,
    DecoratedPoint,
    DrawableFunction,
    Injectables
} from "../../types"
import {
    unwrap as productionUnwrap,
    rgba as productionRGBA,
    generate
} from "../../utils"

const particlesGen10: DrawableFunction = (
    { unwrap, rgba }: Injectables = {
        unwrap: productionUnwrap,
        rgba: productionRGBA
    }
) => {
    /**
     * Set up, initialize
     */
    let points = generate(5, i =>
        Shape.point({
            x: unwrap([-100, 100]),
            y: unwrap([-10, 10]),
            fill: rgba(20, 0, unwrap([50, 255]), 1),
            radius: 1
        })
    )
    const a = 0.912
    const b = 0.6372

    /**
     * Create Lambda (takes in number, outputs shapes)
     */

    const lambda: Lambda = (_: number, count) => {
        let newPoints: DecoratedPoint[] = []

        points.forEach((point, p) => {
            for (let i = 0; i < 200; ++i) {
                const x = unwrap(point.x)
                const y = unwrap(point.y)
                if (p < 2) {
                    point.x =
                        Math.sin((x * x) / unwrap([0, 1]) + y) * y +
                        Math.cos(a * x - y)
                    point.y = x + (Math.sin(y * Math.sqrt(2)) * b) / 2
                    point.fill = rgba(
                        count < 200 ? 120 : 240,
                        Math.max(200 - count, 0),
                        x * 200,
                        0.25
                    )
                } else {
                    point.x =
                        Math.sin((x * x) / unwrap([0, 1]) + y) * y +
                        Math.cos(b * x - y * y)
                    point.y = x + (Math.sin(y * Math.sqrt(2)) * b) / 2
                    point.fill = rgba(
                        count < 200 ? 120 : 50,
                        Math.max(200 - count, 0),
                        y * 200,
                        0.25
                    )
                }

                point.zIndex = i * p

                newPoints.push({
                    ...point,
                    x: unwrap(point.x) * 250,
                    y: unwrap(point.y) * 250
                })
            }
        })

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

export default particlesGen10
