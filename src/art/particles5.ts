import { Draw, Value, DrawableFunction } from "../types"
import { generate, updateShapes, GenPoint } from "../utils"

const particlesGen5: DrawableFunction = ({ unwrap, rgba }) => {
    const initParticles = generate(600, i =>
        GenPoint([-512, 512], [-512, 512], {
            fill: "rgba(0,0,0,1)",
            zIndex: i,
            stateIndex: i
        })
    )

    let directions = generate(600, i => {
        return (x: number): { dx: Value; dy: Value } => {
            const dx = Math.sin(x) + 1
            return {
                dx,
                dy: [0, 1]
            }
        }
    })

    const draw: Draw = x => {
        let residual = initParticles.map(point => {
            return GenPoint(point.x, point.y, {
                fill: rgba(0, 0, 0, [0, 0.1])
            })
        })
        updateShapes(initParticles, (point, i) => {
            let delta = directions[i](x)
            return {
                x: unwrap(point.x) + unwrap(delta.dx),
                y: unwrap(point.y) + unwrap(delta.dy),
                fill: { r: 0, g: 0, b: 0, a: 1 - x / 600 }
            }
        })

        return initParticles.concat(residual)
    }
    return {
        draw,
        iterate: x => x + 1,
        endIf: duration => duration >= 10000
    }
}

export default particlesGen5
