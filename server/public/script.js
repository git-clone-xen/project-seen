const socket = io(); 
const list = document.getElementById("message-list");
const input = document.getElementById("message-input");
const sendBtn = document.getElementById("send-btn");

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

socket.on("message:history", (data) => {
    for (const text of data.msgs) {
        displayMsgList(text);
    }
});
