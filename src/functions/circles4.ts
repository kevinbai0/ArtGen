import { Lambda, Shape, DecoratedLine, updateShapes, generate, Point, DecoratedArc } from "../types";

class AnimatingCircle {
    private _x: number
    private _y: number
    private _r: number
    private _percentage: number
    private _ended: boolean = false;
    private _delay: number;

    private _arc: DecoratedArc
    private _startAngle: number

    get x() { return this._x }
    get y() { return this._y }
    get r() { return this._r }

    get ended() { return this._ended }

    constructor(config: DecoratedArc, delay?: number) {
        this._delay = delay || 0;
        this._x = config.x;
        this._y = config.y;
        this._r = config.radius;
        this._percentage = 0;
        this._startAngle = Math.random() * 2 * Math.PI;
        this._arc = config;
        this._arc.start = this._startAngle;
        this._arc.end = this._startAngle;
    }

    line(delta: number) {
        /*if (this._delay > 0) {
            this._delay -= 1;
            return this._arc;
        }*/
        this._percentage += delta;
        this._arc.end = this._startAngle + this._percentage * Math.PI * 2
        if (this._percentage > 1.05) this._ended = true;
        return this._arc;
    }

}



const circlesGen4 = () => {
    const randomArc = (x: number, y: number, radius: number, key?: number) => {
        const color = `rgba(${Math.random() * 150 + 50}, 0, 0, 1)`;
        return Shape.arc({
            x, y, radius,
            start: 0,
            end: 0,
            fill: color,
            zIndex: key
        });
    }

    let circlesCount = 1;
    let circles = new Map<number, AnimatingCircle>()
    circles.set(0, new AnimatingCircle(randomArc(0,0,800)));

    

    const lambda: Lambda = (x: number) => {
        circles.forEach((circle, key) => {
            if (!circle.ended) return;
            circles.delete(key);

            const radius = circle.r * (Math.random() * 0.1 + (circle.r > 50 ? 0.8 : 0.65));
            const dr = circle.r - radius;
            circles.set(circlesCount, 
                new AnimatingCircle(
                    randomArc(
                        circle.x + Math.random() * dr - dr / 2,
                        circle.y + Math.random() * dr - dr / 2,
                        radius,
                        circlesCount
                    ),
                    Math.random() * 20
                )
            );
            circlesCount += 1;
            
            /*for (let i = 0; i < 6; ++i) {
                let radius = circle.r / (Math.random() * 1.5 + 2.9)
                let th = i / 6 * Math.PI * 2;

                circles.set(circlesCount, 
                    new AnimatingCircle(
                        Shape.arc(
                            randomArc(
                                circle.x + Math.cos(th) * (circle.r - radius),
                                circle.y + Math.sin(th) * (circle.r - radius),
                                radius,
                                circlesCount
                            )
                        ), 
                        Math.random() * 20
                    )
                );
                circlesCount += 1;
            }
            circles.set(circlesCount, 
                new AnimatingCircle(
                    Shape.arc(
                        randomArc(
                            circle.x,
                            circle.y,
                            circle.r / (Math.random() * 1.5 + 2.9),
                            circlesCount
                        )
                    ), 
                    Math.random() * 20
                )
            );
            circlesCount += 1;*/
        });

        return {
            shapes: Array.from(circles.entries()).map(circle => circle[1].line(0.05)),
            dx: 1
        }
    }

    return lambda;
}

export default circlesGen4;