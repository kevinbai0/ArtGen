import { Draw, DrawableFunction, Point } from "../types"
import { GenLine } from "../utils"

const linesGen: DrawableFunction = ({ unwrap }) => {
    const draw: Draw = (x: number) => {
        const points: Point[] = [
            {
                x: 0,
                y: 0
            },
            {
                x,
                y: [-512, 512]
            }
        ]
        const lines = [
            GenLine(points, {
                stroke: `rgba(${255 - x / 6}, 80, ${x / 6}, ${x / 1000})`
            }),
            GenLine(points, {
                stroke: `rgba(${255 - x / 6}, 80, ${x / 6}, ${x / 1000})`,
                zIndex: 1
            })
        ]
        return lines
    }
    return {
        draw,
        iterate: x => x + 1,
        endIf: duration => duration >= 10000
    }
}

export default linesGen
