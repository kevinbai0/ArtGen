export enum ShapeType {
    point = "point",
    line = "line",
    arc = "arc"
}

export interface RGBA {
    r: number
    g: number
    b: number
    a: number
}

export type Color = string | RGBA

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
    x: Value
    y: Value
}

export interface PointStyles extends ShapeStyles {
    radius?: Value
}

export interface DecoratedPoint
    extends Point,
        PointStyles,
        DecoratedShape,
        LineStyles {
    type: ShapeType.point
}

export interface Line {
    points: Point[]
}

export interface LineStyles extends ShapeStyles {
    lineWidth?: Value
}

export interface DecoratedLine extends Line, LineStyles, DecoratedShape {
    type: ShapeType.line
    range: Range<number | string>
}

export interface Arc {
    x: Value
    y: Value
    start: Value
    end: Value
    radius: Value
}

export interface ArcStyles extends ShapeStyles {}

export interface DecoratedArc
    extends Arc,
        ArcStyles,
        DecoratedShape,
        LineStyles {
    type: ShapeType.arc
    direction: "clockwise" | "counter-clockwise"
}

interface PointConstructor extends Point, PointStyles, OrderStyle, LineStyles {}
interface LineConstructor extends Line, LineStyles, OrderStyle {
    range?: Range<number | string>
}
interface ArcConstructor extends Arc, ArcStyles, OrderStyle, LineStyles {
    direction?: "clockwise" | "counter-clockwise"
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

export type Lambda = (x: number) => { shapes: DecoratedShape[]; dx: number }

export type Range<T> = [T, T]
export type MultiRange<T> = Range<T> | Array<Range<T>>

export type Value = number | MultiRange<number>
