import { Draw, MultiRange, DrawableFunction } from "../types"
import { GenPoint } from "../utils"

type MultiNumberRange = MultiRange<number>

export interface CirclesConfig {
    colorRange?: {
        r?: MultiNumberRange
        g?: MultiNumberRange
        b?: MultiNumberRange
        a?: MultiNumberRange
    }
    radius?: MultiNumberRange
}

const circleArtGenerator = (config?: CirclesConfig): DrawableFunction => ({
    unwrap
}) => {
    const rangeR = (config && config.colorRange && config.colorRange.r) || [
        0,
        0
    ]
    const rangeG = (config && config.colorRange && config.colorRange.g) || [
        0,
        0
    ]
    const rangeB = (config && config.colorRange && config.colorRange.b) || [
        0,
        0
    ]
    const rangeA = (config && config.colorRange && config.colorRange.a) || [
        1,
        1
    ]

    const colorRandomizer = (
        r: MultiNumberRange = rangeR,
        g: MultiNumberRange = rangeG,
        b: MultiNumberRange = rangeB,
        a: MultiNumberRange = rangeA
    ): string => {
        return `
            rgba(${unwrap(r)}, ${unwrap(g)},
                ${unwrap(b)}, ${unwrap(a)})
        `
    }

    const radiusRandomizer = (
        r: MultiNumberRange = (config && config.radius) || [5, 5]
    ): number => {
        return unwrap(r)
    }
    const circles: Draw = (x: number) => {
        const r = x
        const points = []
        let max = 4 * r
        if (max < 5) max = 5
        for (let i = 0; i < max; ++i) {
            const y = unwrap([-r, r])
            const newX =
                (unwrap([0, 1]) > 0.5 ? -1 : 1) * Math.sqrt(r * r - y * y)

            points.push(
                GenPoint(newX * 20 + r * 5, y * 20 + r * 5, {
                    radius: radiusRandomizer(),
                    fill: colorRandomizer()
                })
            )
        }
        return points
    }
    return {
        draw: circles,
        iterate: (x): number => x + 0.1,
        endIf: (duration): boolean => duration >= 10000
    }
}

export default circleArtGenerator
