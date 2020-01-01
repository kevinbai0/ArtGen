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

export interface Modifiable<T> {
    readonly clone: (key?: Partial<T>) => T
    readonly mutate: (key?: Partial<T>) => T
}

export interface DecoratedShape extends ShapeStyles {
    readonly type: ShapeType
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
        Modifiable<DecoratedPoint>,
        PointStyles,
        LineStyles,
        DecoratedShape {}

export interface Line {
    points: Point[]
}

export interface LineStyles extends ShapeStyles {
    lineWidth?: Value
}

export interface DecoratedLine
    extends Line,
        LineStyles,
        DecoratedShape,
        Modifiable<DecoratedLine> {
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
        Modifiable<DecoratedArc>,
        LineStyles {
    direction: "clockwise" | "counter-clockwise"
}

export type Draw = (x: number, count: number) => DecoratedShape[]

/**
 * On Iteration
 */
export interface DrawConfig {
    iterate(prevX: number, timeLapsed: number): number
    endIf(duration: number, x: number): boolean
}

export interface DrawableFunctionConfig extends DrawConfig {
    draw: Draw
}

export interface Injectables {
    unwrap: typeof unwrap
    rgba: typeof rgba
}

export type DrawableFunction = (modules: Injectables) => DrawableFunctionConfig

export type Range<T> = [T, T]
export type MultiRange<T> = Range<T> | Array<Range<T>>

export type Value = number | MultiRange<number>
