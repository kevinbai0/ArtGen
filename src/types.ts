export enum ShapeType {
    point = "point"
}

export interface ShapeStyles {
    fill?: Color
    stroke?: Color
}

export interface DecoratedShape extends ShapeStyles {
    type: ShapeType
}

export type Color = string;

export interface Point {
    x: number,
    y: number
}

export interface PointStyles extends ShapeStyles {
    radius?: number
}

export interface DecoratedPoint extends Point, PointStyles, DecoratedShape {}

export const Shape = {
    point: (point: Point & PointStyles): DecoratedPoint => {
        return {
            ...point,
            type: ShapeType.point
        }
    },
}

export type Lambda = (x: number) => DecoratedShape[];

export type Range = [number, number];
export type MultiRange = Range | Array<Range>;