# ArtGen

[![Build Status](https://travis-ci.com/kevinbai0/ArtGen.svg?branch=master)](https://travis-ci.com/kevinbai0/ArtGen) [![gzip size](https://img.badgesize.io/https://unpkg.com/artgenjs?compression=gzip)](http://img.badgesize.io/https://unpkg.com/artgenjs?compression=gzip) [![install size](https://packagephobia.now.sh/badge?p=artgenjs@1.0.9)](https://packagephobia.now.sh/result?p=artgenjs@1.0.9)

ArtGen is a library that's meant to provide an easy way for both developers and artists create visual generative art on the web by taking a declarative and partly functional approach that abstracts away the messy of the code.

The goal of ArtGen is to provide a lightweight and fast library. No dependencies were used to keep the final build as small as possible.

![Sample animation](https://media.giphy.com/media/hrvvcTTRcPOEM3QypY/giphy.gif)

Note: this project is currently still in development so the current release may be broken.

## What it looks like (in code)

```javascript

const example = ({unwrap, rgba}) => {
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
```

## Installation

If you’re using npm:

```bash
npm install artgenjs
```

or include it as a `script` in your HTML file:

```javascript
<script src="https://unpkg.com/artgenjs"></script>
```
