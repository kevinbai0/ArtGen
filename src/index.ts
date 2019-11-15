const artboard = <HTMLCanvasElement> document.getElementById("artboard");
var width = artboard.clientWidth * 3;
var height = artboard.clientHeight * 3;

type Lambda = (...x: number[]) => number;

function setupDocument() {
    artboard.setAttribute("width", "" + width);
    artboard.setAttribute("height", "" + height);
}

const quadratic: Lambda = (x: number) => Math.sin(x);

function drawFunction(fun: (num: number) => number) {
    let ctx = artboard.getContext("2d");
    if (!ctx) return;
    ctx.lineWidth = 5;
    ctx.lineJoin = "round";
    ctx.moveTo(0,0);
    requestAnimationFrame(() => draw(ctx!, fun, 0));
}
const draw = (ctx: CanvasRenderingContext2D, fun: Lambda, x: number) => {
    let newX = x * 50;
    let newY = 1000 + 700 * fun(x);
    ctx.moveTo(newX, newY);
    ctx!.ellipse(newX, newY, 2, 2, 0, 0, 2 * Math.PI);
    ctx!.stroke();
    if (x <= 50) {
        requestAnimationFrame(() => draw(ctx, fun, x + 0.1));
    }
}

setupDocument();
drawFunction(quadratic);