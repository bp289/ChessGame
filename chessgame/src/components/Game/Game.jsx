import React from "react";
import Chessboard from "./Chessboard.jsx";
import TurnProvider from "../../Contexts/TurnContext.js";

export default function Game() {
  return (
    <>
      <TurnProvider>
        <Chessboard />
      </TurnProvider>
    </>
  );
}
