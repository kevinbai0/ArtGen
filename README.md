# artgen.js

ArtGen is a library that's meant to provide an easy way for both developers and artists create visual generative art on the web by taking a declarative and partly functional approach that abstracts away the messy of the code.

The goal of ArtGen is to provide a lightweight and fast library. No dependencies were used to keep the final build as small as possible.

## What it looks like (in code)

```javascript
const drawFunction = () => {
    // define constants
    const constants = [
        2.689602099316258,
        2.711045926632344,
        2.0721756317448214,
        1.1136017709074095
    ]

    // define helper functions
    const calcX = (x, y, c) =>
        Math.sin(3 * Math.sin(x) * Math.cos(c[0] * x - y * c[2])) +
        c[2] * Math.sin(0.3 * Math.cos(c[0] * x * c[3]))
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

            return Shape.point({
                x: x * 150,
                y: y * 150,
                fill,
                zIndex: i,
                radius: 1
            })
        })

    return {
        lambda: draw,
        // iterate calculates the next value
        iterate: value => value + 1,
        // end if will determine when animation ends
        endIf: duration => duration >= 10000
    }
}
```

## Installation

If you’re using npm:

```bash
npm install artgenjs
```

Note: this project is currently still in development so the current release may be broken