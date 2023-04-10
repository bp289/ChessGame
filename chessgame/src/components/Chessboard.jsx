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

  const updateBoard = (tile) => {
    setBoard(showMoves(currentLegalMoves, tile, board));
  };

  const selectTile = (tile) => {
    if (tile === selectedTile) {
      setSelectedTile();
      updateBoard();
    } else {
      setSelectedTile(tile);
      updateBoard(tile);
    }
  };

  // useEffect(() => {
  //   if (selectedTile) {
  //     console.log(selectedTile);
  //     updateBoard();
  //   }
  // }, [selectedTile]);

  useEffect(() => {}, [currentLegalMoves]);
  return (
    <div className="board">
      {board.map((e) => (
        <Tile tileData={e} selectTile={selectTile} updateBoard={updateBoard} />
      ))}
    </div>
  );
}
