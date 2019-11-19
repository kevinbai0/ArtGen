export interface Point {
    x: number,
    y: number
}

export interface DecoratedPoint extends Point {
    color?: string,
    radius?: number
}

export type Lambda = (x: number) => DecoratedPoint[];

export type Range = [number, number];