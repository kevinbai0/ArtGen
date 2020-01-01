import { Draw, DrawableFunction } from "../../../src/types"
import { GenPoint } from "../../../src/utils"

const circlesGen3: DrawableFunction = () => {
    const draw: Draw = (x: number) => {
        const shifted = x * 2
        const normalized = Math.sin((x * Math.PI) / 512) //-Math.pow(x - 256, 2) / (256 * 256) + 1;
        const circles = [
            GenPoint(
                shifted - 600,
                Math.sin(shifted * 20) * 200 * (1 - normalized),
                {
                    stroke: `rgba(0,0,0,${normalized})`,
                    radius: 100,
                    lineWidth: 2,
                    fill: "rgba(0,0,0,0.01)"
                }
            ),
            GenPoint(
                shifted + 1 - 600,
                Math.sin((shifted + 1) * 20) * 200 * (1 - normalized),
                {
                    stroke: `rgba(0,0,0,${normalized})`,
                    radius: 100,
                    lineWidth: 2,
                    fill: "rgba(50,50,50,0.01)"
                }
            )
        ]

        let radius = Math.max(normalized, 0) * 800
        const edgeCircles = [
            GenPoint(shifted - 512, 512 + (radius * 3) / 4, {
                radius,
                stroke: "rgba(0,0,0,1)",
                fill: "rgba(50,50,50,0.001)",
                lineWidth: 1
            }),
            GenPoint(shifted - 512, -512 - (radius * 3) / 4, {
                radius,
                stroke: "rgba(0,0,0,1)",
                fill: "rgba(50,50,50,0.001)",
                lineWidth: 1
            })
        ]
        return [...circles, ...edgeCircles]
    }

    return {
        draw,
        iterate: x => x + 1,
        endIf: duration => duration >= 10000
    }
}

export default circlesGen3
