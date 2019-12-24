import { DecoratedArc, Value, unwrap, DecoratedPoint, RGBA } from "../types";

class AnimatedPoint {
    private _percentage: number
    private _ended: boolean = false;
    private _delay: number;

    private _point: DecoratedPoint;
    private _startAngle: Value

    get ended() { return this._ended }

    get percentage() { return this._percentage }

    constructor(config: DecoratedPoint, delay?: number) {
        this._delay = delay || 0;
        this._percentage = 0;
        this._startAngle = Math.random() * 2 * Math.PI;
        this._point = config;
        if ((this._point.fill as RGBA).r) {
            (this._point.fill as RGBA).a = 0;
            (this._point.stroke as RGBA).a = 0;
        }
    }

    update(delta: number) {
        if (this._delay > 0) {
            this._delay -= 1;
            return this._point;
        }
        this._percentage += delta;
        if ((this._point.fill as RGBA).r && (this._point.stroke as RGBA)) {
            (this._point.fill as RGBA).a = this._percentage * 0.001;
            (this._point.stroke as RGBA).a = this._percentage * 0.05;
        }
        if (this._percentage > 1.05) this._ended = true;
        return this._point;
    }
}

export default AnimatedPoint;