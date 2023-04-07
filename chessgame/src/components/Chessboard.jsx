import "./Chessboard.css";
import Tile from "./Tile.jsx";
import { useEffect, useState } from "react";
import { showMoves, legalMoves, getBoardDetails } from "../utils/chessUtils.js";
import { startBoard } from "../utils/chessBoardUtils.js";

export default function Chessboard() {
  const [board, setBoard] = useState(startBoard);
  const [currentLegalMoves, setcurrentLegalMoves] = useState(
    legalMoves([...board])
  );
  const [selectedTile, setSelectedTile] = useState();

  const updateBoard = () => {
    setBoard(showMoves(currentLegalMoves, selectedTile, board));
  };

  const selectTile = (tile) => {
    setSelectedTile(tile);
  };

  useEffect(() => {
    if (selectedTile) {
      updateBoard();
    }
  }, [selectedTile]);

  useEffect(() => {
    console.log(currentLegalMoves);
  }, [currentLegalMoves]);
  return (
    <div className="board">
      {board.map((e) => (
        <Tile tileData={e} selectTile={selectTile} updateBoard={updateBoard} />
      ))}
    </div>
  );
}
