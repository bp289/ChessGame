import "./Chessboard.css";
import Tile from "./Tile.jsx";
import { useEffect, useState } from "react";
import {
  showMoves,
  legalMoves,
  pieceMove,
  unSelect,
} from "../utils/chessUtils.js";
import { startBoard } from "../utils/chessBoardUtils.js";

export default function Chessboard() {
  const [board, setBoard] = useState(startBoard);
  const [currentLegalMoves, setCurrentLegalMoves] = useState(
    legalMoves([...board])
  );
  const [selectedTile, setSelectedTile] = useState();

  const updateBoard = (tile) => {
    setBoard(showMoves(currentLegalMoves, tile, board));
  };

  const selectTile = (tile) => {
    if (tile === selectedTile) {
      setSelectedTile();
      setBoard(board);
    } else {
      setSelectedTile(tile);
      updateBoard(tile);
    }
  };

  const deSelect = () => {
    setBoard(unSelect(board));
  };

  const handlePieceMove = (tile) => {
    const newBoard = pieceMove(board, selectedTile, tile);
    setBoard(newBoard);
    setCurrentLegalMoves(legalMoves([...newBoard]));
  };

  useEffect(() => {}, [currentLegalMoves]);
  return (
    <div className="board">
      {board.map((e) => (
        <Tile
          tileData={e}
          selectTile={selectTile}
          updateBoard={updateBoard}
          selectedTile={selectedTile}
          movePiece={handlePieceMove}
          deSelect={deSelect}
        />
      ))}
    </div>
  );
}
