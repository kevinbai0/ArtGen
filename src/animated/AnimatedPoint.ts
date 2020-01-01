import { DecoratedPoint, RGBA } from "../types"
import Animated from "./Animated"

class AnimatedPoint extends Animated<DecoratedPoint> {
    constructor(config: DecoratedPoint, delay?: number) {
        super(config, delay)
        this._delay = delay || 0
        this._percentage = 0
        this._shape = config
        if ((this._shape.fill as RGBA).r) {
            ;(this._shape.fill as RGBA).a = 0
            ;(this._shape.stroke as RGBA).a = 0
        }
    }

    willUpdate(newValue: number): DecoratedPoint {
        if ((this._shape.fill as RGBA).r && (this._shape.stroke as RGBA)) {
            ;(this._shape.fill as RGBA).a = newValue * 0.001
            ;(this._shape.stroke as RGBA).a = newValue * 0.05
        }

        return this._shape
    }
}

export default AnimatedPoint
