import express, { Express, Request, Response } from "express";

import dotenv from "dotenv";
import expressWs from "express-ws";
import { router as chessGameRouter } from "./webSockets/chessGames";

dotenv.config();

const { app, getWss, applyTo } = expressWs(express());

const port = process.env.PORT || 3000;

app.use("/ws-stuff", chessGameRouter);

app.get("/", (req: Request, res: Response) => {
  res.send("Home Server");
});

app.listen(port, () => {
  console.log(`[server]: Server is running at http://localhost:${port}`);
});
