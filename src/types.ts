import { unwrap, rgba } from "./utils"

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
    clone: (keys?: Partial<this>) => this
    mutate: (keys?: Partial<this>) => this
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
    clone: (keys?: Partial<this>) => this
    mutate: (keys?: Partial<this>) => this
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
    clone: (keys?: Partial<this>) => this
    mutate: (keys?: Partial<this>) => this
}

interface PointConstructor extends PointStyles, OrderStyle, LineStyles {}
interface LineConstructor extends Line, LineStyles, OrderStyle {
    range?: Range<number | string>
}
interface ArcConstructor extends Arc, ArcStyles, OrderStyle, LineStyles {
    direction?: "clockwise" | "counter-clockwise"
}

export const Shape = {
    point: (x: number, y: number, point?: PointConstructor): DecoratedPoint => {
        return GenPoint(x, y, point)
    },
    line: (line: LineConstructor): DecoratedLine => {
        return {
            ...line,
            range: line.range || ["0%", "100%"],
            type: ShapeType.line,
            zIndex: line.zIndex || 0,
            ...(line.stateIndex && { stateIndex: line.stateIndex }),
            clone(keys) {
                return clone(this, keys)
            },
            mutate(keys) {
                return mutate(this, keys)
            }
        }
    },
    arc: (arc: ArcConstructor): DecoratedArc => {
        return {
            ...arc,
            type: ShapeType.arc,
            zIndex: arc.zIndex || 0,
            ...(arc.stateIndex && { stateIndex: arc.stateIndex }),
            direction: arc.direction || "clockwise",
            clone(keys) {
                return clone(this, keys)
            },
            mutate(keys) {
                return mutate(this, keys)
            }
        }
    }
}

export type Lambda = (x: number, count: number) => DecoratedShape[]

/**
 * On Iteration
 */
export interface LambdaConfig {
    iterate(prevX: number, timeLapsed: number): number
    endIf(duration: number, x: number): boolean
}

export interface DrawableFunctionConfig extends LambdaConfig {
    lambda: Lambda
}

export interface Injectables {
    unwrap: typeof unwrap
    rgba: typeof rgba
}

export type DrawableFunction = (modules: Injectables) => DrawableFunctionConfig

export type Range<T> = [T, T]
export type MultiRange<T> = Range<T> | Array<Range<T>>

export type Value = number | MultiRange<number>

function clone<T extends DecoratedShape>(obj: T, keys?: Partial<T>) {
    const copy = Object.assign({}, obj) as T
    for (const key in keys) {
        copy[key] = keys[key] as T[Extract<keyof T, string>]
    }
    return copy
}

function mutate<T>(obj: T, keys?: Partial<T>) {
    if (!keys) return obj
    for (const key in keys) {
        obj[key] = keys[key] as T[Extract<keyof T, string>]
    }
    return obj
}

const defaultPoint: DecoratedPoint = {
    type: ShapeType.point,
    x: 0,
    y: 0,
    zIndex: 1,
    clone(keys) {
        return clone(this, keys)
    },
    mutate(keys) {
        return mutate(this, keys)
    }
}

export function GenPoint(
    x: Value,
    y: Value,
    values?: Partial<DecoratedPoint>
): DecoratedPoint {
    return defaultPoint.clone(Object.assign({ x, y }, values))
}
