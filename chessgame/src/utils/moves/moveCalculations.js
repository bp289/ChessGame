import { moveMap } from "./pieceData/allPieceMoveData";
import { filterMovesDuringCheck, updateKingStatus } from "./checks/checks";

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

  //setting pin values

  pieceLocations = setPins(
    pieceLocations,
    whiteLoc,
    blackLoc,
    pinningAttacksWhite,
    pinningAttacksBlack
  );

  //calculate Checks
  const checksOnWhite = updateKingStatus(
    pieceLocations.white.king[0].currentlyAt,
    blackAttacks,
    blackProtections,
    blackMoves,
    pieceLocations.white.king[0].legalMoves,
    pieceLocations.white.king[0].legalAttacks
  );

  pieceLocations.white.king[0] = checksOnWhite.filteredKing;

  const checksOnBlack = updateKingStatus(
    pieceLocations.black.king[0].currentlyAt,
    whiteAttacks,
    whiteProtections,
    whiteMoves,
    pieceLocations.black.king[0].legalMoves,
    pieceLocations.black.king[0].legalAttacks
  );

  pieceLocations.black.king[0] = checksOnBlack.filteredKing;

  const checkData = { isInCheck: false };
  if (checksOnWhite.isInCheck) {
    pieceLocations.white = filterMovesDuringCheck(
      checksOnWhite,
      pieceLocations.white
    );

    checkData.isInCheck = true;
    checkData.color = "white";
    checkData.piecesChecking = checksOnWhite.piecesChecking;
    console.log("pieces checking white", checksOnWhite.piecesChecking);
  }
  if (checksOnBlack.isInCheck) {
    pieceLocations.black = filterMovesDuringCheck(
      checksOnBlack,
      pieceLocations.black
    );

    checkData.isInCheck = true;
    checkData.color = "black";
    checkData.piecesChecking = checksOnBlack.piecesChecking;
    console.log("pieces checking black", checksOnBlack.piecesChecking);
  }

  return {
    pieceLocations: pieceLocations,
    checks: checkData,
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
