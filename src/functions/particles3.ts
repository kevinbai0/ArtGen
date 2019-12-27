import { Lambda, generate, Shape, updateShapes, unwrap } from "../types"

const particlesGen3 = (): Lambda => {
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
                x: unwrap(shape.x) + Math.random() * (x / 100) - x / 200,
                y: unwrap(shape.y) + 3 * Math.random(),
                fill: `rgba(${Math.random() * 255},0,0,${Math.max(
                    0.1,
                    1 - (x * x) / 3600
                )})`,
                zIndex: i
            }
        })
        return {
            shapes: points,
            dx: 12
        }
    }

    return lambda
}

export default particlesGen3
