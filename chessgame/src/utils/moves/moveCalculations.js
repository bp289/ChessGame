import { moveMap } from "./pieceData/allPieceMoveData";
import { checkForChecks } from "./checks/checks";

import { setPins } from "./pins/pins";
export const legalMoves = (board) => {
  let pieceLocations = getPieceLocations(board);

  const whiteLoc = { ...pieceLocations.white };
  const blackLoc = { ...pieceLocations.black };

  const whiteAttacks = [];
  const whiteMoves = [];
  const whiteProtections = [];
  const blackAttacks = [];
  const blackProtections = [];
  const blackMoves = [];

  // (potentially)pinning attacks

  const pinningAttacksWhite = { queens: [], rooks: [], bishops: [] };
  const pinningAttacksBlack = { queens: [], rooks: [], bishops: [] };

  calculateMoves(
    whiteLoc,
    blackLoc,
    whiteAttacks,
    pinningAttacksWhite,
    whiteProtections,
    whiteMoves,
    pieceLocations,
    "white"
  );

  calculateMoves(
    blackLoc,
    whiteLoc,
    blackAttacks,
    pinningAttacksBlack,
    blackProtections,
    blackMoves,
    pieceLocations,
    "black"
  );

  //calculate Checks
  const checksOnWhite = checkForChecks(
    pieceLocations.white.king[0].currentlyAt,
    blackAttacks,
    blackProtections,
    blackMoves,
    pieceLocations.white.king[0].legalMoves,
    pieceLocations.white.king[0].legalAttacks
  );
  //console.log("white checks", checksOnWhite);

  pieceLocations.white.king[0] = checksOnWhite.filteredKing;

  const checksOnBlack = checkForChecks(
    pieceLocations.black.king[0].currentlyAt,
    whiteAttacks,
    whiteProtections,
    whiteMoves,
    pieceLocations.black.king[0].legalMoves,
    pieceLocations.black.king[0].legalAttacks
  );

  //console.log("black checks", checksOnBlack);

  pieceLocations.black.king[0] = checksOnBlack.filteredKing;

  pieceLocations = setPins(
    pieceLocations,
    whiteLoc,
    blackLoc,
    pinningAttacksWhite,
    pinningAttacksBlack
  );
  return {
    pieceLocations: pieceLocations,
    checks: {
      black: {
        piecesChecking: checksOnBlack.piecesChecking,
        isInCheck: checksOnBlack.isInCheck,
      },
      white: {
        piecesChecking: checksOnWhite.piecesChecking,
        isInCheck: checksOnWhite.isInCheck,
      },
    },
  };
};

const calculateMoves = (
  currentLocs,
  oppositeLocs,
  currentAttacks,
  currentPinningAttacks,
  currentProtections,
  currentMoves,
  pieceLocations,
  color
) => {
  Object.keys(currentLocs).forEach((piece) => {
    pieceLocations[color][piece] = currentLocs[piece].map((currentTile) => {
      const moveData = moveMap[piece].findTiles(
        currentTile,
        Object.values(currentLocs).flat(),
        Object.values(oppositeLocs).flat(),
        color
      );

      currentAttacks.push(checkPawnAttacks(moveData, currentTile));
      if (piece === "bishop") {
        currentPinningAttacks.bishops.push(
          checkPawnAttacks(moveData, currentTile)
        );
      }

      if (piece === "rook") {
        currentPinningAttacks.rooks.push(
          checkPawnAttacks(moveData, currentTile)
        );
      }

      if (piece === "queen") {
        currentPinningAttacks.queens.push(
          checkPawnAttacks(moveData, currentTile)
        );
      }

      currentMoves.push({
        moves: moveData.moves,
        currentTile,
      });

      currentProtections.push({
        protections: moveData.protections,
        currentTile,
      });

      return {
        currentlyAt: currentTile,
        legalMoves: moveData.moves,
        legalAttacks: moveData.attacks,
      };
    });
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

const checkPawnAttacks = (moveData, currentTile) => {
  if (currentTile.pieceOnTile.name === "pawn") {
    return {
      attacks: moveData.attacks,
      potentialAttacks: moveData.potentialAttacks,
      currentTile,
    };
  }
  return {
    attacks: moveData.attacks,
    currentTile,
  };
};
