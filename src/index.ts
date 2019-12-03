import DrawEngine from "./drawing/DrawEngine";
import State from "./state/State";
import { addClassName, removeClassName } from "./state/utils";
import { circles, circles2, lines, lines2 } from "./art";

const artboard = <HTMLCanvasElement> document.getElementById("artboard");

let drawEngine = new DrawEngine(lines2, artboard);

drawEngine.dataListener = (fps: number, duration: number) => {
    let div = document.getElementById("fps-indicator");
    if (div) {
        div.innerHTML = fps.toFixed(2) + "fps\n" + duration.toFixed(0) + "ms";
    }
}

const button = <HTMLButtonElement> document.getElementById("start-button");

const buttonState = new State(false);
buttonState.bind("listener", newValue => {
    if (newValue) {
        drawEngine.start({
            duration: 10000
        });
        button.className = addClassName(button.className, "hidden");
    }
});

button.onclick = _ => buttonState.update(!buttonState.value);

button.className = addClassName(button.className, "hidden");
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
setTimeout(() => buttonState.update(true), 1000);
