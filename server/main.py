import socketio
# socketio - handle live cconnections

sio = socketio.AsyncServer(async_mode="asgi")

# visiting / directs user to index.html
app = socketio.ASGIApp(sio, static_files={"/": "public/index.html"})