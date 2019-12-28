import { Lambda, Shape, Point, DrawableFunction } from "../../types"
import { unwrap as productionUnwrap } from "../../utils"

const linesGen2 = (unwrap = productionUnwrap): DrawableFunction => {
    const piecewise = () => {
        let arr: Point[] = []
        const xShift = -100 + unwrap([0, 300]) - 80
        const xStretch = 200 + unwrap([0, 100]) - 50
        const yShift = 100 + unwrap([0, 150]) - 75
        const yStretch = 500 + unwrap([0, 100]) - 50
        const yStretchMultiplier = 2
        for (let i = -512; i < 512; i++) {
            if (i < xShift)
                arr.push({
                    x: i,
                    y:
                        (-1 / xStretch) * Math.pow(i - xShift, 2) +
                        yStretch / yStretchMultiplier +
                        yShift
                })
            else
                arr.push({
                    x: i,
                    y:
                        yStretch /
                            ((1 / (xStretch * 100)) * Math.pow(i - xShift, 2) +
                                yStretchMultiplier) +
                        yShift
                })
        }
        return arr
    }

    let lineShapes: { points: Point[]; red: number; green: number }[] = []
    for (let i = 0; i < 200; i++) {
        lineShapes.push({
            points: piecewise(),
            red: unwrap([200, 250]),
            green: unwrap([150, 200])
        })
    }
    const lambda: Lambda = (x: number) => {
        // generate x / 100 lines
        const lines = lineShapes.map((values, i) => {
            return Shape.line({
                points: values.points,
                range: [Math.round(x - 1) - i * 5, Math.round(x) + 10 - i * 5],
                stroke: `rgba(${255 - Math.min((x / 10) * 1, 200)}, ${
                    values.red
                }, ${values.green}, 0.5)`,
                lineWidth: 5,
                zIndex: i
            })
        })
        return lines
    }
    return {
        lambda,
        iterate: x => x + 5,
        endIf: duration => duration >= 10000
    }
}

export default linesGen2
