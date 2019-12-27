import circleArtGenerator from "../functions/circles"
import circlesGen2 from "../functions/circles2"
import linesGen from "../functions/lines"
import linesGen2 from "../functions/lines2"
import circlesGen3 from "../functions/circles3"
import particlesGen from "../functions/particles"
import particlesGen2 from "../functions/particles2"
import particlesGen3 from "../functions/particles3"
import circlesGen4 from "../functions/circles4"
import circlesGen5 from "../functions/circles5"
import linesGen3 from "../functions/lines3"
import particlesGen4 from "../functions/particles4"
import particlesGen5 from "../functions/particles5"
import linesGen4 from "../functions/lines4"
import linesGen5 from "../functions/lines5"
import linesGen6 from "../functions/lines6"
import linesGen7 from "../functions/lines7"
import particlesGen6 from "../functions/particles6"
import particlesGen7 from "../functions/particles7"
import particlesGen8 from "../functions/particles8"
import christmasGen from "../functions/christmas"
import christmasGen2 from "../functions/christmas2"
import linesGen8 from "../functions/lines8"

export const circles = circleArtGenerator({
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

export const circles2 = circlesGen2()

export const lines = linesGen()

export const lines2 = linesGen2()

export const circles3 = circlesGen3()

export const particles = particlesGen()

export const particles2 = particlesGen2()

export const particles3 = particlesGen3()

export const circles4 = circlesGen4()

export const circles5 = circlesGen5()

export const lines3 = linesGen3()

export const particles4 = particlesGen4()

export const particles5 = particlesGen5()

export const lines4 = linesGen4()

export const lines5 = linesGen5()

export const lines6 = linesGen6()

export const lines7 = linesGen7()

export const particles6 = particlesGen6()

export const particles7 = particlesGen7()

export const particles8 = particlesGen8()

export const christmas = christmasGen()

export const christmas2 = christmasGen2()

export const lines8 = linesGen8()
