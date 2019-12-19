import { Lambda, Point, Shape, generate, rgba, unwrap } from "../types";
import AnimatedLine from "../animations/AnimatedLine";

const linesGen5 = (): Lambda => {
    const func = (theta: number, r: number): Point => {
        return {
            x: r * Math.cos(theta), y:  r * Math.sin(2 * Math.cos(theta * Math.sqrt(2)))
        }
    }

    const generateLine = (z: number) => {
        const r = Math.floor(unwrap([5,1000]));
        const points = generate(Math.max(100, r * 2), i => func(i / (r - 1)  * Math.PI, r));
        let color = Math.min(255, Math.round(Math.sqrt(r * r / 6)));
        return new AnimatedLine(Shape.line({
            points,
            stroke: rgba([50, 150], [200,255], [color - 5, color], 1),
            zIndex: z,
            lineWidth: 5
        }));
    }
    let lines = new Map<number, AnimatedLine>();
    lines.set(0, generateLine(0));
    let count = lines.size;

    const lambda: Lambda = (x: number) => {
        if (x < 400) {
            const bound = x < 300 ? 1 : 2;
            for (let i = 0; i < bound; ++i) {
                lines.set(count, generateLine(count));
                count += 1;
            }
        }

        lines.forEach((line, key) => {
            if (line.ended) {
                lines.delete(key);
                return;
            }            
        });

        return {
            shapes: Array.from(lines.entries()).map(val => val[1].update(0.01)),
            dx: 1
        }
    }

    return lambda;
}

export default linesGen5;