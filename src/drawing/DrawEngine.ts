import { Lambda, Point, DecoratedPoint, ShapeType, DecoratedShape, Shape, DecoratedLine, Range } from "../types";
import VirtualCanvas from "./VirtualCanvas";

export interface StartConfiguration {
    duration?: number,
    maxX?: number
}

type Separation = {
    fill: DecoratedShape[],
    stroke: DecoratedShape[],
    fillAndStroke: DecoratedShape[]
}

type IndexedSeparationMap = Map<number, Separation>;

class DrawEngine {
    private _virtualCanvas: VirtualCanvas
    private _ctx: CanvasRenderingContext2D | null
    private _functionMapper: Lambda
    private _startTime: number = 0
    private _prevTime: number = 0
    private _config?: StartConfiguration
    private _unchangedState: Map<number, Separation>
    private _state: Map<number, DecoratedShape>

    constructor(fun: Lambda, artboard: HTMLCanvasElement) {
        this._functionMapper = fun;
        // normalizing to square canvas
        artboard.width = artboard.clientWidth * 2;
        artboard.height = artboard.clientHeight * 2;

        this._virtualCanvas = new VirtualCanvas(artboard.width, artboard.height);

        this._ctx = artboard.getContext("2d");
        this._state = new Map<number, DecoratedShape>();
        this._unchangedState = new Map<number, Separation>();

        this._startTime = 0;
    }

    /**
     * Start the animation
     * @param config
     */
    start(config?: StartConfiguration) {
        if (!this._ctx) return;
        this._startTime = performance.now();
        this._config = config;

        // clear the state
        this._state = new Map<number, DecoratedShape>();
        this._unchangedState = new Map<number, Separation>();

        requestAnimationFrame(() => this._draw(this._ctx!, this._functionMapper, 0));
    }

    /**
     * Draws the 
     */
    private _draw = (ctx: CanvasRenderingContext2D, fun: Lambda, x: number): void => {
        if (!this._ctx) return;

        const funResult = fun(x);

        const next = () => this._iterate(x, funResult.dx, (dx) => this._draw(ctx, fun, x + dx));

        function addToIndexedSeparationMap(shape: DecoratedShape, acc: IndexedSeparationMap) {
            if (!acc.get(shape.zIndex)) acc.set(shape.zIndex, { fill: [], stroke: [], fillAndStroke: []});
            if (shape.fill && shape.stroke) acc.get(shape.zIndex)!.fillAndStroke.push(shape);
            else if (shape.fill) acc.get(shape.zIndex)!.fill.push(shape);
            else if (shape.stroke) acc.get(shape.zIndex)!.stroke.push(shape);
            return acc;
        }

        // separate points between points that have changed state, and points that have not
        let count = 0;
        const states = funResult.shapes.reduce((accum, shape) => {
            if (shape.stateIndex === undefined) {
                this._unchangedState = addToIndexedSeparationMap(shape, this._unchangedState);
                count += 1;
                return { ...accum, staticState: addToIndexedSeparationMap(shape, accum.staticState) };
            }
            
            if (!this._state.has(shape.stateIndex)) {
                this._state.set(shape.stateIndex, shape);
            }
            this._state.set(shape.stateIndex, shape);
            return { ...accum, changeState: true }
        }, { changeState: false, staticState: new Map<number, Separation>() });

        // if there are no changes to be made, then render as usual
        if (!states.changeState) {
            this._render(ctx, states.staticState.entries());
            return next();
        }

        /**
         * if there are changes to be made, 
         *  1) Clear the canvas
         *  2) Redraw elements from saved static state
         *  3) Redraw the newly updated state
         * 
         * Note, if there are a lot of points (> 2000) already drawn in static state, this will be very slow
         * Don't have > 1000 points saved in the state
         */

        // 1) Clear the canvas
        ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);

        // 2) Redraw elements from saved unchanged state
        this._render(ctx, this._unchangedState.entries());

        // 3) Redraw elements from newly updated state
        let stateMap = Array.from(this._state.entries())
            .reduce((accum, entry) => 
                addToIndexedSeparationMap(entry[1], accum), 
                new Map<number, Separation>());

        this._render(ctx, stateMap.entries());

        return next();
    }

    private _iterate(x: number, dx: number, next: (dx: number) => void) {
        if (this._config && (this._config.duration || this._config.maxX)) {
            let currentTime = performance.now();
            let runningTime = currentTime - this._startTime;
            const fps = 1000 / (currentTime - this._prevTime);
            
            if (this._prevTime !== 0) this.dataListener(fps, runningTime);

            this._prevTime = currentTime;

            if (this._config.duration && runningTime > this._config.duration) return;
            if (this._config.maxX && x + dx > this._config.maxX) return;
            return void requestAnimationFrame(() => next(dx));
        }
        return void requestAnimationFrame(() => next(dx));
    }

    private _render(ctx: CanvasRenderingContext2D, entries: IterableIterator<[number, Separation]>) {
        return Array.from(entries)
                .sort((a, b) => a[0] - b[0])
                .forEach(result => {
                    ctx.beginPath();
                    result[1].fill.forEach(shape => this._drawShape[shape.type](shape));
                    ctx.fill();

                    ctx.beginPath();
                    result[1].stroke.forEach(shape => this._drawShape[shape.type](shape));
                    ctx.stroke();

                    ctx.beginPath();
                    result[1].fillAndStroke.forEach(shape => this._drawShape[shape.type](shape));
                    ctx.fill();
                    ctx.stroke();
                });
    }

    private _drawShape = {
        point: (shape: DecoratedShape) => {
            const point = shape as DecoratedPoint;
            const transformed = this._virtualCanvas.transformPointToCanvas(point);
            const r = this._virtualCanvas.transformDimensionToCanvas(point.radius || 5); // get radius from function

            if (!this._ctx) return;
            this._ctx.fillStyle = point.fill || "";
            this._ctx.strokeStyle = point.stroke || "";
            this._ctx.lineWidth = point.lineWidth || 1;
            this._ctx.moveTo(transformed.x + r, transformed.y);
            this._ctx.ellipse(transformed.x, transformed.y, r, r, 0, 0, 2 * Math.PI);
        },
        line: (shape: DecoratedShape) => {
            const line = shape as DecoratedLine;
            let range = getRange(line.range, line.points.length);
            const lineWidth = this._virtualCanvas.transformDimensionToCanvas(line.lineWidth || 1);
            if (!this._ctx) return;
            this._ctx.strokeStyle = line.stroke || "";
            this._ctx.lineWidth = lineWidth;
            if (line.points.length === 0) return;

            const firstTransformedPoint = this._virtualCanvas.transformPointToCanvas(line.points[range[0]]);
            this._ctx.moveTo(firstTransformedPoint.x, firstTransformedPoint.y);
            line.points.slice(range[0], range[1] + 1).forEach(point => {
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

function getRange(range: Range<number | string>, length: number): Range<number> {
    if (typeof(range[0]) === "string") {
        const newRange: Range<number> = [parseFloat(range[0]) / 100.0, parseFloat(range[1] as string) / 100.0];
        if (isNaN(newRange[0]) || isNaN(newRange[1])) return [0, length - 1];
        return [bounded(newRange[0], 0, 1) * (length - 1), bounded(newRange[1], 0, 1) * (length - 1)];
    }
    const numRange = range as Range<number>;
    return [bounded(numRange[0], 0, length - 1), bounded(numRange[1], 0, length - 1)];
}

function bounded(num: number, lower: number, upper: number) {
    return Math.min(Math.max(num,lower), upper);
}

export default DrawEngine;