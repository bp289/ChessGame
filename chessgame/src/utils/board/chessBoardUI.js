import { findCellType } from "./startBoard";
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
        cellState: `selected`,
      };
    } else {
      for (let normalMove of normalMoves) {
        if (normalMove.x === tile.x && normalMove.y === tile.y) {
          return {
            ...tile,
            cellState: "movable",
          };
        }
      }
      for (let attackMove of attackMoves) {
        const { pieceUnderAttack } = attackMove;
        if (pieceUnderAttack?.x === tile.x && pieceUnderAttack?.y === tile.y) {
          return {
            ...tile,
            cellState: "takeable",
          };
        }
      }
      return { ...tile, cellState: `neutral` };
    }
  });
};
export const getBoardAfterMove = (board, tileToMoveFrom, tileToMoveTo) => {
  const newBoard = board.map((tile) => {
    // console.log(tileToMoveTo === tile, tile);
    if (tileToMoveTo.value === tile.value) {
      if (
        tileToMoveTo.cellState === "movable" ||
        tileToMoveTo.cellState === "takeable"
      ) {
        return {
          ...tile,
          pieceOnTile: { ...tileToMoveFrom.pieceOnTile, firstMove: false },
          cellState: "neutral",
        };
      }
    } else if (tile.value === tileToMoveFrom.value) {
      return {
        ...tile,
        pieceOnTile: {},
        cellState: findCellType(tile.x, tile.y),
      };
    } else {
      return {
        ...tile,
        cellState: "neutral",
      };
    }
  });

  return {
    newBoard,
    takenPiece: tileToMoveTo.pieceOnTile.name ? tileToMoveTo.pieceOnTile : null,
  };
};

export const unSelect = (board) => {
  console.log("deselecting");
  return board.map((tile) => {
    return { ...tile, cellState: "neutral" };
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
