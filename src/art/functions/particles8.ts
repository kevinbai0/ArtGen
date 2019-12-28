import { Lambda, Shape, RGBA, DrawableFunction } from "../../types"
import AnimatedPoint from "../../animations/AnimatedPoint"
import {
    unwrap as productionWrap,
    rgba as productionRGBA,
    generate,
    updateShapes
} from "../../utils"

const particlesGen8 = (
    unwrap = productionWrap,
    rgba = productionRGBA
): DrawableFunction => {
    const baseParticles = generate(20, i => {
        let th = (unwrap([0, 20]) / 20) * 2 * Math.PI
        return Shape.point({
            x: Math.cos(th) * 1,
            y: Math.sin(th) * 1,
            fill: rgba([255, 200], 0, 0, 0),
            radius: 1,
            stateIndex: i
        })
    })

    let numbers = generate(700, i => i)

    let animated: AnimatedPoint[] = []
    let counter = 0
    const lambda: Lambda = (x: number) => {
        let rand = unwrap([0, numbers.length - 1])
        x = rand
        delete numbers[rand]
        let residualParticles = baseParticles.reduce((accum, point) => {
            const color = rgba(
                [200, 255],
                [150, 220],
                [0, 1],
                unwrap([0.2, 0.7])
            ) as RGBA
            counter += 1
            accum.push(
                new AnimatedPoint({
                    ...point,
                    stroke: color,
                    fill: rgba(color.r, color.g, color.b, 0.07),
                    radius: 10,
                    stateIndex: undefined,
                    zIndex: counter
                })
            )
            return accum
        }, new Array<AnimatedPoint>())

        const separation = unwrap([0, 1])
        const radial = unwrap([5, 20])
        updateShapes(baseParticles, (point, i) => {
            const baseAngle = (i / 500) * 2 * Math.PI
            let theta = baseAngle + x * 2 + separation
            return {
                x: Math.sin(theta) * (x / 1.2 + radial),
                y: Math.cos(theta) * (x / 1.2 + radial)
            }
        })

        animated = animated.filter(val => !val.ended).concat(residualParticles)
        return animated.map(point => point.update(0.05))
    }

    return {
        lambda,
        iterate: x => x + 1.5,
        endIf: duration => duration >= 10000
    }
}

export default particlesGen8
