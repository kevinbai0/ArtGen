import { Lambda, generate, Shape, updateShapes, unwrap } from "../types"

const particlesGen4 = (): Lambda => {
    const baseParticles = generate(500, i => {
        let th = (i / 500) * 2 * Math.PI
        return Shape.point({
            x: Math.cos(th) * 100,
            y: Math.sin(th) * 100,
            fill: "rgba(0,0,0,1)",
            radius: 1,
            stateIndex: i
        })
    })

    const lambda: Lambda = (x: number) => {
        let residualParticles = baseParticles.map(point => ({
            ...point,
            fill: x < 200 ? "rgba(0,0,0,0.05)" : "rgba(0,0,0,0.01)",
            radius: Math.max(2, x / 30),
            stateIndex: undefined
        })) /*.concat(baseParticles.map(point => ({
            x: point.x + Math.random() * 2 - 1,
            y: point.y + Math.random() * 2 - 1,
            ...point,
            fill: `rgba(0,0,0,0.1)`,
            radius: 5,
            stateIndex: undefined
        })));*/
        updateShapes(baseParticles, (point, i) => {
            const baseAngle = (i / 500) * 2 * Math.PI
            let theta = x > 200 ? baseAngle + x / Math.PI : baseAngle
            let dX =
                Math.random() *
                (x / 30) *
                Math.cos(theta + Math.random() * 0.2 - 0.1)
            let dY =
                Math.random() *
                (x / 30) *
                Math.sin(theta + Math.random() * 0.2 - 0.1)
            return {
                x: unwrap(point.x) + dX + Math.random() * 4 - 2,
                y: unwrap(point.y) + dY + Math.random() * 4 - 2,
                fill: `rgba(0, 0, 0, ${Math.max(0.5 - i / 600, 0.01)})`,
                radius: Math.max(1, x / 30)
            }
        })

        return {
            shapes: baseParticles.concat(residualParticles),
            dx: 1
        }
    }

    return lambda
}

export default particlesGen4
