import { resolve } from 'bun';
import { describe, beforeAll, test } from 'bun:test'
import { WebSocket, WebSocketServer } from 'ws';
const BACKEND_URL = "ws://localhost:8080";

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
        })


        ws1.send(JSON.stringify({
            type: 'join-room',
            room: 'Room 1'
        }))
        ws1.send(JSON.stringify({
            type: 'join-room',
            room: 'Room 1'
        }))

    })
})