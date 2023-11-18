import { findStyleClass } from "./chessBoardUtils";
import { moveMap } from "./pieceMoves";

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

  calculateMoves(
    whiteLoc,
    blackLoc,
    whiteAttacks,
    whiteProtections,
    whiteMoves,
    pieceLocations,
    "white"
  );

  calculateMoves(
    blackLoc,
    whiteLoc,
    blackAttacks,
    blackProtections,
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

  console.log(whiteProtections, blackProtections);
  console.log(blackAttacks, whiteAttacks);

  pieceLocations.black.king[0].checkData = checksOnBlack;
  pieceLocations.white.king[0].checkData = checksOnWhite;

  console.log(
    "checks on black",
    checksOnBlack,
    "checks on white",
    checksOnWhite
  );

  return {
    pieceLocations: pieceLocations,
    checks: { black: checksOnBlack, white: checksOnWhite },
  };
};

const calculateMoves = (
  currentLocs,
  oppositeLocs,
  currentAttacks,
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

      currentAttacks.push({
        piece,
        attacks: moveData.attacks,
        currentTile,
      });

      currentMoves.push({
        piece,
        moves: moveData.moves,
        attacks: moveData.attacks,
        currentTile,
      });

      currentProtections.push({
        piece,
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
