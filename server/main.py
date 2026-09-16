import socketio
# socketio - handle live connections

sio = socketio.AsyncServer(async_mode="asgi")
messages_list = []

# environ - dictionary containing standard HTTP and connection metadata
#  about incoming client connection
@sio.event
async def connect(sid, environ):
    print(f"someone connected: {sid}")
    await sio.emit("welcome", {"msg": "welcome! u're connected"}, to=sid)
    await sio.emit("message:history", {"msgs": messages_list}, to=sid)
    
@sio.event
async def disconnect(sid, reason):
    print(f"someone disconnected: {sid}")

@sio.on('message:send')
async def handle_message_sent(sid, data):
    messages_list.append(data["text"])
    await sio.emit("message:new", {"text": data["text"]})

# visiting / directs user to index.html
app = socketio.ASGIApp(sio, static_files={"/": "public/"})