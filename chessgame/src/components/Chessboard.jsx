import "./Chessboard.css";
import Tile from "./Tile.jsx";
import { useEffect, useState } from "react";
import { showMoves, legalMoves, getBoardDetails } from "../utils/chessUtils.js";
import { startBoard } from "../utils/chessBoardUtils.js";

export default function Chessboard() {
  const [board, setBoard] = useState(startBoard);
  const [selectedTile, setSelectedTile] = useState();

  const updateBoard = () => {
    legalMoves(board);
  };

  const selectTile = (tile) => {
    setSelectedTile(tile);
  };

  useEffect(() => {
    if (selectedTile) {
      updateBoard();
    }
  }, [selectedTile]);

  return (
    <div className="board">
      {board.map((e) => (
        <Tile tileData={e} selectTile={selectTile} updateBoard={updateBoard} />
      ))}
    </div>
  );
}
