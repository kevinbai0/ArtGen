const example = ({ unwrap, rgba }) => {
    /** define constants */
    const constants = [
        2.689602099316258,
        2.711045926632344,
        2.0721756317448214,
        1.1136017709074095
    ]

    /** Functinos to calculate next iteration */
    const calcX = (x, y, c) =>
        Math.sin(3 * Math.sin(x) * Math.cos(c[0] * x - y * c[2])) +
        c[2] * Math.sin(0.3 * Math.cos(c[0] * x * c[3]))
    const calcY = (x,y,c) =>
        Math.sin(Math.PI * Math.cos(c[1] * x)) +
        c[3] * Math.sin((1 / Math.E) * c[1] * y)
  
    // our initial point
    const points = ArtGen.utils.generate(5, () =>
        ArtGen.utils.GenPoint([0, 0.1], [0, -0.1], { fill: rgba(0, 0, 0, 0.1), radius: 1 })
    )
  
    const draw = () =>
        [...Array(350)].reduce((accum, _, i) => {
            return accum.concat(
                points.map((point, p) => {
                    const x = unwrap(point.x)
                    const y = unwrap(point.y)
                    return point
                        .mutate({
                            x: calcX(x, y, constants),
                            y: calcY(x, y, constants),
                            fill: rgba(
                                Math.max(200 - x / 2, 0),
                                ((i * p) / (350 * 4)) * 250,
                                y * 200,
                                0.1
                            ),
                            zIndex: i * p
                        })
                        .clone({
                            x: 150 * x,
                            y: 150 * y
                        })
                })
            )
        }, [])
  
    return {
        draw,
        iterate: x => x + 1,
        endIf: duration => duration >= 10000
    }
}


const test = ({unwrap, rgba}) => {
    // define constants
    const constants = [
        2.553308700841444,
        1.3112688558630707,
        1.781073930670376,
        1.2974055728293994
    ]
    /*const constants = [
        unwrap([1,3]),
        unwrap([1,3]),
        unwrap([1,3]),
        unwrap([1,3])
    ]*/
    console.log(constants)

    // define helper functions
    const calcX = (x, y, c) =>
        Math.sin(2 * Math.sin(x) * Math.cos(c[0] * x - y * c[2])) +
        c[2] * Math.sin(1 * Math.cos(c[0] * x * c[3]))
    const calcY = (x, y, c) =>
        Math.sin(Math.PI * Math.cos(c[1] * x)) +
        c[3] * Math.sin((1 / Math.E) * c[1] * y)

    // init x,y values
    let x = 0.1, y = -0.1

    // Run every frame for animation
    const draw = value =>
        [...Array(1000)].map((_, i) => {
            x = calcX(x, y, constants)
            y = calcY(x, y, constants)
            const fill = rgba(
                Math.max(200 - x / 2, 0), // red
                (i / 1000) * 250, // green
                y * 200, // blue
                0.1 // alpha
            )

            return ArtGen.utils.GenPoint(x * 150, y * 150, {
                fill,
                zIndex: i,
                radius: 1
            })
        })

    return {
        draw,
        iterate: value => value + 1,
        endIf: duration => duration >= 10000
    }
}

const { GenPoint, GenLine, generate } = ArtGen.utils

function newFunction({ unwrap, rgba }) {
    const seed = 1.1718156807070783//unwrap([0,3])
    console.log(seed)
    const count = 50
    let points = generate(count, i => {
        return {
            x: unwrap([-500,500]),
            y: unwrap([-500,500])
        }
    })
    let lines = generate(count, i => {
        return GenLine([points[i]], {
            stroke: rgba(128, i / count * 255,255,0.01),
            lineWidth: 2,
            zIndex: i
        })
    })

    const draw = (value) => {
        points = points.map((point, i) => {
            const x = unwrap(point.x)
            const y = unwrap(point.y)
            const newX = Math.cos(x * x + y * Math.sqrt(2)) + Math.sin(seed * Math.pow(y, 2))
            return {
                x: newX,
                y: (unwrap([0,1]) < 0.5 ? 1 : -1) * Math.sqrt(4 - newX * newX)// Math.sin(y + x * Math.PI) + Math.cos(2 * Math.cos(x * y) * Math.pow(seed, 2))
            }
        })
        lines.forEach((line, i) => {
            const x = unwrap(points[i].x), y = unwrap(points[i].y)
            line.points.push({x: x * 250, y: y * 250})
            line.range = [line.points.length - 3, line.points.length - 1]
            line.stroke = rgba(line.stroke.r, line.stroke.g, value / 10, line.stroke.a)
        })

        
        return lines
    }

    return {
        draw,
        iterate: x => x + 1,
        endIf: duration => duration >= 10000
    }
}

const artgen = document.getElementById("artgen")
const drawEngine = new window.ArtGen.DrawEngine(newFunction, artgen)

let lastN = []

drawEngine.dataListener = (fps, duration) => {
    const div = document.getElementById("fps-indicator")

    if (div) {
        const fpsLabel = document.getElementById("fps-label")
        const durationLabel = document.getElementById("duration-label")
        lastN.push(fps)
        if (lastN.length > 50) lastN = lastN.slice(1)
        if (fpsLabel)
            fpsLabel.innerHTML =
                fps.toFixed(2) +
                "fps, avg: " +
                (
                    lastN.reduce((acc, num) => acc + num, 0) / lastN.length
                ).toFixed(0) +
                "fps"
        if (durationLabel) durationLabel.innerHTML = duration.toFixed(0) + "ms"
    }
}

// Button
const button = document.getElementById("start-button")
button.onclick = () => start()

button.className = "hidden"
setTimeout(() => start(), 1000)

function start() {
    drawEngine.start({
        duration: 10000
    })
    button.className = button.className + " hidden"
}
