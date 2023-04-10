import "./Chessboard.css";
export default function tile({ tileData, selectTile }) {
  const selectCurrentTile = (tileData) => {
    if (tileData.pieceOnTile) {
      selectTile(tileData);
    }
  };
  return (
    <>
      <span
        className={tileData.styleClass}
        onMouseDown={() => {
          console.log("mousedown");
          selectCurrentTile(tileData);
        }}
      >
        {tileData.pieceOnTile.name && (
          <img
            height="20px"
            src="https://www.pngfind.com/pngs/m/142-1422303_chess-pawn-png-image-chess-pieces-pawn-png.png"
          ></img>
        )}

        {tileData.pieceOnTile.name}
      </span>
    </>
  );
}
