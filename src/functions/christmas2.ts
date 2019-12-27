import { Lambda, generate, Shape, updateShapes, unwrap, rgba, DecoratedPoint, RGBA, simplify, withOpacity } from "../types";
import AnimatedPoint from "../animations/AnimatedPoint";
import AnimatedLine from "../animations/AnimatedLine";

const christmasGen2 = (): Lambda => {
    const baseParticles = generate(1000, i => {
        const randR = unwrap([1, 200]);
        const randTh = unwrap([0, 2 * Math.PI]);
        let randRed = unwrap([[255,220], [0,10]]);
        const randGreen = unwrap(randRed < 50 ? [150, 200] : [0, 10]);
        return Shape.point({
            x: Math.cos(i / 100 * 2 * Math.PI) * i / 2,
            y: Math.sin(i / 100 * 2 * Math.PI) * i / 2,
            fill: rgba(randRed,randGreen,0,1),
            radius: 3,
            lineWidth: 1,
            zIndex: i
        })
    });

    const initPositions = baseParticles.map(shape => ({x: shape.x, y: shape.y, direction: Math.random() < 0.5}));
    const lambda: Lambda = (x: number) => {
        const residual = baseParticles.map((shape) => {
            return {
                ...shape,
                stateIndex: undefined,
                fill: withOpacity(Math.max(0, 0.25 - x / 1200), shape.fill),
            }
        })
        if (x >= 100) {
                updateShapes(baseParticles, (shape, i) => {
                let r = x;
                let th = (initPositions[i].direction ? 1 : -1) * x / 10;
                return {
                    x: unwrap(initPositions[i].x) + Math.cos(th) * unwrap([5,i * 0.1]),
                    y: unwrap(initPositions[i].y) + Math.sin(th) * unwrap([5,i * 0.1]),
                    radius: x / 50
                }
            })
        }

        return {
            shapes: x < 100 ? baseParticles.slice(x * 10, x * 10 + 10) : residual,
            dx: 1
        }
    }

    return lambda
}

export default christmasGen2;