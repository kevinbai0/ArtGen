/*import { Color, Value } from "./types"
import { rgba, unwrap } from "./utils"

export enum ShapeType {
    point = "point",
    line = "line",
    arc = "arc"
}

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

interface Decorated {
    readonly type: ShapeType
    readonly fill?: Color
    readonly stroke?: Color
    readonly zIndex: number
    readonly stateIndex?: number
    withFill(color?: Color): Shape
    withStroke(stroke?: Color): Shape
    withZIndex(value: number): Shape
    withStateIndex(state?: number): Shape
}

interface IPoint {
    readonly x: Value
    readonly y: Value
    readonly radius: Value
    atLocation(x: number, y: number): IPoint
    withRadius(radius: Value): IPoint
}

class Shape implements Decorated {
    readonly type: ShapeType
    fill?: Color
    stroke?: Color
    zIndex: number = 0
    stateIndex?: number

    constructor(
        shapeType: ShapeType,
        fill?: Color,
        stroke?: Color,
        zIndex: number = 0,
        stateIndex?: number
    ) {
        this.type = shapeType
        this.fill = fill
        this.stroke = stroke
        this.zIndex = zIndex
        this.stateIndex = stateIndex
    }

    withFill(color?: Color) {
        this.fill = color
        return this
    }

    withStroke(color?: Color) {
        this.stroke = color
        return this
    }

    withZIndex(value: number) {
        this.zIndex = value
        return this
    }

    withStateIndex(value?: number) {
        this.stateIndex = value
        return this
    }
}

class Point extends Shape implements IPoint {
    x: Value
    y: Value
    radius: Value

    constructor(x: Value, y: Value) {
        super(ShapeType.point)
        this.x = x
        this.y = y
        this.radius = 1
    }

    atLocation(x: Value, y: Value): Point {
        this.x = x
        this.y = y
        return this
    }

    withRadius(value: Value): Point {
        this.radius = value
        return this
    }
}

const p1 = new Point(2, 3)
    .withFill(rgba(0, 0, 0, 1))
    .withRadius(2)
    .withStroke(rgba(0, 0, 0, 1))
*/

import { Value, ShapeType, ShapeStyles } from "./types"
import { generate, updateShapes } from "./utils"

export interface DecoratedShape extends ShapeStyles {
    type: ShapeType
    zIndex: number
    stateIndex?: number
    clone: (keys?: Partial<this>) => this
    mutate: (keys?: Partial<this>) => this
}

export interface Point {
    x: Value
    y: Value
}

export interface PointStyles extends ShapeStyles {
    radius?: Value
}
/*
export interface DecoratedPoint
    extends Point,
        PointStyles,
        DecoratedShape,
        LineStyles {
    type: ShapeType.point
}

export interface LineStyles extends ShapeStyles {
    lineWidth?: Value
}

const defaultPoint: DecoratedPoint = {
    type: ShapeType.point,
    x: 0,
    y: 0,
    zIndex: 1,
    clone(keys) {
        const copy = Object.assign({}, this)
        for (const key in keys) {
            const iKey = key as DecoratedPoint[Extract<DecoratedPoint, string>]
            copy[iKey] = keys[iKey]
        }
        return copy
    },
    mutate(keys) {
        if (!keys) return this
        for (const key in keys) {
            const iKey = key as DecoratedPoint[Extract<DecoratedPoint, string>]
            this[iKey] = keys[iKey]
        }
        return this
    }
}

function GenPoint(
    x: Value,
    y: Value,
    values?: Partial<DecoratedPoint>
): DecoratedPoint {
    return defaultPoint.clone(Object.assign({ x, y }, values))
}
*/
