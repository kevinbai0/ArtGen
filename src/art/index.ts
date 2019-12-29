import circleArtGenerator from "./functions/circles"
import circlesGen2 from "./functions/circles2"
import linesGen from "./functions/lines"
import linesGen2 from "./functions/lines2"
import circlesGen3 from "./functions/circles3"
import particlesGen from "./functions/particles"
import particlesGen2 from "./functions/particles2"
import particlesGen3 from "./functions/particles3"
import circlesGen4 from "./functions/circles4"
import circlesGen5 from "./functions/circles5"
import linesGen3 from "./functions/lines3"
import particlesGen4 from "./functions/particles4"
import particlesGen5 from "./functions/particles5"
import linesGen4 from "./functions/lines4"
import linesGen5 from "./functions/lines5"
import linesGen6 from "./functions/lines6"
import linesGen7 from "./functions/lines7"
import particlesGen6 from "./functions/particles6"
import particlesGen7 from "./functions/particles7"
import particlesGen8 from "./functions/particles8"
import christmasGen from "./functions/christmas"
import christmasGen2 from "./functions/christmas2"
import linesGen8 from "./functions/lines8"
import particlesGen9 from "./functions/particles9"
import particlesGen10 from "./functions/particles10"

const circlesGen = circleArtGenerator({
    colorRange: {
        r: [
            [0, 100],
            [200, 255]
        ],
        g: [100, 255],
        b: [
            [0, 0],
            [100, 150]
        ],
        a: [0.5, 0.8]
    },
    radius: [
        [2, 5],
        [2, 5],
        [3, 7],
        [8, 20]
    ]
})

export {
    circlesGen,
    circlesGen2,
    circlesGen3,
    circlesGen4,
    circlesGen5,
    linesGen,
    linesGen2,
    linesGen3,
    linesGen4,
    linesGen5,
    linesGen6,
    linesGen7,
    linesGen8,
    particlesGen,
    particlesGen2,
    particlesGen3,
    particlesGen4,
    particlesGen5,
    particlesGen6,
    particlesGen7,
    particlesGen8,
    particlesGen9,
    particlesGen10,
    christmasGen,
    christmasGen2
}
