import { Lambda, generate, Shape, updateShapes } from "../types";

const particlesGen5 = (): Lambda => {
    const initParticles = generate(600, i => {
        return Shape.point({
            x: Math.random() * 1024 - 512,
            y: Math.random() * 1024 - 512,
            fill: `rgba(0,0,0, 1)`,
            zIndex: i,
            stateIndex: i
        })
    });

    let directions = generate(600, i => {
        return (x: number) => {
            const dx = Math.sin(x) + 1;
            return {
                dx,
                dy: Math.random(),
            }
        }
    })

    const lambda: Lambda = (x: number) => {
        let residual = initParticles.map(point => {
            return Shape.point({
                x: point.x,
                y: point.y,
                fill: `rgba(0,0,0,${Math.random() * 0.1})`
            })
        })
        updateShapes(initParticles, (point, i) => {
            let delta = directions[i](x);
            return {
                x: point.x + delta.dx,
                y: point.y + delta.dy,
                fill: `rgba(0,0,0,${1-x / 600})`
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