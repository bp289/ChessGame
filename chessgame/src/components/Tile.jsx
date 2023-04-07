import "./Chessboard.css";
export default function tile({ tileData, selectTile }) {
  return (
    <>
      <span
        className={tileData.styleClass}
        onClick={() => {
          if ("piece" in tileData.pieceOnTile) {
            console.log("clicked");
            selectTile(tileData);
          }
        }}
      >
        {tileData.pieceOnTile.piece}
      </span>
    </>
  );
}
