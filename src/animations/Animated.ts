import { DecoratedShape } from "../types"

class Animated<T extends DecoratedShape> {
    protected _percentage: number
    protected _ended: boolean = false
    protected _delay: number

    protected _shape: T

    get ended() {
        return this._ended
    }
    get percentage() {
        return this._percentage
    }
    get shape() {
        return this._shape
    }

    constructor(config: T, delay?: number) {
        this._delay = delay || 0
        this._percentage = 0
        this._shape = config
    }

    willUpdate(newValue: number, value: number) {}
    didUpdate(value: number, oldValue: number) {}

    update(delta: number) {
        if (this._delay > 0) {
            this._delay -= 1
            return { ...this._shape }
        }

        this.willUpdate(this._percentage + delta, this._percentage)
        this._percentage += delta
        this.didUpdate(this.percentage, this.percentage - delta)
        if (this._percentage > 1.05) this._ended = true
        return { ...this._shape }
    }
}

export default Animated
