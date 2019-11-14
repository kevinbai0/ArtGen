const artboard = <HTMLCanvasElement> document.getElementById("artboard");
var width = artboard.clientWidth * 2;
var height = artboard.clientHeight * 2;

type Lambda = (x: number) => number;

function setupDocument() {
    artboard.setAttribute("width", "" + width);
    artboard.setAttribute("height", "" + height);
}

const quadratic: Lambda = (x: number) => Math.sin(x);

function drawFunction(fun: (num: number) => number) {
    let ctx = artboard.getContext("2d");
    if (!ctx) return;
    let i = 0;
    ctx.lineWidth = 10;
    ctx.moveTo(0,0);
    let interval = setInterval(() => {
        i += 0.01;
        ctx!.lineTo(i * 50, 500 + 400 * fun(i));
        ctx!.stroke();
        if (i >= 10) clearInterval(interval);
    }, 5);
}
setupDocument();
drawFunction(quadratic);
console.log("DRAW");