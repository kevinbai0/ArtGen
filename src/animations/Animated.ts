import { DecoratedShape } from "../types";

class Animated<T extends DecoratedShape> {
    private _percentage: number
    private _ended: boolean = false;
    private _delay: number;

    private _shape: T

    get ended() { return this._ended }

    get percentage() { return this._percentage }

    constructor(config: T, delay?: number) {
        this._delay = delay || 0;
        this._percentage = 0;
        this._shape = config;
    }

    onUpdate(newValue: number, oldValue: number) {}

    update(delta: number) {
        if (this._delay > 0) {
            this._delay -= 1;
            return { ...this._shape }
        }
        //this._line.range = [`${this._percentage * 100 - 1.1}%`, `${(this._percentage + delta) * 100}%`];
        this._percentage += delta;
        if (this._percentage > 1.05) this._ended = true;
        return { ...this._shape };
    }
}

export default Animated;