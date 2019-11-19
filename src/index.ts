import DrawEngine from "./DrawEngine";
import circleArtGenerator from "./functions/circles";

const artboard = <HTMLCanvasElement> document.getElementById("artboard");
var width = artboard.clientWidth * 3;
var height = artboard.clientHeight * 3;

function setupDocument() {
    artboard.setAttribute("width", "" + width);
    artboard.setAttribute("height", "" + height);
}

setupDocument();

let circles = circleArtGenerator({
    colorRange: {
        g: [100,255],
        a: [0.2,1]
    },
    radius: [0,30]
});

let drawEngine = new DrawEngine(circles, artboard);

drawEngine.setContextSettings((ctx) => {
    ctx.lineWidth = 5;
    ctx.lineJoin = "round";
    ctx.moveTo(0,0);
});

drawEngine.start({
    duration: 10000
});

drawEngine.dataListener = (fps: number, duration: number) => {
    let div = document.getElementById("fps-indicator");
    if (div) {
        div.innerHTML = fps.toFixed(2) + "fps\n" + duration.toFixed(0) + "ms";
    }
}