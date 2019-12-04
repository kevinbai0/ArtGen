import DrawEngine from "./drawing/DrawEngine";
import State from "./state/State";
import { addClassName, removeClassName } from "./state/utils";
import { circles, circles2, lines, lines2, particles } from "./art";

const artboard = <HTMLCanvasElement> document.getElementById("artboard");

let drawEngine = new DrawEngine(particles, artboard);

drawEngine.dataListener = (fps: number, duration: number) => {
    const div = document.getElementById("fps-indicator");
    
    if (div) {
        const fpsLabel = document.getElementById("fps-label");
        const durationLabel = document.getElementById("duration-label");
        if (fpsLabel) fpsLabel.innerHTML = fps.toFixed(2) + "fps";
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
