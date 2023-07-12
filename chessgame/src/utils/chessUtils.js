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
  Object.keys(whiteLoc).forEach((piece) => {
    pieceLocations.white[piece] = whiteLoc[piece].map((tile) => {
      const moveData = moveMap[piece].findTiles(
        tile,
        Object.values(whiteLoc).flat(),
        Object.values(blackLoc).flat(),
        "white"
      );

      whiteAttacks.push({ piece, attacks: moveData.attacks });
      whiteMoves.push({ piece, moves: moveData.moves });
      return {
        currentlyAt: tile,
        legalMoves: moveData.moves,
        legalAttacks: moveData.attacks,
      };
    });
  });

  Object.keys(blackLoc).forEach((piece) => {
    pieceLocations.black[piece] = blackLoc[piece].map((tile) => {
      const moveData = moveMap[piece].findTiles(
        tile,
        Object.values(blackLoc).flat(),
        Object.values(whiteLoc).flat(),
        "black"
      );

      blackAttacks.push({ piece, attacks: moveData.attacks });
      blackMoves.push({ piece, moves: moveData.moves });
      return {
        currentlyAt: tile,
        legalMoves: moveData.moves,
        legalAttacks: moveData.attacks,
      };
    });
  });

  // will reach here after a move has been made. (all next moves are calculated.)

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

  console.log("black", checksOnBlack, "white", checksOnWhite);
  return pieceLocations;
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
  const pieceLocation = {
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
      if (pieceLocation.white[tile.pieceOnTile.name]) {
        pieceLocation.white[tile.pieceOnTile.name].push({
          value: tile.value,
          x: tile.x,
          y: tile.y,
          pieceOnTile: tile.pieceOnTile,
        });
      }
    }

    if (tile.pieceOnTile?.color === "black") {
      if (pieceLocation.black[tile.pieceOnTile.name]) {
        pieceLocation.black[tile.pieceOnTile.name].push({
          value: tile.value,
          x: tile.x,
          y: tile.y,
          pieceOnTile: tile.pieceOnTile,
        });
      }
    }
  });

  return pieceLocation;
};
