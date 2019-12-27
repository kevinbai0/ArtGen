const artgen = document.getElementById("artgen");

let drawEngine = new ArtGen.DrawEngine(ArtGen.art.christmas2, artgen);

let lastN = [];

drawEngine.dataListener = (fps, duration) => {
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
const button = document.getElementById("start-button");

const buttonState = new ArtGen.State(false);
buttonState.bind("listener", newValue => {
    if (newValue) {
        drawEngine.start({
            duration: 10000,
        });
        button.className = ArtGen.utils.addClassName(button.className, "hidden");
    }
});

button.onclick = _ => buttonState.update(!buttonState.value);

button.className="hidden";

setTimeout(() => buttonState.update(true), 1000);