export enum ShapeType {
    point = "point",
    line = "line"
}

export interface ShapeStyles {
    fill?: Color
    stroke?: Color
}

export interface DecoratedShape extends ShapeStyles {
    type: ShapeType
    zIndex: number
}

export type Color = string;

export interface Point {
    x: number,
    y: number
}

export interface PointStyles extends ShapeStyles {
    radius?: number
}

export interface DecoratedPoint extends Point, PointStyles, DecoratedShape {
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
}

export const Shape = {
    point: (point: Point & PointStyles & { zIndex?: number }): DecoratedPoint => {
        return {
            ...point,
            type: ShapeType.point,
            zIndex: point.zIndex || 0
        }
    },
    line: (line: Line & LineStyles & { zIndex?: number }): DecoratedLine => {
        return {
            ...line,
            type: ShapeType.line,
            zIndex: line.zIndex || 0
        }
    }
}

export type Lambda = (x: number) => { shapes: DecoratedShape[], dx: number };

export type Range = [number, number];
export type MultiRange = Range | Array<Range>;