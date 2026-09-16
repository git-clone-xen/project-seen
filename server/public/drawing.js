const canvas = document.getElementById("pad");
const clearBtn = document.getElementById("clear-btn");

// drawing pen
const ctx = canvas.getContext("2d");   

// pen specs
ctx.lineWidth = 4;
ctx.lineCap = "round";                 
ctx.strokeStyle = "#2f2d2a";           

let drawing = false;   // is the finger/mouse currently pressed?
let last = null;       // where the pen was a moment ago

// screen position, whatever the screen size
function toCanvasPoint(event) {
    const rect = canvas.getBoundingClientRect();   // where the canvas is on screen, and its size
    return {
        x: (event.clientX - rect.left) * (canvas.width / rect.width),
        y: (event.clientY - rect.top) * (canvas.height / rect.height),
    };
}

// draw one tiny line from one point to another
function drawLine(from, to) {
    ctx.beginPath();
    ctx.moveTo(from.x, from.y);
    ctx.lineTo(to.x, to.y);
    ctx.stroke();
}

// pen down
canvas.addEventListener("pointerdown", (event) => {
    drawing = true;
    last = toCanvasPoint(event);
    canvas.setPointerCapture(event.pointerId);   // keep drawing even if you slide off the canvas
});

// pen moves
canvas.addEventListener("pointermove", (event) => {
    if (!drawing) return;        // not pressed = just hovering, so do nothing
    const point = toCanvasPoint(event);
    drawLine(last, point);
    last = point;
});

// pen up
canvas.addEventListener("pointerup", () => { drawing = false; });
canvas.addEventListener("pointercancel", () => { drawing = false; });

// clear canvas
clearBtn.addEventListener("pointerdown", () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
});