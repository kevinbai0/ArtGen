export enum ShapeType {
    point = "point",
    line = "line",
    arc = "arc"
}

export type Color = string;

export interface ShapeStyles {
    fill?: Color
    stroke?: Color
}

export interface OrderStyle {
    zIndex?: number
    stateIndex?: number
}


export interface DecoratedShape extends ShapeStyles {
    type: ShapeType
    zIndex: number
    stateIndex?: number
}

export interface Point {
    x: number
    y: number
}

export interface PointStyles extends ShapeStyles {
    radius?: number
}

export interface DecoratedPoint extends Point, PointStyles, DecoratedShape, LineStyles {
    type: ShapeType.point
}

export interface Line {
    points: Point[]
}

export interface LineStyles extends ShapeStyles {
    lineWidth?: number
}

export interface DecoratedLine extends Line, LineStyles, DecoratedShape {
    type: ShapeType.line
    range: Range<number | string>
}

export interface Arc {
    x: number
    y: number
    start: number
    end: number
    radius: number
}

export interface ArcStyles extends ShapeStyles {}

export interface DecoratedArc extends Arc, ArcStyles, DecoratedShape, LineStyles {
    type: ShapeType.arc
    direction: "clockwise" | "counter-clockwise"
}


interface PointConstructor extends Point, PointStyles, OrderStyle, LineStyles {};
interface LineConstructor extends Line, LineStyles, OrderStyle { 
    range?: Range<number | string>
}
interface ArcConstructor extends Arc, ArcStyles, OrderStyle, LineStyles {
    direction?: "clockwise" | "counter-clockwise"
};

export const Shape = {
    point: (point: PointConstructor): DecoratedPoint => {
        return {
            ...point,
            type: ShapeType.point,
            zIndex: point.zIndex || 0,
            ...(point.stateIndex && { stateIndex: point.stateIndex })
        }
    },
    line: (line: LineConstructor): DecoratedLine => {
        return {
            ...line,
            range: line.range || ["0%", "100%"],
            type: ShapeType.line,
            zIndex: line.zIndex || 0,
            ...(line.stateIndex && { stateIndex: line.stateIndex })
        }
    },
    arc: (arc: ArcConstructor): DecoratedArc => {
        return {
            ...arc,
            type: ShapeType.arc,
            zIndex: arc.zIndex || 0,
            ...(arc.stateIndex && { stateIndex: arc.stateIndex }),
            direction: arc.direction || "clockwise"
        }
    }
}

export type Lambda = (x: number) => { shapes: DecoratedShape[], dx: number };

export type Range<T> = [T, T];
export type MultiRange<T> = Range<T> | Array<Range<T>>;

export function updateShapes<T>(shapes: T[], callback: (shape: T, index: number) => any) {
    shapes.forEach((shape, i) => {
        let obj = callback(shape, i);
        for (const key in obj) {
            (shape as any)[key] = obj[key];
        }
    });
}

export function generate<T>(count: number, callback: (index: number) => T) {
    return [...Array(count)].map((_, i) => callback(i));
}



export type Num = number | MultiRange<number>

export const convertNumber = (num: Num): number => {
    if (typeof(num) === "number") return num;
    if (typeof(num[0]) !== "number") {
        const newRange = num as Array<Range<number>>
        let rI = Math.floor(Math.random() * num.length);
        return Math.random() * (newRange[rI][1] - newRange[rI][0]) + newRange[rI][0];
    }
    const newRange = num as Range<number>;
    return Math.random() * (newRange[1] - newRange[0]) + newRange[0];
}