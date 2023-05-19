import "../../Styles/Chessboard.css";
import { useTurn } from "../../Contexts/TurnContext.js";
import Tile from "./Tile.jsx";
import { useEffect, useState } from "react";
import {
  showLegalMoves,
  legalMoves,
  getBoardAfterMove,
  unSelect,
} from "../../utils/chessUtils.js";
import { startBoard } from "../../utils/chessBoardUtils.js";

export default function Chessboard() {
  const [turn, toggleTurn] = useTurn();

  const [board, setBoard] = useState(startBoard);
  const [currentLegalMoves, setCurrentLegalMoves] = useState(
    legalMoves([...board])
  );
  const [selectedTile, setSelectedTile] = useState();

  const updateBoard = (tile) => {
    setBoard(showLegalMoves(currentLegalMoves, tile, board));
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
  };

  useEffect(() => {
    const updateBoard = (tile) => {
      console.log("updating board, the selected tile is", tile);
      setBoard(showLegalMoves(currentLegalMoves, tile, board));
    };
    if (selectedTile) {
      updateBoard(selectedTile);
    } else {
      setBoard(unSelect(board));
    }
  }, [selectedTile]);

  console.log(turn);
  return (
    <>
      <h2>turn:{turn}</h2>
      <button onClick={toggleTurn}>toggle turn</button>

      <div className="board">
        {board.map((e) => (
          <Tile
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
