import { findCellType } from "./startBoard";
export const showMovesOnBoard = (pieceLocations, selectedTile, board) => {
  const { normalMoves, attackMoves } = getMoves(pieceLocations, selectedTile);

  return board.map((tile) => {
    if (tile.value === selectedTile.value) {
      return {
        ...tile,
        cellState: "selected",
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
        if (attackMove?.x === tile.x && attackMove?.y === tile.y) {
          return {
            ...tile,
            cellState: "takeable",
          };
        }
      }
      return {
        ...tile,
        cellState: tile.cellState === "check" ? "check" : "neutral",
      };
    }
  });
};
export const getBoardAfterMove = (board, tileToMoveFrom, tileToMoveTo) => {
  const kingTileIndex = { white: 0, black: 0 };
  const newBoard = board.map((tile, index) => {
    if (tile.pieceOnTile.name === "king")
      kingTileIndex[tile.pieceOnTile.color] = index;

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
        cellState: "neutral",
      };
    }
    return {
      ...tile,
      cellState: "neutral",
    };
  });

  return {
    newBoard,
    takenPiece: tileToMoveTo.pieceOnTile.name ? tileToMoveTo.pieceOnTile : null,
    kingTileIndex,
  };
};

export const unSelect = (board) => {
  console.log("deselecting");
  return board.map((tile) => {
    return { ...tile, cellState: "neutral" };
  });
};

const getMoves = (pieceLocations, selectedTile) => {
  const { name, color } = selectedTile?.pieceOnTile;
  const { legalAttacks, legalMoves } = pieceLocations[color][name].find(
    (e) => e.currentlyAt.value === selectedTile.value
  );

  return { normalMoves: legalMoves, attackMoves: legalAttacks };
};
