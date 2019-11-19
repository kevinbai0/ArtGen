import { Range, MultiRange } from "./types";

export const randomized = (range: MultiRange) => {
    if (typeof(range[0]) !== "number") {
        const newRange = range as Array<Range>
        let rI = Math.floor(Math.random() * range.length);
        return Math.random() * (newRange[rI][1] - newRange[rI][0]) + newRange[rI][0];
    }
    const newRange = range as Range;
    return Math.random() * (newRange[1] - newRange[0]) + newRange[0];
}

