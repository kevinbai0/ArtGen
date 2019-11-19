import { Range } from "./types";

export const randomized = (range: Range) => Math.random() * (range[1] - range[0]) + range[0];

