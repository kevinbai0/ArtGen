import { Lambda, MultiRange } from "../types";
import { randomized } from "../utils";

export interface CirclesConfig {
    colorRange?: {
        r?: MultiRange,
        g?: MultiRange,
        b?: MultiRange,
        a?: MultiRange
    },
    radius?: MultiRange
}

const circleArtGenerator = (config?: CirclesConfig) => {
    let rangeR = config && config.colorRange && config.colorRange.r || [0,0];
    let rangeG = config && config.colorRange && config.colorRange.g || [0,0];
    let rangeB = config && config.colorRange && config.colorRange.b || [0,0];
    let rangeA = config && config.colorRange && config.colorRange.a || [1,1];

    const colorRandomizer = (r: MultiRange = rangeR, g: MultiRange = rangeG, b: MultiRange = rangeB, a: MultiRange = rangeA) => {
        return `
            rgba(${randomized(r)}, ${randomized(g)}, ${randomized(b)}, ${randomized(a)})
        `;
    }

    const radiusRandomizer = (r: MultiRange = config && config.radius || [5,5]) => {
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

            points.push({x: newX * 20 + r * 5, y: y * 20 + r * 5, radius: radiusRandomizer(), color: colorRandomizer()});
        }
        return points;
    }
    return circles;
}

export default circleArtGenerator;