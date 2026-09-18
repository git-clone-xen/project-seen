import socketio
# socketio - handle live connections
import time

sio = socketio.AsyncServer(async_mode="asgi")

canvas_ops = []
CLEAR_INTERVAL = 3600

# environ - dictionary containing standard HTTP and connection metadata
#  about incoming client connection
@sio.event
async def connect(sid, environ):
    await sio.emit("draw:history", 
        {"ops": canvas_ops,
         "secondsLeft": seconds_until_clear(),
        }, to=sid)
    print(f"someone connected: {sid}")
    
@sio.event
async def disconnect(sid, reason):
    print(f"someone disconnected: {sid}")

# Drawing Events

# skip_sid - send to everyone but the sender
@sio.on("draw:line")
async def handle_draw_line(sid, data):
    canvas_ops.append({"type": "line", "from": data["from"], "to": data["to"]})
    await sio.emit("draw:line", data, skip_sid=sid)

@sio.on("draw:dot")
async def handle_draw_dot(sid, data):
    canvas_ops.append({"type": "dot", "point": data})
    await sio.emit("draw:dot", data, skip_sid=sid)

# Timer Events

# restart timer until next interval
async def clear_timer():
    while True:
        await sio.sleep(seconds_until_clear())
        canvas_ops.clear()
        await sio.emit("canvas:cleared", {"secondsLeft": seconds_until_clear()})
        print("canvas cleared", {"secondsLeft": seconds_until_clear()})

# start and run timer when server starts, until next clear interval
async def start_timer():
    sio.start_background_task(clear_timer)

def seconds_until_clear():
    now = time.time()                 
    next_clear = (now // CLEAR_INTERVAL + 1) * CLEAR_INTERVAL
    return next_clear - now

# visiting / directs user to index.html
app = socketio.ASGIApp(sio, static_files={"/": "public/"}, on_startup=start_timer)