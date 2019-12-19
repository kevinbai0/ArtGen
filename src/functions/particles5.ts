import { Lambda, generate, Shape, updateShapes, unwrap, Value, rgba } from "../types";

const particlesGen5 = (): Lambda => {
    const initParticles = generate(600, i => {
        return Shape.point({
            x: [-512, 512],
            y: [-512, 512],
            fill: `rgba(0,0,0,1)`,
            zIndex: i,
            stateIndex: i
        })
    });

    let directions = generate(600, i => {
        return (x: number): { dx: Value, dy: Value} => {
            const dx = Math.sin(x) + 1;
            return {
                dx,
                dy: [0,1],
            }
        }
    })

    const lambda: Lambda = (x: number) => {
        let residual = initParticles.map(point => {
            return Shape.point({
                x: point.x,
                y: point.y,
                fill: rgba(0, 0, 0, [0,0.1])
            })
        })
        updateShapes(initParticles, (point, i) => {
            let delta = directions[i](x);
            return {
                x: unwrap(point.x) + unwrap(delta.dx),
                y: unwrap(point.y) + unwrap(delta.dy),
                fill: { r: 0, g: 0, b: 0, a: 1 - x / 600 }
            }
        });
        
        return {
            shapes: initParticles.concat(residual),
            dx: 1
        }
    }
    return lambda;
}

export default particlesGen5;