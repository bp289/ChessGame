import express, { Express, Request, Response, Router } from "express";
import expressWs, { WebsocketMethod } from "express-ws";
import webSocket from "ws";

interface Rooms {
  [key: string]: webSocket[];
}

interface RoomData {
  [key: string]: string;
}
export const router = express.Router();

export const mountChessWs = () => {
  const rooms: Rooms = {};
  const roomData: RoomData = {};
  router.ws("/game", (ws: webSocket, req: Request) => {
    console.log("socket", req.query);

    const roomId = req.query.roomId! as string;

    if (!rooms[roomId]) {
      rooms[roomId] = [];
      roomData[roomId] = "";
    }

    if (rooms[roomId].length < 2) {
      console.log(`New WebSocket connection to room "${roomId}"`);
      rooms[roomId].push(ws);
    }

    ws.on("message", function (msg: string) {
      console.log(`said:${msg}`);
      roomData[roomId] = msg;
      broadCast(rooms[roomId], `you said:${msg}`, ws);
      console.log(roomData[roomId]);
    });

    ws.on("close", () => {
      const index: number = rooms[roomId].indexOf(ws);
      if (index !== -1) {
        rooms[roomId].splice(index, 1);
        console.log(`Connection closed in room "${roomId}, index ${index}"`);
        if (!rooms[roomId].length) {
          delete rooms[roomId];
          delete roomData[roomId];
        }
      }
    });
  });
};

const broadCast = (room: webSocket[], message: string, ws: webSocket) => {
  room.forEach((client: webSocket) => {
    if (client != ws && client.readyState === client.OPEN) {
      client.send(message);
    }
  });
};
