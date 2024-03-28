import express, { Express, Request, Response } from "express";

import dotenv from "dotenv";
import expressWs from "express-ws";
import {
  router as chessGameRouter,
  mountChessWs,
} from "./webSockets/chessGames";

const port = process.env.PORT || 3000;
dotenv.config();

const createApp = () => {
  const { app, getWss, applyTo } = expressWs(express());
  mountChessWs();
  app.use("/ws-stuff", chessGameRouter);
  app.get("/", (req: Request, res: Response) => {
    res.send("Welcome");
  });
  return app;
};
const main = () => {
  const app = createApp();
  app.listen(port, () => {
    console.log(`[server]: Server is running at http://localhost:${port}`);
  });
};

main();
