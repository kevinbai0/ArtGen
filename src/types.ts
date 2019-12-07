export enum ShapeType {
    point = "point",
    line = "line",
}

export type Color = string;

export interface ShapeStyles {
    fill?: Color
    stroke?: Color
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

export interface OrderStyle {
    zIndex?: number
    stateIndex?: number
}

export interface DecoratedLine extends Line, LineStyles, DecoratedShape {
    type: ShapeType.line
    range: Range<number | string>
}

interface PointConstructor extends Point,  PointStyles, OrderStyle, LineStyles {};
interface LineConstructor extends Line, LineStyles, OrderStyle { 
    range?: Range<number | string>
}

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
    }
}

export type Lambda = (x: number) => { shapes: DecoratedShape[], dx: number };

export type Range<T> = [T, T];
export type MultiRange<T> = Range<T> | Array<Range<T>>;

export function updateShapes<T extends DecoratedShape>(shapes: T[], callback: (shape: T, index: number) => any) {
    shapes.forEach((shape, i) => {
        let obj = callback(shape, i);
        for (const key in obj) {
            (shape as any)[key] = obj[key];
        }
    });
}