import circleArtGenerator from "./circles"
import circlesGen2 from "./circles2"
import linesGen from "./lines"
import linesGen2 from "./lines2"
import circlesGen3 from "./circles3"
import particlesGen from "./particles"
import particlesGen2 from "./particles2"
import particlesGen3 from "./particles3"
import circlesGen4 from "./circles4"
import circlesGen5 from "./circles5"
import linesGen3 from "./lines3"
import particlesGen4 from "./particles4"
import particlesGen5 from "./particles5"
import linesGen4 from "./lines4"
import linesGen5 from "./lines5"
import linesGen6 from "./lines6"
import linesGen7 from "./lines7"
import particlesGen6 from "./particles6"
import particlesGen7 from "./particles7"
import particlesGen8 from "./particles8"
import christmasGen from "./christmas"
import christmasGen2 from "./christmas2"
import linesGen8 from "./lines8"
import particlesGen9 from "./particles9"
import particlesGen10 from "./particles10"
import particlesGen11 from "./particles11"
import example from "./example"

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
    particlesGen11,
    christmasGen,
    christmasGen2,
    example
}
