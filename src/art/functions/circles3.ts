import { Lambda, Shape, DrawableFunction } from "../../types"

const circlesGen3: DrawableFunction = () => {
    const lambda: Lambda = (x: number) => {
        const shifted = x * 2
        const normalized = Math.sin((x * Math.PI) / 512) //-Math.pow(x - 256, 2) / (256 * 256) + 1;
        const circles = [
            Shape.point({
                x: shifted - 600,
                y: Math.sin(shifted * 20) * 200 * (1 - normalized),
                stroke: `rgba(0,0,0,${normalized})`,
                radius: 100,
                lineWidth: 2,
                fill: "rgba(0,0,0,0.01)"
            }),
            Shape.point({
                x: shifted + 1 - 600,
                y: Math.sin((shifted + 1) * 20) * 200 * (1 - normalized),
                stroke: `rgba(0,0,0,${normalized})`,
                radius: 100,
                lineWidth: 2,
                fill: "rgba(50,50,50,0.01)"
            })
        ]

        let radius = Math.max(normalized, 0) * 800
        const edgeCircles = [
            Shape.point({
                x: shifted - 512,
                y: 512 + (radius * 3) / 4,
                radius,
                stroke: "rgba(0,0,0,1)",
                fill: "rgba(50,50,50,0.001)",
                lineWidth: 1
            }),
            Shape.point({
                x: shifted - 512,
                y: -512 - (radius * 3) / 4,
                radius,
                stroke: "rgba(0,0,0,1)",
                fill: "rgba(50,50,50,0.001)",
                lineWidth: 1
            })
        ]
        return [...circles, ...edgeCircles]
    }

    return {
        lambda,
        iterate: x => x + 1,
        endIf: duration => duration >= 10000
    }
}

export default circlesGen3