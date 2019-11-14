var width = document.getElementById("artboard").clientWidth;
var height = document.getElementById("artboard").clientHeight;

function setupDocument() {
    let artboard = document.getElementById("artboard");
    artboard.setAttribute("width", width * 2);
    artboard.setAttribute("height", height * 2);
    console.log(width, height);
}

const quadratic = (x) => Math.sin(x);

function drawFunction(fun) {
    let artboard = document.getElementById("artboard");
    let ctx = artboard.getContext("2d");
    
    let i = 0;
    ctx.lineWidth = 10;
    ctx.moveTo(0,0);
    let interval = setInterval(() => {
        i += 0.01;
        ctx.lineTo(i * 50, 500 + 400 * fun(i));
        ctx.stroke();
        if (i >= 500) {
            console.log(interval);
            clearInterval(interval);
        }
    }, 5);
}
setupDocument();
drawFunction(quadratic);