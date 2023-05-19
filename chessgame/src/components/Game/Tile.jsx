import "../../Styles/Chessboard.css";
import { useTurn } from "../../Contexts/TurnContext.js";
export default function Tile({
  tileData,
  selectTile,
  selectedTile,
  movePiece,
  deSelect,
}) {
  const selectCurrentTile = (tileData) => {
    if (tileData.pieceOnTile.name) {
      selectTile(tileData);
    }
    if (
      selectedTile &&
      !tileData.pieceOnTile.name &&
      tileData.styleClass === "movable"
    ) {
      movePiece(tileData);
    }
    if (
      selectedTile &&
      !tileData.styleClass === "movable" &&
      !tileData.styleClass === "selected"
    ) {
      deSelect();
    }
  };
  return (
    <div
      className={tileData.styleClass}
      onClick={() => {
        selectCurrentTile(tileData);
      }}
      onDragEnter={() => {
        console.log("MouseEnter");
      }}
    >
      {tileData.pieceOnTile.name && (
        <img
          src={require(`../../Assets/${tileData.pieceOnTile.color}-${tileData.pieceOnTile.name}.svg.png`)}
          alt={`${tileData.pieceOnTile.name}-${tileData.pieceOnTile.color}`}
        />
      )}
    </div>
  );
}
