import { DecoratedArc, DecoratedLine } from "../types";

class AnimatedLine {
    private _percentage: number
    private _ended: boolean = false;
    private _delay: number;

    private _line: DecoratedLine

    get ended() { return this._ended }

    constructor(config: DecoratedLine, delay?: number) {
        this._delay = delay || 0;
        this._percentage = 0;
        this._line = config;
        this._line.range = ["0%", "0%"];
    }

    update(delta: number) {
        if (this._delay > 0) {
            this._delay -= 1;
            return this._line;
        }
        this._line.range = [`${this._percentage * 100 - 1.1}%`, `${(this._percentage + delta) * 100}%`];
        this._percentage += delta;
        if (this._percentage > 1.05) this._ended = true;
        return this._line;
    }
}

export default AnimatedLine;