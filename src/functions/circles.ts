import { Lambda, MultiRange, Shape } from "../types";
import { randomized } from "../utils";

type MultiNumberRange = MultiRange<number>;

export interface CirclesConfig {
    colorRange?: {
        r?: MultiNumberRange,
        g?: MultiNumberRange,
        b?: MultiNumberRange,
        a?: MultiNumberRange
    },
    radius?: MultiNumberRange
}

const circleArtGenerator = (config?: CirclesConfig) => {
    let rangeR = config && config.colorRange && config.colorRange.r || [0,0];
    let rangeG = config && config.colorRange && config.colorRange.g || [0,0];
    let rangeB = config && config.colorRange && config.colorRange.b || [0,0];
    let rangeA = config && config.colorRange && config.colorRange.a || [1,1];

    const colorRandomizer = (r: MultiNumberRange = rangeR, g: MultiNumberRange = rangeG, b: MultiNumberRange = rangeB, a: MultiNumberRange = rangeA) => {
        return `
            rgba(${randomized(r)}, ${randomized(g)}, ${randomized(b)}, ${randomized(a)})
        `;
    }

    const radiusRandomizer = (r: MultiNumberRange = config && config.radius || [5,5]) => {
        return randomized(r);
    }

    const circles: Lambda = (x: number) => {
        let r = x;
        let points = [];
        let max = 4 * r;
        if (max < 5) max = 5;
    
        for (let i = 0; i < max; ++i) {
            let y = Math.random() * 2 * r - r;
            let newX = (Math.random() > 0.5 ? -1 : 1) * Math.sqrt(r * r - y * y);

            points.push(Shape.point({
                x: newX * 20 + r * 5, 
                y: y * 20 + r * 5, 
                radius: radiusRandomizer(),
                fill: colorRandomizer()
            }));
        }
        return {
            shapes: points,
            dx: 0.1
        }
    }
    return circles;
}

export default circleArtGenerator;