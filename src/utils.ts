import {
    Range,
    RGBA,
    Value,
    Color,
    Point,
    DecoratedLine,
    DecoratedPoint,
    DecoratedArc,
    ShapeType
} from "./types"

export function updateShapes<T>(
    shapes: T[],
    callback: (shape: T, index: number) => Partial<T>
): void {
    shapes.forEach((shape, i) => {
        const obj = callback(shape, i)
        for (const key in obj) {
            shape[key] = obj[key] as T[Extract<keyof T, string>]
        }
    })
}

export function generate<T>(
    count: number,
    callback: (index: number) => T
): T[] {
    return [...Array(count)].map((_, i) => callback(i))
}

export const unwrap = (num: Value): number => {
    if (typeof num === "number") return num
    if (typeof num[0] !== "number") {
        const newRange = num as Array<Range<number>>
        const rI = Math.floor(Math.random() * num.length)
        return (
            Math.random() * (newRange[rI][1] - newRange[rI][0]) +
            newRange[rI][0]
        )
    }
    const newRange = num as Range<number>
    return Math.random() * (newRange[1] - newRange[0]) + newRange[0]
}

export const unwrapColor = (color: Color): string => {
    if (typeof color === "string") return color
    return `rgba(${unwrap(color.r)}, ${unwrap(color.g)}, ${unwrap(
        color.b
    )}, ${unwrap(color.a)})`
}

export const rgba = (r: Value, g: Value, b: Value, a: Value): Color => {
    return {
        r: unwrap(r),
        g: unwrap(g),
        b: unwrap(b),
        a: unwrap(a)
    }
}

export const withOpacity = (opacity: Value, color?: Color): Color => {
    if (!color) return ""
    if (typeof color === "string") return color
    const rgb = color as RGBA
    return rgba(rgb.r, rgb.g, rgb.b, opacity)
}

function clone<T>(obj: T, keys?: Partial<T>): T {
    const copy = Object.assign({}, obj) as T
    for (const key in keys) {
        copy[key] = keys[key] as T[Extract<keyof T, string>]
    }
    return copy
}

function mutate<T>(obj: T, keys?: Partial<T>): T {
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
    zIndex: 0,
    clone(keys) {
        return clone(this, keys)
    },
    mutate(keys) {
        return mutate(this, keys)
    }
}

const defaultLine: DecoratedLine = {
    type: ShapeType.line,
    points: [],
    zIndex: 0,
    range: ["0%", "100%"],
    clone(keys) {
        return clone(this, keys)
    },
    mutate(keys) {
        return clone(this, keys)
    }
}

const defaultArc: DecoratedArc = {
    type: ShapeType.arc,
    x: 0,
    y: 0,
    radius: 1,
    zIndex: 0,
    start: 0,
    end: 2 * Math.PI,
    direction: "clockwise",
    clone(keys) {
        return clone(this, keys)
    },
    mutate(keys) {
        return clone(this, keys)
    }
}

export function GenPoint(
    x: Value,
    y: Value,
    values?: Partial<DecoratedPoint>
): DecoratedPoint {
    return defaultPoint.clone(Object.assign({ x, y }, values))
}

export function GenLine(
    points: Point[],
    values?: Partial<DecoratedLine>
): DecoratedLine {
    return defaultLine.clone(Object.assign({ points }, values))
}

export function GenArc(
    x: Value,
    y: Value,
    radius: Value,
    values?: Partial<DecoratedArc>
): DecoratedArc {
    return defaultArc.clone(Object.assign({ x, y, radius }, values))
}
