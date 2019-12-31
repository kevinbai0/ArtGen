import { Lambda, DrawableFunction, DecoratedPoint, GenPoint } from "../../types"
import { generate } from "../../utils"

const example: DrawableFunction = ({ unwrap, rgba }) => {
    /** define constants */
    const constants: [number, number, number, number] = [
        2.689602099316258,
        2.711045926632344,
        2.0721756317448214,
        1.1136017709074095
    ]

    /** Functinos to calculate next iteration */
    const calcX = (x: number, y: number, c: typeof constants) =>
        Math.sin(3 * Math.sin(x) * Math.cos(c[0] * x - y * c[2])) +
        c[2] * Math.sin(0.3 * Math.cos(c[0] * x * c[3]))
    const calcY = (x: number, y: number, c: typeof constants) =>
        Math.sin(Math.PI * Math.cos(c[1] * x)) +
        c[3] * Math.sin((1 / Math.E) * c[1] * y)

    // our initial point
    let points = generate(5, _ =>
        GenPoint([0, 0.1], [0, -0.1], { fill: rgba(0, 0, 0, 0.1), radius: 1 })
    )

    const lambda: Lambda = _ => {
        let newPoints: DecoratedPoint[] = []

        for (let i = 0; i < 350; ++i) {
            newPoints = newPoints.concat(
                points.map((point, p) => {
                    const x = unwrap(point.x)
                    const y = unwrap(point.y)
                    return point
                        .mutate({
                            x: calcX(x, y, constants),
                            y: calcY(x, y, constants),
                            fill: rgba(
                                Math.max(200 - x / 2, 0),
                                ((i * p) / (350 * 4)) * 250,
                                y * 200,
                                0.1
                            ),
                            zIndex: i * p
                        })
                        .clone({
                            x: 150 * x,
                            y: 150 * y
                        })
                })
            )
        }

        return newPoints
    }

    return {
        lambda,
        iterate: x => x + 1,
        endIf: duration => duration >= 10000
    }
}

export default example
