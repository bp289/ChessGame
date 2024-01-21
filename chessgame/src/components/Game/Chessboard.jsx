import "../../Styles/Chessboard.css";
import { useTurn } from "../../Contexts/TurnContext.js";
import Tile from "./Tile.jsx";
import { useEffect, useState, useMemo } from "react";
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
  const [currentLegalMoves, setCurrentLegalMoves] = useState();

  useMemo(
    () => setCurrentLegalMoves(legalMoves([...board])),
    [setCurrentLegalMoves]
  );

  const [selectedTile, setSelectedTile] = useState();

  const updateBoard = (tile) => {
    setBoard(showMovesOnBoard(currentLegalMoves, tile, board));
  };

  const handleSelectTile = (tile) => {
    setSelectedTile((prev) => {
      if (prev?.value === tile.value) {
        return undefined;
      } else {
        return tile;
      }
    });
  };

  const deSelect = () => {
    setBoard(unSelect(board));
  };

  const handlePieceMove = (destinationTile) => {
    const newBoard = getBoardAfterMove(board, selectedTile, destinationTile);
    setBoard(newBoard);
    setCurrentLegalMoves(legalMoves([...newBoard]));
    toggleTurn();
  };

  useEffect(() => {
    const updateBoard = (tile) => {
      console.warn("updating board, the selected tile is", tile);
      setBoard(showMovesOnBoard(currentLegalMoves, tile, board));
    };
    if (selectedTile) {
      updateBoard(selectedTile);
    } else {
      setBoard(unSelect(board));
    }
  }, [selectedTile]);

  return (
    <>
      <h2>turn:{turn}</h2>
      <div className="board">
        {board.map((e) => (
          <Tile
            key={e.value}
            tileData={e}
            selectTile={handleSelectTile}
            updateBoard={updateBoard}
            selectedTile={selectedTile}
            movePiece={handlePieceMove}
            deSelect={deSelect}
          />
        ))}
      </div>
    </>
  );
}
