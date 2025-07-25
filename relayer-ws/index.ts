import { WebSocketServer , WebSocket } from 'ws';

const wss = new WebSocketServer({ port: 9090 });

interface Room{
    sockets : WebSocket[]
}

const rooms: Record<string, Room> = {};

wss.on('connection', function connection(ws) {
  ws.on('error', console.error);

  ws.on('message', function message(data: string) {

  });
});