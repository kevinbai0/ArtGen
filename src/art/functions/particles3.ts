import { Lambda, Shape, DrawableFunction } from "../../types"
import {
    unwrap as productionUnwrap,
    rgba,
    generate,
    updateShapes
} from "../../utils"

const particlesGen3 = (unwrap = productionUnwrap): DrawableFunction => {
    let points = generate(500, i => {
        let th = (i / 500) * 2 * Math.PI
        return Shape.point({
            x: Math.cos(th) * 50,
            y: Math.sin(th) * 50 - 300,
            fill: "rgba(0,0,0,1)",
            radius: 2
        })
    })
    points = points.concat(
        generate(500, i => {
            let th = (i / 500) * 2 * Math.PI
            return Shape.point({
                x: Math.cos(th) * 50 - 350,
                y: Math.sin(th) * 50 - 200,
                fill: "rgba(0,0,0,1)",
                radius: 2
            })
        })
    )
    points = points.concat(
        generate(500, i => {
            let th = (i / 500) * 2 * Math.PI
            return Shape.point({
                x: Math.cos(th) * 50 + 350,
                y: Math.sin(th) * 50 - 200,
                fill: "rgba(0,0,0,1)",
                radius: 2
            })
        })
    )
    const lambda: Lambda = (x: number) => {
        updateShapes(points, (shape, i) => {
            return {
                x: unwrap(shape.x) + unwrap([-x / 200, x / 200]),
                y: unwrap(shape.y) + unwrap([0, 3]),
                fill: rgba([0, 255], 0, 0, Math.max(0.1, 1 - (x * x) / 3600)),
                zIndex: i
            }
        })
        return points
    }

    return {
        lambda,
        iterate: x => x + 12,
        endIf: duration => duration >= 10000
    }
}

export default particlesGen3
