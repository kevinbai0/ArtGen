import { DecoratedArc, Value, unwrap } from "../types"

class AnimatedCircle {
    private _x: Value
    private _y: Value
    private _r: Value
    private _percentage: number
    private _ended: boolean = false
    private _delay: number

    private _arc: DecoratedArc
    private _startAngle: Value

    get x() {
        return this._x
    }
    get y() {
        return this._y
    }
    get r() {
        return this._r
    }

    get ended() {
        return this._ended
    }

    constructor(config: DecoratedArc, delay?: number) {
        this._delay = delay || 0
        this._x = config.x
        this._y = config.y
        this._r = config.radius
        this._percentage = 0
        this._startAngle = Math.random() * 2 * Math.PI
        this._arc = config
        this._arc.start = this._startAngle
        this._arc.end = this._startAngle
    }

    line(delta: number) {
        if (this._delay > 0) {
            this._delay -= 1
            return this._arc
        }
        this._percentage += delta
        this._arc.end =
            unwrap(this._startAngle) + this._percentage * Math.PI * 2
        if (this._percentage > 1.05) this._ended = true
        return this._arc
    }
}

export default AnimatedCircle
