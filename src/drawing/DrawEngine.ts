import { Lambda, Point, DecoratedPoint, ShapeType, DecoratedShape, Shape, DecoratedLine, Range, DecoratedArc } from "../types";
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

class TimeTracker {
    private _entries: Map<string, number>;
    private _start: number
    constructor() {
        this._entries = new Map();
        this._start = 0;
    }

    start() {
        this._entries.clear();
        this._start = performance.now();
        this._entries.set("_start", this._start);
    }

    addBreakpoint(name: string) {
        this._entries.set(name, performance.now());
    }

    output() {
        let end = performance.now();
        let arr = Array.from(this._entries);
        return `${arr.map((time, i) => 
                `${time[0]}: ${(i >= 1 ? time[1] - arr[i-1][1] : 0).toFixed(2)}ms, elapsed: ${(time[1] - this._start).toFixed(2)}ms`
            ).join("\n")}\nTotal Time: ${(end - this._start).toFixed(2)}ms
        `;
    }

    timeLapsed() {
        return performance.now() - this._start;
    }
}

class DrawEngine {
    private _virtualCanvas: VirtualCanvas
    private _ctx: CanvasRenderingContext2D | null
    private _backgroundCtx: CanvasRenderingContext2D | null
    private _functionMapper: Lambda
    private _startTime: number = 0
    private _prevTime: number = 0
    private _config?: StartConfiguration
    private _unchangedState: Map<number, Separation>
    private _state: Map<number, DecoratedShape>
    private _timeTracker: TimeTracker

    constructor(fun: Lambda, container: HTMLDivElement) {
        this._functionMapper = fun;
        // normalizing to square canvas
        const artboard = document.createElement("canvas");
        artboard.className = "artgen-canvas"
        artboard.width = container.clientWidth * 2;
        artboard.height = container.clientHeight * 2;

        const backgroundArtboard = document.createElement("canvas");
        backgroundArtboard.className = "artgen-canvas"
        backgroundArtboard.width = container.clientWidth * 2;
        backgroundArtboard.height = container.clientHeight * 2;

        container.appendChild(backgroundArtboard);
        container.appendChild(artboard);

        this._virtualCanvas = new VirtualCanvas(artboard.width, artboard.height);

        this._ctx = artboard.getContext("2d");
        this._backgroundCtx = backgroundArtboard.getContext("2d");
        this._state = new Map<number, DecoratedShape>();
        this._unchangedState = new Map<number, Separation>();

        this._startTime = 0;
        this._timeTracker = new TimeTracker();
    }

    /**
     * Start the animation
     * @param config
     */
    start(config?: StartConfiguration) {
        if (!this._ctx || !this._backgroundCtx) return;
        this._startTime = performance.now();
        this._config = config;

        // clear the state
        this._state = new Map<number, DecoratedShape>();
        this._unchangedState = new Map<number, Separation>();

        requestAnimationFrame(() => this._draw(this._ctx!, this._backgroundCtx!, this._functionMapper, 0));
    }

    /**
     * Draws the 
     */
    private _draw = (ctx: CanvasRenderingContext2D, backgroundCtx: CanvasRenderingContext2D, fun: Lambda, x: number): void => {
        this._timeTracker.start();

        const funResult = fun(x);
        this._timeTracker.addBreakpoint("calculate");

        const next = () => this._iterate(x, funResult.dx, (dx) => {
            this._draw(ctx, backgroundCtx, fun, x + dx)
        });

        function addToIndexedSeparationMap(shape: DecoratedShape, acc: IndexedSeparationMap) {
            if (!acc.get(shape.zIndex)) acc.set(shape.zIndex, { fill: [], stroke: [], fillAndStroke: []});
            if (shape.fill && shape.stroke) acc.get(shape.zIndex)!.fillAndStroke.push(shape);
            else if (shape.fill) acc.get(shape.zIndex)!.fill.push(shape);
            else if (shape.stroke) acc.get(shape.zIndex)!.stroke.push(shape);
        }

        // separate points between points that have changed state, and points that have not
        const states = funResult.shapes.reduce((accum, shape) => {
            if (shape.stateIndex === undefined) {
                addToIndexedSeparationMap(shape, this._unchangedState);
                addToIndexedSeparationMap(shape, accum.staticState);
                return accum;
            }

            if (!this._state.has(shape.stateIndex)) {
                this._state.set(shape.stateIndex, shape);
            }
            this._state.set(shape.stateIndex, shape);
            accum.changeState = true;
            return accum;
        }, { changeState: false, staticState: new Map<number, Separation>() });

        this._timeTracker.addBreakpoint("reduce all");

        // if there are no changes to be made, then render as usual
        if (!states.changeState) {
            this._render(backgroundCtx, states.staticState.entries());
            this._timeTracker.addBreakpoint("render static");
            if (this._timeTracker.timeLapsed() > 15) console.log(this._timeTracker.output());
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

        // 2) Render static elements into the background
        this._render(backgroundCtx, states.staticState.entries());
        this._timeTracker.addBreakpoint("render static");

        // 3) Redraw elements from newly updated state
        let stateMap = Array.from(this._state.entries())
            .reduce((accum, entry) => {
                addToIndexedSeparationMap(entry[1], accum)
                return accum;
            }, 
                new Map<number, Separation>());
        this._timeTracker.addBreakpoint("reduce state");

        this._render(ctx, stateMap.entries());
        this._timeTracker.addBreakpoint("render state");

        if (this._timeTracker.timeLapsed() > 15) console.log(this._timeTracker.output());
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
            return void requestAnimationFrame(_ => next(dx));
        }
        return void requestAnimationFrame(_ => next(dx));
    }

