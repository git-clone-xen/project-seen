const socket = io(); 

// when user connects
socket.on("connect", () => {
    document.getElementById("status").textContent = "Welcome!";
});

socket.on("disconnect", () => {
    document.getElementById("status").textContent = "lost you for a second there.. reconnecting!";
});

socket.on("draw:line", (data) => {
    drawLine(data.from, data.to);
});

socket.on("draw:dot", (data) => {
    drawDot(data);
});

socket.on("draw:history", (data) => {
    setClearTime(data.secondsLeft);
    // clear canvas first
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    for (const op of data.ops) {
        if (op.type === "line") {
            drawLine(op.from, op.to);
        }
        else if (op.type === "dot") {
            drawDot(op.point);
        }
    }
});

socket.on("canvas:cleared", (data) => {
    setClearTime(data.secondsLeft);
    ctx.clearRect(0, 0, canvas.width, canvas.height);
});