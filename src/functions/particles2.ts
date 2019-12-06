import { Lambda, DecoratedPoint, Shape, Point } from "../types";

const particlesGen2 = (): Lambda => {
    const len = 400;
    const radius = 400;
    let particles: Point[] = [...Array(len)].map((_, i) => {
        const theta = i / len * Math.PI;
        if (i == 0) return { x: radius, y: 0 };
        return {
            x: radius * Math.cos(theta),
            y: (i % 2 === 0 ? -1 : 1) * radius * Math.sin(theta)
        }
    });
    const decoratedPoint = (point: Point, x: number, index: number) => {
     return Shape.point({
        ...point,
        fill: `rgba(120,120,120,${Math.min(1, 1 / (Math.pow(x, 1/100) + 1))})`,
        radius: 2,
        stateIndex: index
    }) };
    const lambda: Lambda = (x: number) => {
        /*particles = particles.map((point, i) => (i % 2 === 0 ? {
            x: point.x + Math.random() * (x / 200) - 2,
            y: point.y + Math.random() * (x / 200) - 2
        } : {
            x: point.x + Math.random() * 4 - x / 200,
            y: point.y + Math.random() * 4 - x / 200
        }))*/
        particles = particles.map(point => ({
            x: point.x + (Math.random() * 2 - 1) * Math.max(3, x / 100),
            y: point.y + (Math.random() * 2 - 1) * Math.max(3, x / 100)
        }))

        return {
            shapes: [
                ...particles.map((point, i) => decoratedPoint(point, x, i)),
            ],
            dx: 1,
        }
    }
    return lambda;
}

export default particlesGen2;