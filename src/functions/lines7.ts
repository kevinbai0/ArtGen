import { Lambda, Point, Shape, generate, rgba, unwrap, DecoratedLine, updateShapes } from "../types";
import AnimatedLine from "../animations/AnimatedLine";

const linesGen7 = (): Lambda => {
    const eq1 = (theta: number, r: number): Point => {
        return {
            x: r * Math.cos(theta * 0.2), y: r * Math.sin(theta * Math.sqrt(Math.random() * 0.001 + 1.975))
        }
    }

    const eq2 = (theta: number, r: number): Point => {
        return {
            x: r * Math.cos(Math.sqrt(2) * theta), y: r * Math.sin(theta)
        }
    }

    const generateLine = (z: number, func: (theta: number, r: number) => Point) => {
        const r = Math.floor(unwrap([400, 500]));
        const max = Math.max(50, r * 4);
        const start = Math.floor(Math.random() * max);
        const points = generate(max, i => func((start + i) / (max - 1) * 20 * Math.PI, r));
        const shade = unwrap([0, 0])
        return new AnimatedLine(Shape.line({
            points,
            stroke: rgba(shade, shade, shade, 0.1),
            zIndex: z,
            lineWidth: 1
        }));
    }
    let lines = new Map<number, AnimatedLine>();
    lines.set(0, generateLine(0, eq1));
    let count = lines.size;

    let ended: DecoratedLine[]= []

    const lambda: Lambda = (x: number) => {
        if (x < 300) {
            lines.set(count, generateLine(count, Math.random() < 0.5 ? eq1 : eq1));
            //lines.set(count, generateLine(count + 1, Math.random() < 0.5 ? eq1 : eq2));
            count += 2;
        }

        lines.forEach((line, key) => {
            if (line.ended) {
                lines.delete(key);
                const finished = line.line();
                finished.stateIndex = key;
                ended.push(finished);
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

export default linesGen7;