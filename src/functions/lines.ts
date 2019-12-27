import { Lambda, Shape } from "../types"

const linesGen = () => {
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
                        y: Math.random() * 1024 - 512
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
                        y: Math.random() * 1024 - 512
                    }
                ],
                stroke: `rgba(${255 - x / 6}, 80, ${x / 6}, ${x / 1000})`,
                zIndex: 1
            })
        ]
        return {
            shapes: lines,
            dx: 1
        }
    }
    return lambda
}

export default linesGen
