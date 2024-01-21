const xAxis = ["a", "b", "c", "d", "e", "f", "g", "h"];
const backPieces = {
  a: "rook",
  b: "knight",
  c: "bishop",
  d: "queen",
  e: "king",
  f: "bishop",
  g: "knight",
  h: "rook",
};

export function findStyleClass(x, y) {
  return (x + y) % 2 === 0 ? "light" : "dark";
}

export function findStartPiece(tile) {
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
export const startBoard = () => {
  const board = [];
  for (let x = 1; x <= 8; x++) {
    for (let y = 8; y >= 1; y--) {
      board.push({
        value: `${xAxis[x - 1]}${y}`,
        styleClass: findStyleClass(x, y),
        pieceOnTile: findStartPiece(`${xAxis[x - 1]}${y}`),
        x: x,
        y: y,
      });
    }
  }
  return board;
};

export const showMovesOnBoard = (
  { pieceLocations, checks },
  selectedTile,
  board
) => {
  const normalMoves = getMoves(pieceLocations, selectedTile);
  const attackMoves = getAttacks(pieceLocations, selectedTile);

  return board.map((tile) => {
    if (tile.value === selectedTile.value) {
      return {
        ...tile,
        styleClass: `${findStyleClass(tile.x, tile.y)}-selected`,
      };
    } else {
      for (let normalMove of normalMoves) {
        if (normalMove.x === tile.x && normalMove.y === tile.y) {
          return {
            ...tile,
            styleClass: "movable",
          };
        }
      }
      for (let attackMove of attackMoves) {
        const { pieceUnderAttack } = attackMove;
        if (pieceUnderAttack?.x === tile.x && pieceUnderAttack?.y === tile.y) {
          return {
            ...tile,
            styleClass: "takeable",
          };
        }
      }
      return { ...tile, styleClass: findStyleClass(tile.x, tile.y) };
    }
  });
};

export const getBoardAfterMove = (board, tileToMoveFrom, tileToMoveTo) => {
  return board.map((tile) => {
    if (tileToMoveTo === tile && tileToMoveTo.styleClass === "movable") {
      return {
        ...tile,
        pieceOnTile: { ...tileToMoveFrom.pieceOnTile, firstMove: false },
        styleClass: findStyleClass(tile.x, tile.y),
      };
    } else if (tile.value === tileToMoveFrom.value) {
      return {
        ...tile,
        pieceOnTile: {},
        styleClass: findStyleClass(tile.x, tile.y),
      };
    } else if (
      tileToMoveTo === tile &&
      tileToMoveTo.styleClass === "takeable"
    ) {
      return {
        ...tile,
        pieceOnTile: { ...tileToMoveFrom.pieceOnTile, firstMove: false },
        styleClass: findStyleClass(tile.x, tile.y),
      };
    } else {
      return {
        ...tile,
        styleClass: findStyleClass(tile.x, tile.y),
      };
    }
  });
};

export const unSelect = (board) => {
  return board.map((tile) => {
    return { ...tile, styleClass: findStyleClass(tile.x, tile.y) };
  });
};

const getMoves = (pieceLocations, selectedTile) => {
  const color = selectedTile.pieceOnTile?.color;
  const name = selectedTile?.pieceOnTile.name;
  return pieceLocations[color][name].find(
    (e) => e.currentlyAt.value === selectedTile.value
  ).legalMoves;
};

const getAttacks = (pieceLocations, selectedTile) => {
  const color = selectedTile.pieceOnTile?.color;
  const name = selectedTile?.pieceOnTile.name;
  return pieceLocations[color][name].filter(
    (e) => e.currentlyAt.value === selectedTile.value
  )[0]?.legalAttacks;
};
