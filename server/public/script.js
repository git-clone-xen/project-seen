const socket = io(); 

// when user connects
socket.on("connect", () => {
    document.getElementById("status").textContent = "Welcome!";
});

socket.on("disconnect", () => {
    document.getElementById("status").textContent = "lost you for a second there.. reconnecting!";
});

socket.on("message:new", (data) => {
    displayMsgList(data.text);
});

socket.on("draw:line", (data) => {
    drawLine(data.from, data.to);
});

socket.on("draw:dot", (data) => {
    drawDot(data);
});