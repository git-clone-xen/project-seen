let clearAt = null;   // the moment the canvas will clear
const clockTimer = document.getElementById("countdown");

// The server says "X seconds left" → work out when that is on this device
function setClearTime(secondsLeft) {
    clearAt = Date.now() + secondsLeft * 1000;   // Date.now() is in milliseconds
}

// Every second, update the text
setInterval(() => {
    
    if (clearAt === null) return;
    const secondsLeft = Math.max(0, Math.round((clearAt - Date.now()) / 1000));
    const minutes = Math.floor(secondsLeft / 60);
    const seconds = secondsLeft % 60;

    if (secondsLeft <= 5 && secondsLeft > 0) {
        clockTimer.classList.add("blink");
    } else {
        clockTimer.classList.remove("blink");
    }

    clockTimer.textContent = 
    `Cleaning up on asle Drawing Pad in ${minutes}:${String(seconds).padStart(2, '0')}`;}, 1000);