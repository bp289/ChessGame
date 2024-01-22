import "../../Styles/Chessboard.css";
import { useTurn } from "../../Contexts/TurnContext.js";
import Tile from "./Tile.jsx";
import { useState, useCallback, useEffect } from "react";
import { legalMoves } from "../../utils/moves/moveCalculations.js";
import { startBoard } from "../../utils/board/startBoard.js";

import {
  showMovesOnBoard,
  getBoardAfterMove,
  unSelect,
} from "../../utils/board/chessBoardUI.js";

export default function Chessboard() {
  const [turn, toggleTurn] = useTurn();
  const [board, setBoard] = useState(startBoard);
  const [currentLegalMoves, setCurrentLegalMoves] = useState(
    legalMoves([...board])
  );

  const [selectedTile, setSelectedTile] = useState();
  const [takenPieces, setTakenPieces] = useState({ white: [], black: [] });

  const updateBoardState = useCallback(
    (tile) => {
      return tile
        ? setBoard(showMovesOnBoard(currentLegalMoves, tile, board))
        : setBoard(unSelect(board));
    },
    [board, currentLegalMoves]
  );

  const handleSelectTile = useCallback(
    (tile) => {
      setSelectedTile((prev) => (prev?.value === tile.value ? null : tile));
      updateBoardState(tile);
    },
    [updateBoardState]
  );

  const handleDeSelect = useCallback(() => {
    setBoard(unSelect(board));
    setSelectedTile(null);
  }, [board]);

  const handlePieceMove = useCallback(
    (destinationTile) => {
      const { newBoard, takenPiece } = getBoardAfterMove(
        board,
        selectedTile,
        destinationTile
      );
      setBoard(newBoard);
      setCurrentLegalMoves(legalMoves([...newBoard]));
      setSelectedTile(null);
      toggleTurn();

      if (takenPiece) {
        takenPieces[takenPiece.color].push(takenPiece);
        setTakenPieces({ ...takenPieces });
      }
    },
    [board, selectedTile, toggleTurn, takenPieces]
  );

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
