import { Lambda, DecoratedPoint, Shape, Point, Line } from "../types";

const particlesGen2 = (): Lambda => {
    let sets: Point[][] = [];
    for (let p = 0; p < 5; p++) {
        let points: Point[] = []
        for (let i = 0; i < 150; ++i) {
            points.push({x: Math.random() * 1024 - 512, y: Math.random() * 1024 - 512});
        }
        sets.push(points);
    }
    const decoratedPoint = (point: Point, x: number, index: number, state: boolean) => {
     return Shape.point({
        ...point,
        fill: `rgba(${x / 600 * 200},200,${200 * (1 - x / 600)},1)`,
        radius: 3,
        ...(state && { stateIndex: index })
    }) };
    const lambda: Lambda = (x: number) => {
        if (x < 1000) {
            sets = sets.map((points, s) => 
                points.map((point, i) => {
                    const size = points.length;
                    let targetAngle = (i / size * 2 * Math.PI) + (x / 600) * Math.PI;
                    let targetX = 300 * Math.cos(targetAngle) + (s < 2 ? -x / 3 : x / 3) - s * 10;
                    let targetY = 300 * Math.sin(targetAngle) + (s % 2 === 0 ? -x / 3 : x / 3) - s * 10;
                    let dx = targetX - point.x;
                    let dy = targetY - point.y;
                    return { x: point.x + dx / 80, y: point.y + dy / 80 };
                })
            );
        }
        let allPoints: DecoratedPoint[] = [];
        sets.forEach((set, index) => {
            set.forEach((point, i) => allPoints.push(decoratedPoint(point, x, i + index * 200, x < 300)));
        })
        return {
            shapes: allPoints,
            dx: 1,
        }
    }
    return lambda;
}

export default particlesGen2;