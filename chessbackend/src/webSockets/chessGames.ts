import express, { Express, Request, Response, Router } from "express";
import expressWs from "express-ws";
export const router = express.Router() as expressWs.Router;

router.ws("/echo", (ws, req) => {
  ws.on("message", function (msg) {
    ws.send(msg);
  });
});
