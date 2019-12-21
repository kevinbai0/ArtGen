import DrawEngine from "./drawing/DrawEngine";
import State from "./state/State";
import { addClassName, removeClassName } from "./state/utils";
import { circles, circles2, lines, lines2, circles3, particles, particles2, particles3, circles4, circles5, lines3, particles4, particles5, lines4, lines5, lines6, lines7 } from "./art";

const artgen = <HTMLDivElement> document.getElementById("artgen");

let drawEngine = new DrawEngine(lines7, artgen);

let lastN: number[] = [];

drawEngine.dataListener = (fps: number, duration: number) => {
    const div = document.getElementById("fps-indicator");
    
    if (div) {
        const fpsLabel = document.getElementById("fps-label");
        const durationLabel = document.getElementById("duration-label");
        lastN.push(fps);
        if (lastN.length > 50) lastN = lastN.slice(1);
        if (fpsLabel) fpsLabel.innerHTML = fps.toFixed(2) + "fps, avg: " + (lastN.reduce((acc, num) => acc + num, 0) / lastN.length).toFixed(0) + "fps";
        if (durationLabel) durationLabel.innerHTML = duration.toFixed(0) + "ms";
    }
}

// Button
const button = <HTMLButtonElement> document.getElementById("start-button");

const buttonState = new State(false);
buttonState.bind("listener", newValue => {
    if (newValue) {
        drawEngine.start({
            duration: 10000,
        });
        button.className = addClassName(button.className, "hidden");
    }
});

button.onclick = _ => buttonState.update(!buttonState.value);


button.className="hidden";

setTimeout(() => buttonState.update(true), 1000);


/*
setTimeout(() => {
    button.className = addClassName(button.className, "hover");
    setTimeout(() => {
        button.className = removeClassName(addClassName(button.className, "hidden"), "hover");
        setTimeout(() => {
            buttonState.update(true);
        }, 50);
    }, 100)
}, 1000)
*/
