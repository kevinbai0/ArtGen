import DrawEngine from "./drawing/DrawEngine"
import Animated from "./animations/Animated"
import AnimatedPoint from "./animations/AnimatedPoint"
import AnimatedLine from "./animations/AnimatedLine"
import AnimatedCircle from "./animations/AnimatedCircle"

import * as art from "./art"
import * as utils from "./utils"

import * as asdf from "./point"

export {
    art,
    DrawEngine,
    utils,
    Animated,
    AnimatedLine,
    AnimatedPoint,
    AnimatedCircle
}

/*const points = utils.generate(2, i =>
    asdf.GenPoint(1, 1, {
        fill: "#232323"
    })
)

console.log(points)
utils.updateShapes(points, (shape, i) => {
    return {
        x: 2
    }
})

console.log(points)*/
