import { Lambda, Point, DecoratedPoint } from "./types";

export interface StartConfiguration {
    duration?: number
}

export interface ArtboardSettings {
    rawWidth: number,
    rawHeight: number,
    useCartesianSystem: boolean,
}

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
        return maxScale * value;
    }
}


class DrawEngine {
    private _artboard: HTMLCanvasElement
    private _virtualCanvas: VirtualCanvas
    private _ctx: CanvasRenderingContext2D | null
    private _functionMapper: Lambda
    private _startTime: number = 0
    private _prevTime: number = 0
    private _config?: StartConfiguration

    private _artboardSettings: ArtboardSettings

    constructor(fun: Lambda, artboard: HTMLCanvasElement) {
        this._functionMapper = fun;
        this._artboard = artboard;
        // normalizing to square canvas
        artboard.width = artboard.clientWidth * 2;
        artboard.height = artboard.clientHeight * 2;

        this._virtualCanvas = new VirtualCanvas(artboard.width, artboard.height);

        this._ctx = artboard.getContext("2d");
        this._startTime = 0;

        this._artboardSettings = {
            rawWidth: artboard.width,
            rawHeight: artboard.height,
            useCartesianSystem: true,
        }
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
        let results = fun(x);
        ctx.beginPath();

        const dots = (values: DecoratedPoint[]) => {
            values.forEach(point => {
                let transformed = this._virtualCanvas.transformPointToCanvas(point);
    
                const r = this._virtualCanvas.transformDimensionToCanvas(point.radius || 5); // get radius from function
                const color = ctx.fillStyle = point.color || "black"; // get color from function
                ctx.fillStyle = color;
                ctx.moveTo(transformed.x, transformed.y);
                ctx.ellipse(transformed.x, transformed.y, r, r, 0, 0, 2 * Math.PI);
            });
        }

        dots(results);
        ctx.fill();

        if (this._config) {
            if (this._config.duration) {
                let currentTime = performance.now();
                let runningTime = currentTime - this._startTime;

                if (this._prevTime !== 0) this.dataListener(1000 / (currentTime - this._prevTime), runningTime);

                this._prevTime = currentTime;

                if (runningTime > this._config.duration) {
                    return;
                }
            }
        }
        requestAnimationFrame(() => this._draw(ctx, fun, x + 0.1));
    }

    /**
     * Override to get real time fps and duration updates
     */
    public dataListener = (fps: number, duration: number) => {};
}

export default DrawEngine;