import socketio
# socketio - handle live connections

sio = socketio.AsyncServer(async_mode="asgi")

# environ - dictionary containing standard HTTP and connection metadata
#  about incoming client connection
@sio.event
async def connect(sid, environ):
    print(f"someone connected: {sid}")
    await sio.emit("welcome", {"msg": "welcome! u're connected"}, to=sid)

@sio.event
async def disconnect(sid, reason):
    print(f"someone disconnected: {sid}")

# visiting / directs user to index.html
app = socketio.ASGIApp(sio, static_files={"/": "public/index.html"})