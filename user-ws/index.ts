import { WebSocketServer , WebSocket as WebSocketWS } from 'ws';

const wss = new WebSocketServer({ port: 9092 });

interface Room{
    sockets : WebSocketWS[]
}

const rooms: Record<string, Room> = {};

const RELAYER_URL = "ws://localhost:9090";

const relayerSocket = new WebSocket(RELAYER_URL);

relayerSocket.onmessage = ({data}) =>{
     const parsedData = JSON.parse(data);

    if (parsedData.type == 'chat'){
        const room = parsedData.room;
        rooms[room]?.sockets.map(socket => socket.send(data));
    }
}

wss.on('connection', function connection(ws) {
  ws.on('error', console.error);

  ws.on('message', function message(data: string) {
    const parsedData = JSON.parse(data);
        if (parsedData.type == 'join-room'){
        const room = parsedData.room;    
        if (!rooms[room]){
            rooms[room] = {
                sockets:[]
            }
        }
        rooms[room].sockets.push(ws);
    }
    if (parsedData.type == 'chat'){
   relayerSocket.send(data);}
  });
});