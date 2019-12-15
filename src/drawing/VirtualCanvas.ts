import { Point } from "../types";

class VirtualCanvas {
    // canvas representation of a cartesian grid with 1024 width, 1024 height, and no
    get width() { return 1024.0 }
    get height() { return 1024.0 }

    private _scaleX: number
    private _scaleY: number

    constructor(width: number, height: number) {
        this._scaleX = width / this.width;
        this._scaleY = height / this.height;
    }

    transformPointToCanvas = (point: Point): Point => {
        // raw: 0,0 is in the top left
        let maxScale = Math.max(this._scaleX, this._scaleY);
        return {
            ...point,
            x: (point.x + this.width / 2) * maxScale,
            y: (this.height / 2 - point.y) * maxScale
        }
    }

    transformDimensionToCanvas = (value: number): number => {
        let maxScale = Math.max(this._scaleX, this._scaleY);
        return Math.ceil(maxScale * value);
    }
}

export default VirtualCanvas;