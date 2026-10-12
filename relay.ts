// Room relay: `bun relay.ts`. Clients connect to ws://host:8081/<room>; every message is fanned out to the room.
Bun.serve<string>({
  port: 8081,
  fetch(req, server) {
    const room = new URL(req.url).pathname
    return server.upgrade(req, { data: room }) ? undefined : new Response('WebSocket only', { status: 426 })
  },
  websocket: {
    open(ws) { ws.subscribe(ws.data) },
    message(ws, msg) { ws.publish(ws.data, msg) },
  },
})