    private _render(ctx: CanvasRenderingContext2D, entries: IterableIterator<[number, Separation]>) {
        let arr = Array.from(entries)
                    .sort((a, b) => a[0] - b[0]);
        arr.forEach(result => {
            ctx.beginPath();
            result[1].fill.forEach(shape => this._drawShape[shape.type](shape, ctx));
            ctx.fill();

            ctx.beginPath();
            result[1].stroke.forEach(shape => this._drawShape[shape.type](shape, ctx));
            ctx.stroke();

            ctx.beginPath();
            result[1].fillAndStroke.forEach(shape => this._drawShape[shape.type](shape, ctx));
            ctx.fill();
            ctx.stroke();
        });
    }

    private _drawShape = {
        prevFill: "",
        prevStroke: "",
        prevLineWidth: 1,
        point: (shape: DecoratedShape, ctx: CanvasRenderingContext2D) => {
            const point = shape as DecoratedPoint;
            const transformed = this._virtualCanvas.transformPointToCanvas(point);
            const r = this._virtualCanvas.transformDimensionToCanvas(point.radius || 5); // get radius from function
            
            if (this._drawShape.prevFill !== point.fill) {
                ctx.fillStyle = point.fill || "";
                this._drawShape.prevFill = point.fill || "";
            }
            if (this._drawShape.prevStroke !== point.stroke) {
                ctx.strokeStyle = point.stroke || "";
                this._drawShape.prevStroke = point.stroke || "";
            }
            if (this._drawShape.prevLineWidth !== point.lineWidth) {
                ctx.lineWidth = this._virtualCanvas.transformDimensionToCanvas(point.lineWidth || 1);
                this._drawShape.prevLineWidth = point.lineWidth || 1;
            }
            //ctx.lineWidth = point.lineWidth || 1;
            ctx.moveTo(transformed.x + r, transformed.y);
            ctx.ellipse(transformed.x, transformed.y, r, r, 0, 0, 2 * Math.PI);
        },
        line: (shape: DecoratedShape, ctx: CanvasRenderingContext2D) => {
            const line = shape as DecoratedLine;
            let range = getRange(line.range, line.points.length);

            if (this._drawShape.prevStroke !== line.stroke) {
                ctx.strokeStyle = line.stroke || "";
                this._drawShape.prevStroke = line.stroke || "";
            }
            if (this._drawShape.prevLineWidth !== line.lineWidth) {
                ctx.lineWidth = this._virtualCanvas.transformDimensionToCanvas(line.lineWidth || 1);
                this._drawShape.prevLineWidth = line.lineWidth || 1;
            }
            if (line.points.length === 0) return;

            const firstTransformedPoint = this._virtualCanvas.transformPointToCanvas(line.points[range[0]]);
            ctx.moveTo(firstTransformedPoint.x, firstTransformedPoint.y);
            for (let i = range[0]; i < range[1] + 1; ++i) {
                const transformed = this._virtualCanvas.transformPointToCanvas(line.points[i]);
                ctx.lineTo(transformed.x, transformed.y);
            };
        },
        arc: (shape: DecoratedShape, ctx: CanvasRenderingContext2D) => {
            const arc = shape as DecoratedArc;
            const transformed = this._virtualCanvas.transformPointToCanvas(arc);
            const r = this._virtualCanvas.transformDimensionToCanvas(arc.radius); // get radius from function
            if (this._drawShape.prevFill !== arc.fill) {
                ctx.fillStyle = arc.fill || "";
                this._drawShape.prevFill = arc.fill || "";
            }
            if (this._drawShape.prevStroke !== arc.stroke) {
                ctx.strokeStyle = arc.stroke || "";
                this._drawShape.prevStroke = arc.stroke || "";
            }
            if (this._drawShape.prevLineWidth !== arc.lineWidth) {
                ctx.lineWidth = this._virtualCanvas.transformDimensionToCanvas(arc.lineWidth || 1);
                this._drawShape.prevLineWidth = arc.lineWidth || 1;
            }

            ctx.moveTo(transformed.x + Math.cos(arc.start) * r, transformed.y + Math.sin(arc.start) * r);
            ctx.arc(transformed.x, transformed.y, r, arc.start, arc.end, arc.direction === "counter-clockwise");
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
        return [Math.round(bounded(newRange[0], 0, 1) * (length - 1)), Math.round(bounded(newRange[1], 0, 1) * (length - 1))];
    }
    const numRange = range as Range<number>;
    return [bounded(numRange[0], 0, length - 1), bounded(numRange[1], 0, length - 1)];
}

function bounded(num: number, lower: number, upper: number) {
    return Math.min(Math.max(num,lower), upper);
}

export default DrawEngine;