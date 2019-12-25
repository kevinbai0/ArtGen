import { DecoratedArc, DecoratedLine } from "../types";
import Animated from "./Animated";

class AnimatedLine extends Animated<DecoratedLine> {

    constructor(config: DecoratedLine, delay?: number) {
        super(config, delay);
        this._shape.range = ["0%", "0%"];
    }

    

    willUpdate(newValue: number, value: number) {
        this._shape.range = [`${value * 100 - 1.1}%`, `${(newValue) * 100}%`];
        return this._shape;
    }
}

export default AnimatedLine;