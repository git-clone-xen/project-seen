import socketio
# socketio - handle live connections

sio = socketio.AsyncServer(async_mode="asgi")

# environ - dictionary containing standard HTTP and connection metadata
#  about incoming client connection
@sio.event
async def connect(sid, environ):
    print(f"someone connected: {sid}")
    
@sio.event
async def disconnect(sid, reason):
    print(f"someone disconnected: {sid}")

# Drawing Events (page <-> server):
#   draw:line  page -> server -> everyone else   {from: {x, y}, to: {x, y}}
#   draw:dot   page -> server -> everyone else   {x, y}

# skip_sid - send to everyone but the sender
@sio.on("draw:line")
async def handle_draw_line(sid, data):
    await sio.emit("draw:line", data, skip_sid=sid)

@sio.on("draw:dot")
async def handle_draw_dot(sid, data):
    await sio.emit("draw:dot", data, skip_sid=sid)

# visiting / directs user to index.html
app = socketio.ASGIApp(sio, static_files={"/": "public/"})