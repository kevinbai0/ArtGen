import { Lambda, Point, DecoratedPoint, ShapeType, DecoratedShape, Shape } from "../types";
import VirtualCanvas from "./VirtualCanvas";

export interface StartConfiguration {
    duration?: number
}

class DrawEngine {
    private _virtualCanvas: VirtualCanvas
    private _ctx: CanvasRenderingContext2D | null
    private _functionMapper: Lambda
    private _startTime: number = 0
    private _prevTime: number = 0
    private _config?: StartConfiguration

    constructor(fun: Lambda, artboard: HTMLCanvasElement) {
        this._functionMapper = fun;
        // normalizing to square canvas
        artboard.width = artboard.clientWidth * 2;
        artboard.height = artboard.clientHeight * 2;

        this._virtualCanvas = new VirtualCanvas(artboard.width, artboard.height);

        this._ctx = artboard.getContext("2d");

        this._startTime = 0;
    }

    /**
     * Allows users to set the default context settings
     */
    setContextSettings = (callback: (ctx: CanvasRenderingContext2D) => void) => {
        if (this._ctx) callback(this._ctx);
    }

    /**
     * Start the animation
     * @param config
     */
    start(config?: StartConfiguration) {
        if (!this._ctx) return;
        this._startTime = performance.now();

        this._config = config;
        requestAnimationFrame(() => this._draw(this._ctx!, this._functionMapper, 0));
    }

    /**
     * Draws the 
     */
    private _draw = (ctx: CanvasRenderingContext2D, fun: Lambda, x: number) => {
        let results = fun(x).reduce((acc, shape) => {
            if (shape.fill && shape.stroke) acc.fillAndStroke.push(shape);
            else if (shape.fill) acc.fill.push(shape);
            else if (shape.stroke) acc.stroke.push(shape);
            return acc;
        }, { fill: new Array<DecoratedShape>(), stroke: new Array<DecoratedShape>(), fillAndStroke: new Array<DecoratedShape>()});

        results.fill.forEach(shape => this._drawShape[shape.type](shape));
        ctx.fill();
        ctx.beginPath();

        results.stroke.forEach(shape => this._drawShape[shape.type](shape));
        ctx.stroke();

        ctx.beginPath();
        results.fillAndStroke.forEach(shape => this._drawShape[shape.type](shape));
        ctx.fill();
        ctx.stroke();

        if (this._config && this._config.duration) {
            let currentTime = performance.now();
            let runningTime = currentTime - this._startTime;

            if (this._prevTime !== 0) this.dataListener(1000 / (currentTime - this._prevTime), runningTime);

            this._prevTime = currentTime;

            if (runningTime > this._config.duration) {
                return;
            }
        }
        requestAnimationFrame(() => this._draw(ctx, fun, x + 0.1));
    }

    private _drawShape  = {
        point: (shape: DecoratedShape) => {
            const point = shape as DecoratedPoint;
            const transformed = this._virtualCanvas.transformPointToCanvas(point);
            const r = this._virtualCanvas.transformDimensionToCanvas(point.radius || 5); // get radius from function

            if (!this._ctx) return;
            this._ctx.fillStyle = point.fill || "";
            this._ctx.strokeStyle = point.stroke || "";
            this._ctx.moveTo(transformed.x + r, transformed.y);
            this._ctx.ellipse(transformed.x, transformed.y, r, r, 0, 0, 2 * Math.PI);
        }
    }
    /**
     * Override to get real time fps and duration updates
     */
    public dataListener = (fps: number, duration: number) => {};
}

export default DrawEngine;