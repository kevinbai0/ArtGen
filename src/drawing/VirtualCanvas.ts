import { Point, Value } from "../types"
import { unwrap } from "../utils"

class VirtualCanvas {
    // canvas representation of a cartesian grid with 1024 width, 1024 height, and no
    get width(): number {
        return 1024.0
    }

    get height(): number {
        return 1024.0
    }

    private _scaleX: number
    private _scaleY: number

    constructor(width: number, height: number) {
        this._scaleX = width / this.width
        this._scaleY = height / this.height
    }

    transformPointToCanvas = (point: Point): Point => {
        // raw: 0,0 is in the top left
        const maxScale = Math.max(this._scaleX, this._scaleY)
        return {
            x: (unwrap(point.x) + this.width / 2) * maxScale,
            y: (this.height / 2 - unwrap(point.y)) * maxScale
        }
    }

    transformDimensionToCanvas = (value: Value): number => {
        const maxScale = Math.max(this._scaleX, this._scaleY)
        return maxScale * unwrap(value)
    }
}

export default VirtualCanvas
