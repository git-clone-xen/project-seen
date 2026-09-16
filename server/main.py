import socketio
# socketio - handle live connections

sio = socketio.AsyncServer(async_mode="asgi")

canvas_ops = []

# environ - dictionary containing standard HTTP and connection metadata
#  about incoming client connection
@sio.event
async def connect(sid, environ):
    await sio.emit("draw:history", {"ops": canvas_ops}, to=sid)
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

# Canvas Events

@sio.on("canvas:clear")
async def handle_clear_canvas(sid):
    canvas_ops.clear()
    await sio.emit("canvas:cleared")

# visiting / directs user to index.html
app = socketio.ASGIApp(sio, static_files={"/": "public/"})