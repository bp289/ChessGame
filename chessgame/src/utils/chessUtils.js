import { findStyleClass } from "./chessBoardUtils";
import { moveMap } from "./pieceMoves";

export const showLegalMoves = (moves, selectedTile, board) => {
  const currentMoves = moves[selectedTile.pieceOnTile?.color][
    selectedTile?.pieceOnTile.name
  ].filter((e) => e.currentlyAt.value === selectedTile.value)[0].legalMoves;

  const attackMoves = moves[selectedTile.pieceOnTile?.color][
    selectedTile?.pieceOnTile.name
  ].filter((e) => e.currentlyAt.value === selectedTile.value)[0]?.legalAttacks;

  return board.map((tile) => {
    if (tile.value === selectedTile.value) {
      return {
        ...tile,
        styleClass: `${findStyleClass(tile.x, tile.y)}-selected`,
      };
    } else {
      for (let i = 0; i < currentMoves?.length; i++) {
        if (currentMoves[i].x === tile.x && currentMoves[i].y === tile.y) {
          return {
            ...tile,
            styleClass: "movable",
          };
        }
      }
      for (let i = 0; i < attackMoves.length; i++) {
        if (attackMoves[i]?.x === tile.x && attackMoves[i]?.y === tile.y) {
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

export const unSelect = (board) => {
  return board.map((tile) => {
    return { ...tile, styleClass: findStyleClass(tile.x, tile.y) };
  });
};

export const legalMoves = (board) => {
  let pieceLocations = getPieceLocations(board);

  const whiteLoc = { ...pieceLocations.white };
  const blackLoc = { ...pieceLocations.black };

  const whiteAttacks = [];
  const whiteMoves = [];
  const blackAttacks = [];
  const blackMoves = [];

  formatLocations(
    whiteLoc,
    blackLoc,
    whiteAttacks,
    whiteMoves,
    pieceLocations,
    "white"
  );
  formatLocations(
    blackLoc,
    whiteLoc,
    blackAttacks,
    blackMoves,
    pieceLocations,
    "black"
  );

  const checksOnWhite = moveMap.king.checkForChecks(
    [
      pieceLocations.white.king[0].legalAttacks,
      pieceLocations.white.king[0].legalMoves,
    ].flat(),
    pieceLocations.white.king[0].currentlyAt,
    blackAttacks.flat(),
    blackMoves.flat(),
    Object.values(blackLoc).flat()
  );
  const checksOnBlack = moveMap.king.checkForChecks(
    [
      pieceLocations.black.king[0].legalAttacks,
      pieceLocations.black.king[0].legalMoves,
    ].flat(),
    pieceLocations.black.king[0].currentlyAt,
    whiteAttacks.flat(),
    whiteMoves.flat(),
    Object.values(whiteLoc).flat()
  );

  console.log(
    "checks on black",
    checksOnBlack,
    "checks on white",
    checksOnWhite
  );
  return pieceLocations;
};

const formatLocations = (
  currentLocs,
  oppositeLocs,
  currentAttacks,
  currentMoves,
  pieceLocations,
  color
) => {
  Object.keys(currentLocs).forEach((piece) => {
    pieceLocations[color][piece] = currentLocs[piece].map((tile) => {
      const moveData = moveMap[piece].findTiles(
        tile,
        Object.values(currentLocs).flat(),
        Object.values(oppositeLocs).flat(),
        color
      );

      currentAttacks.push({ piece, attacks: moveData.attacks });
      currentMoves.push({ piece, moves: moveData.moves });
      return {
        currentlyAt: tile,
        legalMoves: moveData.moves,
        legalAttacks: moveData.attacks,
      };
    });
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

const getPieceLocations = (board) => {
  const result = {
    white: {
      pawn: [],
      knight: [],
      bishop: [],
      rook: [],
      queen: [],
      king: [],
    },
    black: {
      pawn: [],
      knight: [],
      bishop: [],
      rook: [],
      queen: [],
      king: [],
    },
  };

  board.forEach((tile) => {
    if (tile.pieceOnTile?.color === "white") {
      if (result.white[tile.pieceOnTile.name]) {
        result.white[tile.pieceOnTile.name].push({
          value: tile.value,
          x: tile.x,
          y: tile.y,
          pieceOnTile: tile.pieceOnTile,
        });
      }
    }

    if (tile.pieceOnTile?.color === "black") {
      if (result.black[tile.pieceOnTile.name]) {
        result.black[tile.pieceOnTile.name].push({
          value: tile.value,
          x: tile.x,
          y: tile.y,
          pieceOnTile: tile.pieceOnTile,
        });
      }
    }
  });

  return result;
};
