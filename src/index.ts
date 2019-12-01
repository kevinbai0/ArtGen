import circleArtGenerator from "./functions/circles";
import DrawEngine from "./DrawEngine";

const artboard = <HTMLCanvasElement> document.getElementById("artboard");

let circles = circleArtGenerator({
    colorRange: {
        r: [[0, 100], [200, 255]],
        g: [100,255],
        b: [[0,0], [100, 150]],
        a: [0.5,0.8]
    },
    radius: [[2,5], [2,5], [3,7], [8,20]]
});

let drawEngine = new DrawEngine(circles, artboard);

drawEngine.dataListener = (fps: number, duration: number) => {
    let div = document.getElementById("fps-indicator");
    if (div) {
        div.innerHTML = fps.toFixed(2) + "fps\n" + duration.toFixed(0) + "ms";
    }
}

class State<T> {
    private _value: T
    private _next: T | null;
    private _boundElements: Map<any, (newValue: T, oldValue: T) => void> = new Map();

    constructor(value: T) {
        this._value = value;
        this._next = null;
    }

    get value() {
        return this._value;
    }

    update(value: T) {
        this._next = value;
        this._onUpdate();
    }

    _onUpdate() {
        if (this._next !== null) {
            this._value = this._next;
            this._boundElements.forEach(fun => fun(this._value, this._next!));
            this._next = null;
        }
    }

    bind(hash: any, onUpdate: (newValue: T, oldValue: T) => void) {
        this._boundElements.set(hash, onUpdate);
    }
    removeBinding(hash: any) {
        this._boundElements.delete(hash);
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

function addClassName(currentClassName: string, className: string) {
    let search = currentClassName.search(new RegExp(`(?:^|\W)${className}(?:$|\W)`));
    if (search === -1) {
        return `${currentClassName} ${className}`;
    }
    return currentClassName;
}

function removeClassName(currentClassName: string, className: string) {
    return currentClassName.replace(new RegExp(`(?:^|\W)${className}(?:$|\W)`), "");
}
