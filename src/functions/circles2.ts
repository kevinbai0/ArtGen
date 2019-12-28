import { Lambda, Shape, DrawableFunction } from "../types"
import { unwrap as productionUnwrap } from "../utils"

const circlesGen2 = (unwrap = productionUnwrap): DrawableFunction => {
    const stroke = (x: number) => {
        if ((Math.round(x * 10) / 10) % 1 === 0) {
            return [
                Shape.point({
                    x: unwrap([-10, 40]),
                    y: unwrap([-10, 40]),
                    radius: x * 10,
                    fill: `rgba(${x * 5}, 200, ${255 - x * 5}, 0.04)`
                })
            ]
        }
        return []
    }
    const lambda: Lambda = x => {
        if (x * 10 - 512 < 0) {
            return [
                Shape.point({
                    x: x * 10 - 512,
                    y: Math.sin(x * unwrap([45, 55])) * 512,
                    radius: unwrap([30, 70]),
                    fill: `rgba(${255 - x * 5}, 200, ${x * 5}, ${0.2 -
                        x * 0.003})`,
                    zIndex: 1
                }),
                Shape.point({
                    x: x * 15 - 512,
                    y: Math.sin(x * unwrap([35, 45])) * 512,
                    radius: unwrap([30, 50]),
                    fill: `rgba(${255 - x * 5}, 200, ${x * 5}, ${0.08 -
                        x * 0.01})`
                }),
                Shape.point({
                    x: 512 - x * 10,
                    y: Math.sin(x * unwrap([45, 55])) * 512,
                    radius: unwrap([30, 70]),
                    fill: `rgba(${255 - x * 5}, 200, ${x * 5}, ${0.2 -
                        x * 0.003})`,
                    zIndex: 1
                }),
                Shape.point({
                    x: 512 - x * 15,
                    y: Math.sin(x * unwrap([35, 45])) * 512,
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
        lambda,
        iterate: x => x + 0.1,
        endIf: duration => duration >= 10000
    }
}

export default circlesGen2
