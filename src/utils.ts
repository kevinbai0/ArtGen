import { Range, MultiRange } from "./types";

export const randomized = (range: MultiRange<number>) => {
    if (typeof(range[0]) !== "number" || typeof(range[0]) !== "string") {
        const newRange = range as Array<Range<number>>
        let rI = Math.floor(Math.random() * range.length);
        return Math.random() * (newRange[rI][1] - newRange[rI][0]) + newRange[rI][0];
    }
    const newRange = range as Range<number>;
    return Math.random() * (newRange[1] - newRange[0]) + newRange[0];
}

