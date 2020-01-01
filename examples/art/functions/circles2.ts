import { Draw, DrawableFunction } from "../../../src/types"
import { GenPoint } from "../../../src/utils"

const circlesGen2: DrawableFunction = ({ unwrap }) => {
    const stroke = (x: number) => {
        if ((Math.round(x * 10) / 10) % 1 === 0) {
            return [
                GenPoint([-10, 40], [-10, 40], {
                    radius: x * 10,
                    fill: `rgba(${x * 5}, 200, ${255 - x * 5}, 0.04)`
                })
            ]
        }
        return []
    }
    const draw: Draw = x => {
        if (x * 10 - 512 < 0) {
            return [
                GenPoint(x * 10 - 512, Math.sin(x * unwrap([45, 55])) * 512, {
                    radius: unwrap([30, 70]),
                    fill: `rgba(${255 - x * 5}, 200, ${x * 5}, ${0.2 -
                        x * 0.003})`,
                    zIndex: 1
                }),
                GenPoint(x * 15 - 512, Math.sin(x * unwrap([35, 45])) * 512, {
                    radius: unwrap([30, 50]),
                    fill: `rgba(${255 - x * 5}, 200, ${x * 5}, ${0.08 -
                        x * 0.01})`
                }),
                GenPoint(512 - x * 10, Math.sin(x * unwrap([45, 55])) * 512, {
                    radius: unwrap([30, 70]),
                    fill: `rgba(${255 - x * 5}, 200, ${x * 5}, ${0.2 -
                        x * 0.003})`,
                    zIndex: 1
                }),
                GenPoint(512 - x * 15, Math.sin(x * unwrap([35, 45]) * 512), {
                    radius: unwrap([30, 70]),
                    fill: `rgba(${255 - x * 5}, 200, ${x * 5}, ${0.08 -
                        x * 0.01})`
                }),
                ...stroke(x)
            ]
        }
        return []
    }

    return {
        draw,
        iterate: x => x + 0.1,
        endIf: duration => duration >= 10000
    }
}

export default circlesGen2
