const socket = io(); 
const list = document.getElementById("message-list");
const input = document.getElementById("message-input");
const sendBtn = document.getElementById("send-btn");

// when user connects
socket.on("connect", () => {
    document.getElementById("status").textContent = "connected!";
});

// welcome message
socket.on("welcome", (data) => {
    document.getElementById("welcome-msg").textContent = data.msg;
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

sendBtn.addEventListener("click", () => {
    socket.emit("message:send", { text: input.value });
    input.value = ""; // Clear input after sending
});

function displayMsgList(text) {
    const item = document.createElement("li"); 
    item.textContent = text; 
    list.appendChild(item); 
}