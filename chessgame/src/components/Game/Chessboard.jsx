import "../../Styles/Chessboard.css";
import { useTurn } from "../../Contexts/TurnContext.js";
import Tile from "./Tile.jsx";
import { useEffect, useState, useCallback } from "react";
import { legalMoves } from "../../utils/moves/chessUtils.js";
import {
  startBoard,
  showMovesOnBoard,
  getBoardAfterMove,
  unSelect,
} from "../../utils/board/chessBoardUtils.js";

export default function Chessboard() {
  const [turn, toggleTurn] = useTurn();
  const [board, setBoard] = useState(startBoard);
  const [currentLegalMoves, setCurrentLegalMoves] = useState(
    legalMoves([...board])
  );

  const [selectedTile, setSelectedTile] = useState();

  const updateBoardState = (tile) =>
    tile
      ? setBoard(showMovesOnBoard(currentLegalMoves, tile, board))
      : setBoard(unSelect(board));

  const handleSelectTile = (tile) => {
    setSelectedTile((prev) => (prev?.value === tile.value ? null : tile));
    updateBoardState(tile);
  };

  const handleDeSelect = useCallback(() => {
    // setSelectedTile(null);
    setBoard(unSelect(board));
  }, [board]);

  const handlePieceMove = (destinationTile) => {
    const newBoard = getBoardAfterMove(board, selectedTile, destinationTile);
    setBoard(newBoard);
    setCurrentLegalMoves(legalMoves([...newBoard]));
    toggleTurn();
  };

  return (
    <>
      <h2>turn:{turn}</h2>
      <div className="board">
        {board.map((e) => (
          <Tile
            key={e.value}
            tileData={e}
            selectTile={handleSelectTile}
            selectedTile={selectedTile}
            movePiece={handlePieceMove}
            deSelect={handleDeSelect}
          />
        ))}
      </div>
    </>
  );
}
