import { DecoratedShape, Modifiable } from "../types"

class Animated<T extends DecoratedShape & Modifiable<T>> {
    protected _percentage: number
    protected _ended = false
    protected _delay: number

    protected _shape: T

    get ended(): boolean {
        return this._ended
    }
    get percentage(): number {
        return this._percentage
    }
    get shape(): T {
        return this._shape
    }

    constructor(config: T, delay?: number) {
        this._delay = delay || 0
        this._percentage = 0
        this._shape = config
    }

    // eslint-disable-next-line @typescript-eslint/no-empty-function, @typescript-eslint/no-unused-vars
    willUpdate(newValue: number, value: number): void {}
    // eslint-disable-next-line @typescript-eslint/no-empty-function, @typescript-eslint/no-unused-vars
    didUpdate(value: number, oldValue: number): void {}

    update(delta: number): T {
        if (this._delay > 0) {
            this._delay -= 1
            return this.shape.clone()
        }

        this.willUpdate(this._percentage + delta, this._percentage)
        this._percentage += delta
        this.didUpdate(this.percentage, this.percentage - delta)
        if (this._percentage > 1.05) this._ended = true
        return this.shape.clone()
    }
}

export default Animated
