import "./Chessboard.css";
export default function tile({ tileData, selectTile }) {
  return (
    <>
      <span
        className={tileData.styleClass}
        onClick={() => {
          if ("name" in tileData.pieceOnTile) {
            selectTile(tileData);
          }
        }}
      >
        {tileData.pieceOnTile.name}
      </span>
    </>
  );
}
