import { Lambda, Shape, Value, unwrap } from "../types";
import AnimatedCircle from "../animations/AnimatedCircle";

const rand = (r1: number, r2: number) => Math.random() * Math.abs(r1 - r2) + Math.min(r1, r2);

const circlesGen5 = () => {
    const randomArc = (config: {x: Value, y: Value, radius: Value, fill: string, key?: number}) => {
        return Shape.arc({
            x: unwrap(config.x), 
            y: unwrap(config.y),
            radius: unwrap(config.radius),
            start: 0,
            end: 0,
            fill: config.fill,
            zIndex: config.key
        });
    }

    const minRadius = 300;
    const maxRadius = 350;
    const maxEdge = 400;
    let circles = new Map<number, AnimatedCircle>();
    // top left
    circles.set(0, new AnimatedCircle(randomArc({
        x: [-maxEdge + 100, -maxEdge], 
        y: [maxEdge - 100, maxEdge], 
        radius: [minRadius, maxRadius],
        fill: `rgba(${unwrap([150, 200])}, ${unwrap([50, 100])}, ${unwrap([50, 200])}, ${0.5})`,
        key: 0
    }), Math.random() * 20));
    // middle
    circles.set(1, new AnimatedCircle(randomArc({
        x: [-50, -50], 
        y: [1, 0], 
        radius: [minRadius, maxRadius], 
        fill: `rgba(${unwrap([150, 200])}, ${unwrap([50, 100])}, ${unwrap([50, 200])}, ${0.5})`,
        key: 0
    }), Math.random() * 20));
    // bottom left
    circles.set(2, new AnimatedCircle(randomArc({
        x: [-maxEdge + 100, -maxEdge], 
        y: [-maxEdge, -maxEdge + 50], 
        radius: [minRadius, maxRadius], 
        fill: `rgba(${unwrap([150, 200])}, ${unwrap([50, 100])}, ${unwrap([50, 200])}, ${0.5})`,
        key: 2
    }), Math.random() * 20));
    // bottom right
    circles.set(3, new AnimatedCircle(randomArc({
        x: [maxEdge - 50, maxEdge], 
        y: [-maxEdge, -maxEdge + 50], 
        radius: [minRadius, maxRadius], 
        fill: `rgba(${unwrap([150, 200])}, ${unwrap([50, 100])}, ${unwrap([50, 200])}, ${0.5})`,
        key: 3
    }), Math.random() * 20));
    // top right
    circles.set(4, new AnimatedCircle(randomArc({
        x: [maxEdge - 100, maxEdge], 
        y: [maxEdge - 100, maxEdge], 
        radius: [minRadius, maxRadius], 
        fill: `rgba(${unwrap([150, 200])}, ${unwrap([50, 100])}, ${unwrap([50, 200])}, ${0.5})`,
        key: 4
    }), Math.random() * 20));
    //middle top
    circles.set(5, new AnimatedCircle(randomArc({
        x: [-50, 50], 
        y: [maxEdge - 100, maxEdge], 
        radius: [minRadius, maxRadius], 
        fill: `rgba(${unwrap([150, 200])}, ${unwrap([50, 100])}, ${unwrap([50, 200])}, ${0.5})`,
        key: 4
    }), Math.random() * 20));
    circles.set(6, new AnimatedCircle(randomArc({
        x: [-50, 50], 
        y: [-maxEdge + 100, -maxEdge], 
        radius: [minRadius, maxRadius], 
        fill: `rgba(${unwrap([150, 200])}, ${unwrap([50, 100])}, ${unwrap([50, 200])}, ${0.5})`,
        key: 4
    }), Math.random() * 20));
    circles.set(7, new AnimatedCircle(randomArc({
        x: [-maxEdge, -maxEdge + 50], 
        y: [-50, -50], 
        radius: [minRadius, maxRadius], 
        fill: `rgba(${unwrap([150, 200])}, ${unwrap([50, 100])}, ${unwrap([50, 200])}, ${0.5})`,
        key: 4
    }), Math.random() * 20));
    circles.set(8, new AnimatedCircle(randomArc({
        x: [maxEdge, maxEdge - 50], 
        y: [-50, -50], 
        radius: [minRadius, maxRadius], 
        fill: `rgba(${unwrap([150, 200])}, ${unwrap([50, 100])}, ${unwrap([50, 200])}, ${0.5})`,
        key: 4
    }), Math.random() * 20));

    let circlesCount = circles.size;

    const lambda: Lambda = (x: number) => {
        circles.forEach((circle, key) => {
            if (!circle.ended) return;
            circles.delete(key);

            const radius = unwrap(circle.r) * (Math.random() * 0.1 + (circle.r > 50 ? 0.8 : 0.65));
            const dr = unwrap(circle.r) - radius;
            circles.set(circlesCount, 
                new AnimatedCircle(
                    randomArc({
                        x: [unwrap(circle.x) - dr / 2, unwrap(circle.x) + dr / 2],
                        y: [unwrap(circle.y) - dr / 2, unwrap(circle.y) + dr / 2],
                        radius,
                        fill: `rgba(${unwrap([150, 200])}, ${unwrap([50, 100])}, ${unwrap([50, 200])}, ${0.5})`,
                        key: circlesCount
                    }),
                    Math.random() * 10
                )
            );
            circlesCount += 1;
        });

        return {
            shapes: Array.from(circles.entries()).map(circle => circle[1].line(0.05)),
            dx: 1
        }
    }

    return lambda;
}

export default circlesGen5;