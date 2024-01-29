import { xAxis, backPieces } from "../constants/startConstants";

export function findCellType(x, y) {
  return (x + y) % 2 === 0 ? "light" : "dark";
}

function findStartPiece(tile) {
  switch (tile[1]) {
    case "2":
      return { color: "white", name: "pawn", firstMove: true };
    case "7":
      return { color: "black", name: "pawn", firstMove: true };
    case "1":
      return { color: "white", name: `${backPieces[tile[0]]}` };
    case "8":
      return { color: "black", name: `${backPieces[tile[0]]}` };
    default:
      return {};
  }
}

// y is backwards because the dom travels down
export const initializeBoard = () => {
  const board = [];
  for (let x = 1; x <= 8; x++) {
    for (let y = 8; y >= 1; y--) {
      board.push({
        value: `${xAxis[x - 1]}${y}`,
        cellState: "neutral",
        cellType: findCellType(x, y),
        pieceOnTile: findStartPiece(`${xAxis[x - 1]}${y}`),
        x: x,
        y: y,
      });
    }
  }
  return board;
};
