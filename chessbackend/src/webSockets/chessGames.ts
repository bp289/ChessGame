import express, { Express, Request, Response, Router } from "express";
import expressWs, { WebsocketMethod } from "express-ws";
import webSocket from "ws";

interface Rooms {
  [key: string]: webSocket[];
}
export const router = express.Router();

const rooms: Rooms = {};

const broadCast = (roomId: string, message: string, ws: webSocket) => {
  rooms[roomId].forEach((client: webSocket) => {
    if (client != ws && client.readyState === client.OPEN) {
      client.send(message);
    }
  });
};

export const mountChessWs = () => {
  router.ws("/game", (ws: webSocket, req: Request) => {
    console.log("socket", req.query);

    const roomId = req.query.roomId! as string;

    if (!rooms[roomId]) {
      rooms[roomId] = [];
    }

    console.log(`New WebSocket connection to room "${roomId}"`);
    rooms[roomId].push(ws);

    ws.on("message", function (msg: string) {
      console.log(`said:${msg}`);
      broadCast(roomId, `you said:${msg}`, ws);
    });

    ws.on("close", () => {
      const index: number = rooms[roomId].indexOf(ws);
      if (index !== -1) {
        rooms[roomId].splice(index, 1);
        console.log(`Connection closed in room "${roomId}"`);
      }
    });
  });
};
