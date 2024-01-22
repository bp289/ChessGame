import "../../Styles/Chessboard.css";
import { useTurn } from "../../Contexts/TurnContext.js";
export default function Tile({
  tileData,
  selectTile,
  selectedTile,
  updateBoard,
  movePiece,
  deSelect,
}) {
  const [turn, toggleTurn] = useTurn();

  const selectCurrentTile = (tileData) => {
    const {
      pieceOnTile: { name, color },
      cellState,
    } = tileData;
    if (name && color === turn) {
      selectTile(tileData);
    }
    if (selectedTile) {
      if (cellState === "movable" || cellState === "takeable") {
        movePiece(tileData);
      }

      if (
        cellState === "selected" ||
        (cellState === "neutral" && color !== turn)
      ) {
        deSelect();
      }
    }
  };
  return (
    <div
      className={tileData.cellType}
      data-state={tileData.cellState}
      onClick={() => {
        selectCurrentTile(tileData);
      }}>
      {tileData.pieceOnTile.name && (
        <img
          className="chess-piece"
          src={require(`../../Assets/${tileData.pieceOnTile.color}-${tileData.pieceOnTile.name}.svg.png`)}
          alt={`${tileData.pieceOnTile.name}-${tileData.pieceOnTile.color}`}
        />
      )}
    </div>
  );
}
