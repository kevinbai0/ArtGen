import { DrawableFunction, DecoratedPoint, Draw } from "../types"
import { generate, rgba, unwrap, GenPoint } from "../utils"

const particlesGen13: DrawableFunction = () => {
    /** define constants */
    const constants: [number, number, number, number] = [
        /*unwrap([1, 3]),
        unwrap([1, 3]),
        unwrap([1, 3]),
        unwrap([1, 3])*/
        2.0503880974393938,
        2.3992048442934837,
        2.6311542742315956,
        1.0208195163669718
    ]
    console.log(constants)

    /** Functinos to calculate next iteration */
    const calcX = (x: number, y: number, c: typeof constants) =>
        Math.sin(Math.sqrt(5) * Math.sin(x) * Math.cos(c[0] * x - y * c[2])) +
        c[2] * Math.sin(0.3 * Math.cos(c[0] * x * c[3]))
    const calcY = (x: number, y: number, c: typeof constants) =>
        Math.sin(Math.PI * Math.cos(c[1] * x)) +
        c[3] * Math.sin((1 / Math.E) * c[1] * y)

    // our initial point
    const points = generate(5, () =>
        GenPoint([0, 0.1], [0, -0.1], {
            fill: rgba(0, 0, 0, 0.1),
            radius: 1
        })
    )

    const draw: Draw = (x, count) =>
        [...Array(350)].reduce((accum, _, i) => {
            return accum.concat(
                points.map((point, p) => {
                    const x = unwrap(point.x)
                    const y = unwrap(point.y)
                    point.x = calcX(x, y, constants)
                    point.y = calcY(x, y, constants)
                    const newPoint = Object.assign({}, point)
                    newPoint.fill = rgba(
                        ((i * p) / (350 * 4)) * 250,
                        Math.max(200 - x / 2, 0),

                        y * 255,
                        p < 2 ? 0.2 : 0.1
                    )
                    newPoint.zIndex = i * p
                    newPoint.x = unwrap(point.x) * (p < 2 ? count : 200)
                    newPoint.y = unwrap(point.y) * (p < 2 ? count : 200)
                    return newPoint
                })
            )
        }, new Array<DecoratedPoint>())

    return {
        draw,
        iterate: x => x + 1,
        endIf: duration => duration >= 10000
    }
}

export default particlesGen13
