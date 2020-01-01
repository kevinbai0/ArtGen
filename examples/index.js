const artgen = document.getElementById("artgen")

console.log(window.ArtGen)



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
  

const drawEngine = new window.ArtGen.DrawEngine(example, artgen)

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
