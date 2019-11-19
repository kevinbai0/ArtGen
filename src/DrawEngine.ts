import { Lambda, Point, DecoratedPoint } from "./types";

export interface StartConfiguration {
    duration?: number
}

export interface ArtboardSettings {
    rawWidth: number,
    rawHeight: number,
    useCartesianSystem: boolean,
    scale: number
}

class DrawEngine {
    private _artboard: HTMLCanvasElement
    private _ctx: CanvasRenderingContext2D | null
    private _functionMapper: Lambda
    private _startTime: number = 0
    private _prevTime: number = 0
    private _config?: StartConfiguration

    private _artboardSettings: ArtboardSettings

    constructor(fun: Lambda, artboard: HTMLCanvasElement,) {
        this._functionMapper = fun;
        this._artboard = artboard;
        this._ctx = artboard.getContext("2d");
        this._startTime = 0;

        this._artboardSettings = {
            rawWidth: artboard.width,
            rawHeight: artboard.height,
            useCartesianSystem: true,
            scale: 5
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
                let transformed = this._transformPoint(point, this._artboardSettings);
    
                const r = point.radius || 5; // get radius from function
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

    public dataListener = (fps: number, duration: number) => {};

    private _transformPoint = (point: DecoratedPoint, settings: ArtboardSettings): Point => {
        return {
            ...point,
            x: point.x * settings.scale,
            y: settings.rawHeight - (point.y * settings.scale)
        }
    }

}

export default DrawEngine;