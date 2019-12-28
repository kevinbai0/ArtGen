import { Lambda, Shape, DrawableFunction } from "../../types"
import { unwrap as productionUnwrap } from "../../utils"

const linesGen = (unwrap = productionUnwrap): DrawableFunction => {
    const lambda: Lambda = (x: number) => {
        const lines = [
            Shape.line({
                points: [
                    {
                        x: 0,
                        y: 0
                    },
                    {
                        x,
                        y: unwrap([-512, 512])
                    }
                ],
                stroke: `rgba(${255 - x / 6}, 80, ${x / 6}, ${x / 1000})`
            }),
            Shape.line({
                points: [
                    {
                        x: 0,
                        y: 0
                    },
                    {
                        x: -x,
                        y: unwrap([-512, 512])
                    }
                ],
                stroke: `rgba(${255 - x / 6}, 80, ${x / 6}, ${x / 1000})`,
                zIndex: 1
            })
        ]
        return lines
    }
    return {
        lambda,
        iterate: x => x + 1,
        endIf: duration => duration >= 10000
    }
}

export default linesGen
