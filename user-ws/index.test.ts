import { resolve } from 'bun';
import { describe, beforeAll, test, expect } from 'bun:test'
import { WebSocket, WebSocketServer } from 'ws';
const BACKEND_URL = "ws://localhost:9090";

describe("Chat Application", () => {
    test("Message sent from room one reaches another participant in room 1 ", async () => {
        const ws1 = new WebSocket(BACKEND_URL);
        const ws2 = new WebSocket(BACKEND_URL);

        await new Promise<void>((resolve, reject) => {
            let count = 0;
            ws1.onopen = () => {
                count = count + 1;
                if (count == 2) {
                    resolve()
                }
            }
            ws2.onopen = () => {
                count = count + 1
                if (count == 2) {
                    resolve()
                }
            }
            console.log("connected")
        })

        console.log("control flow - 1")

        ws1.send(JSON.stringify({
            type: 'join-room',
            room: 'Room 1'
        }))
        ws2.send(JSON.stringify({
            type: "join-room",
            room: "Room 1"
        }))
        console.log("control flow")
        await new Promise<void>((resolve) => {
            ws2.onmessage = ({data}) => {
                console.log("Data : ",data);
                const parsedData = JSON.parse(data.toString());;
                expect(parsedData.type).toBe('chat');
                expect(parsedData.message).toBe("Hi there");
                resolve();
            }
        ws1.send(JSON.stringify({
                type: 'chat',
                room: 'Room 1',
                message: "Hi there"
            }))
        })

    })
})