const canvas = document.getElementById("pad");

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

// draw one tiny dot from last point
function drawDot(point) {
    ctx.beginPath();
    ctx.arc(point.x, point.y, 2, 0, Math.PI * 2);
    ctx.fillStyle = "#2f2d2a";
    ctx.fill();
}

// pen down
canvas.addEventListener("pointerdown", (event) => {
    drawing = true;
    last = toCanvasPoint(event);
    canvas.setPointerCapture(event.pointerId);   // keep drawing even if you slide off the canvas
    drawDot(last);
    socket.emit("draw:dot", last); 
});

// pen moves
canvas.addEventListener("pointermove", (event) => {
    if (!drawing) return;        // not pressed = just hovering, so do nothing
    const point = toCanvasPoint(event);
    drawLine(last, point);
    socket.emit("draw:line", { from: last, to: point }); 
    last = point;
});

// pen up
canvas.addEventListener("pointerup", () => { drawing = false; });
canvas.addEventListener("pointercancel", () => { drawing = false; });