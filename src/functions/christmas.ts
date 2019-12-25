import { Lambda, generate, Shape, updateShapes, unwrap, rgba, DecoratedPoint, RGBA, simplify, withOpacity } from "../types";
import AnimatedPoint from "../animations/AnimatedPoint";

const christmasGen = (): Lambda => {
    const baseParticles = generate(500, i => {
        const randR = unwrap([1, 200]);
        const randTh = unwrap([0, 2 * Math.PI]);
        let randRed = unwrap([[255,220], [0,10]]);
        const randGreen = unwrap(randRed < 50 ? [150, 200] : [0, 10]);
        return Shape.point({
            x: Math.cos(i / 500 * 2 * Math.PI) * i,
            y: Math.sin(i / 500 * 2 * Math.PI) * i,
            stroke: rgba(randRed,randGreen,0,0),
            radius: 3,
            lineWidth: 1,
            stateIndex: i,
            zIndex: i
        })
    });

    const initPositions = baseParticles.map(shape => ({x: shape.x, y: shape.y, direction: Math.random() < 0.5}));

    let numbers = generate(700, i => i);

    let animated: AnimatedPoint[] = [];
    let counter = 0;
    const lambda: Lambda = (x: number) => {
        const residual = baseParticles.map((shape) => {
            return {
                ...shape,
                stateIndex: undefined,
                stroke: withOpacity(Math.max(0, 0.25 - x / 1200), shape.stroke),
            }
        })
        updateShapes(baseParticles, (shape, i) => {
            let r = x;
            let th = (initPositions[i].direction ? 1 : -1) * x / 10;
            return {
                x: unwrap(initPositions[i].x) + Math.cos(th) * r,
                y: unwrap(initPositions[i].y) + Math.sin(th) * r
            }
        })
        return {
            shapes: baseParticles.concat(residual),
            dx: 1
        }
    }

    return lambda
}

export default christmasGen;