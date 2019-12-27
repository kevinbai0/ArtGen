import { Range, RGBA, Value, Color } from "./types"

export function updateShapes<T>(
    shapes: T[],
    callback: (shape: T, index: number) => any
) {
    shapes.forEach((shape, i) => {
        let obj = callback(shape, i)
        for (const key in obj) {
            ;(shape as any)[key] = obj[key]
        }
    })
}

export function generate<T>(count: number, callback: (index: number) => T) {
    return [...Array(count)].map((_, i) => callback(i))
}

export function addClassName(currentClassName: string, className: string) {
    return [
        ...currentClassName
            .trim()
            .split(" ")
            .filter(str => str !== className),
        className
    ].join(" ")
}

export function removeClassName(currentClassName: string, className: string) {
    return currentClassName
        .trim()
        .split(" ")
        .filter(str => str !== className)
        .join(" ")
}

export const rgba = (r: Value, g: Value, b: Value, a: Value): Color => {
    return {
        r: unwrap(r),
        g: unwrap(g),
        b: unwrap(b),
        a: unwrap(a)
    }
}

export const unwrap = (num: Value): number => {
    if (typeof num === "number") return num
    if (typeof num[0] !== "number") {
        const newRange = num as Array<Range<number>>
        let rI = Math.floor(Math.random() * num.length)
        return (
            Math.random() * (newRange[rI][1] - newRange[rI][0]) +
            newRange[rI][0]
        )
    }
    const newRange = num as Range<number>
    return Math.random() * (newRange[1] - newRange[0]) + newRange[0]
}

export const unwrapColor = (color: Color) => {
    if (typeof color === "string") return color
    return `rgba(${unwrap(color.r)}, ${unwrap(color.g)}, ${unwrap(
        color.b
    )}, ${unwrap(color.a)})`
}

export const withOpacity = (opacity: Value, color?: Color): Color => {
    if (!color) return ""
    if (typeof color === "string") return color
    const rgb = color as RGBA
    return rgba(rgb.r, rgb.g, rgb.b, opacity)
}
