import { Lambda, Shape, DecoratedPoint, DrawableFunction } from "../../types"

const particlesGen11: DrawableFunction = ({ unwrap, rgba }) => {
    /**
     * Set up, initialize
     */
    const point = Shape.point(0.1, -0.1, {
        fill: rgba(20, 0, unwrap([50, 255]), 1),
        radius: 1
    })

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

            newPoints.push(
                point
                    .mutate({
                        x:
                            Math.cos(Math.sin(a * x - y * c)) +
                            c * Math.sin(Math.cos(a * x * d)),
                        y: Math.sin(Math.cos(b * x)) + d * Math.cos(b * y),
                        fill: rgba(Math.max(200 - x / 2, 0), 220, x * 200, 0.1),
                        zIndex: i
                    })
                    .clone({
                        x: x * 150,
                        y: y * 150
                    })
            )
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
