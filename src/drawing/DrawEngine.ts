import { Lambda, Point, DecoratedPoint, ShapeType, DecoratedShape, Shape, DecoratedLine } from "../types";
import VirtualCanvas from "./VirtualCanvas";

export interface StartConfiguration {
    duration?: number
}

type Separation = {
    fill: DecoratedShape[],
    stroke: DecoratedShape[],
    fillAndStroke: DecoratedShape[]
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
        const funResult = fun(x);
        const results = funResult.shapes.reduce((acc: Map<number, Separation>, shape) => {
            if (!acc.get(shape.zIndex)) acc.set(shape.zIndex, { fill: [], stroke: [], fillAndStroke: []});
            if (shape.fill && shape.stroke) acc.get(shape.zIndex)!.fillAndStroke.push(shape);
            else if (shape.fill) acc.get(shape.zIndex)!.fill.push(shape);
            else if (shape.stroke) acc.get(shape.zIndex)!.stroke.push(shape);
            return acc;
        }, new Map<number, Separation>());

        let arr: Separation[] = [];
        results.forEach(result => arr.push(result));

        arr.sort((a, b) => {
            const getZIndex = (sep: Separation) => {
                if (sep.fill.length > 0) return sep.fill[0].zIndex;
                if (sep.stroke.length > 0) return sep.stroke[0].zIndex;
                if (sep.fillAndStroke.length > 0) return sep.fillAndStroke[0].zIndex;
            }
            let orderA = getZIndex(a);
            let orderB = getZIndex(b);
            if (!orderA || !orderB) return 1;
            return orderA - orderB;
        });

        arr.forEach(result => {
            result.fill.forEach(shape => this._drawShape[shape.type](shape));
            ctx.fill();
            ctx.beginPath();

            result.stroke.forEach(shape => this._drawShape[shape.type](shape));
            ctx.stroke();

            ctx.beginPath();
            result.fillAndStroke.forEach(shape => this._drawShape[shape.type](shape));
            ctx.fill();
            ctx.stroke();
        });

        if (this._config && this._config.duration) {
            let currentTime = performance.now();
            let runningTime = currentTime - this._startTime;

            if (this._prevTime !== 0) this.dataListener(1000 / (currentTime - this._prevTime), runningTime);

            this._prevTime = currentTime;

            if (runningTime > this._config.duration) {
                return;
            }
        }
        requestAnimationFrame(() => this._draw(ctx, fun, x + funResult.dx));
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
        },
        line: (shape: DecoratedShape) => {
            const line = shape as DecoratedLine;
            const lineWidth = this._virtualCanvas.transformDimensionToCanvas(line.lineWidth || 1);
            if (!this._ctx) return;
            this._ctx.strokeStyle = line.stroke || "";
            this._ctx.lineWidth = lineWidth;
            if (line.points.length > 0) {
                const firstPoint = this._virtualCanvas.transformPointToCanvas(line.points[0]);
                this._ctx.moveTo(firstPoint.x, firstPoint.y);
            }
            line.points.slice(1).forEach(point => {
                const transformed = this._virtualCanvas.transformPointToCanvas(point);
                this._ctx!.lineTo(transformed.x, transformed.y);
            });
        }
    }
    /**
     * Override to get real time fps and duration updates
     */
    public dataListener = (fps: number, duration: number) => {};
}

export default DrawEngine;