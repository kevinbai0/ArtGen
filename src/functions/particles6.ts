import { Lambda, generate, Shape, updateShapes, unwrap, rgba } from "../types"

const particlesGen6 = (): Lambda => {
    const baseParticles = generate(500, i => {
        let th = (i / 500) * 2 * Math.PI
        return Shape.point({
            x: Math.cos(th) * 100,
            y: Math.sin(th) * 100,
            fill: rgba([255, 200], 0, 0, 1),
            radius: 1,
            stateIndex: i
        })
    })

    const lambda: Lambda = (x: number) => {
        let residualParticles = baseParticles.map(point => ({
            ...point,
            fill: rgba([200, 150], [100, 0], 0, Math.min(x / 600, 0.5)),
            radius: 2,
            stateIndex: undefined
        }))
        updateShapes(baseParticles, (point, i) => {
            const baseAngle = (i / 500) * 2 * Math.PI
            let theta = baseAngle
            let dX =
                Math.random() *
                (x / 30) *
                Math.cos(theta + Math.random() * 0.2 - 0.1)
            let dY =
                Math.random() *
                (x / 30) *
                Math.sin(theta + Math.random() * 0.2 - 0.1)
            return {
                x: Math.sin(theta) * x,
                y: Math.cos(theta) * x,
                fill: `rgba(0, 0, 0, ${Math.max(0.5 - i / 600, 0.01)})`,
                radius: Math.max(1, x / 30)
            }
        })

        return {
            shapes: baseParticles.concat(residualParticles),
            dx: 1.5
        }
    }

    return lambda
}

export default particlesGen6
