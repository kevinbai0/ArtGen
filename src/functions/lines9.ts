import { Lambda, Shape, DecoratedPoint } from "../types"
import { unwrap, rgba, generate, updateShapes } from "../utils"

const linesGen9 = (): Lambda => {
    let point = Shape.point({
        x: 1, //unwrap([-512, 512]),
        y: 1, //unwrap([-512, 512]),
        fill: rgba(20, 0, unwrap([50, 255]), 0.1),
        radius: 2
    })
    const a = 0.912
    const b = 0.7724381
    const lambda: Lambda = (xVal: number) => {
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
        console.log(point.fill)

        return {
            shapes: newPoints,
            dx: 1
        }
    }

    return lambda
}

export default linesGen9
