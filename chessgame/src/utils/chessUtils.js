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

  const checksOnWhite = checkForChecks(
    pieceLocations.white.king[0].currentlyAt,
    blackAttacks,
    blackProtections,
    blackMoves,
    pieceLocations.white.king[0].legalMoves,
    pieceLocations.white.king[0].legalAttacks
  );

  pieceLocations.white.king[0] = checksOnWhite.filteredKing;

  const checksOnBlack = checkForChecks(
    pieceLocations.black.king[0].currentlyAt,
    whiteAttacks,
    whiteProtections,
    whiteMoves,
    pieceLocations.black.king[0].legalMoves,
    pieceLocations.black.king[0].legalAttacks
  );

  pieceLocations.black.king[0] = checksOnBlack.filteredKing;

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
        attacks: moveData.attacks,
        currentTile,
      });

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

const checkForChecks = (
  currentLocation,
  enemyAttacks,
  enemyProtections,
  enemyMoves,
  kingsMoves,
  kingsAttacks
) => {
  let filteredKingMoves = [...kingsMoves];
  let filteredKingAttacks = [...kingsAttacks];
  let isInCheck = false;
  const piecesChecking = [];

  const { x, y } = currentLocation;

  enemyAttacks.forEach((enemyAttack) => {
    for (const attack of enemyAttack.attacks) {
      if (attack.x === x && attack.y === y) {
        isInCheck = true;
        piecesChecking.push({
          attack,
          attackingFrom: enemyAttack.currentTile,
          attackingPiece: enemyAttack.piece,
        });
      }
      //all places that enemy is attacking an ally piece, which king cant move to
      filteredKingAttacks = kingsAttacks.filter(
        (kingAttack) => kingAttack.x !== attack.x || attack.y !== kingAttack.y
      );

      filteredKingMoves = kingsMoves.filter(
        (kingMove) => kingMove.x !== attack.x || attack.y !== kingMove.y
      );
    }
  });

  //all places that enemy can see, where king cant move to
  enemyMoves.forEach((enemyMove) => {
    for (const move of enemyMove.moves) {
      filteredKingAttacks = filteredKingAttacks.filter(
        (kingAttack) => kingAttack.x !== move.x || kingAttack.y !== move.y
      );

      filteredKingMoves = filteredKingMoves.filter(
        (kingMove) => kingMove.x !== move.x || kingMove.y !== move.y
      );
    }
  });

  //all pieces that enemy is protecting, which king cant move to
  enemyProtections.forEach((enemyProtection) => {
    for (const move of enemyProtection?.protections) {
      filteredKingAttacks = filteredKingAttacks.filter(
        (kingAttack) => kingAttack.x !== move.x || kingAttack.y !== move.y
      );
      filteredKingMoves = filteredKingMoves.filter(
        (kingMove) => kingMove.x !== move.x || kingMove.y !== move.y
      );
    }
  });

  return {
    isInCheck,
    piecesChecking,
    filteredKing: {
      currentlyAt: currentLocation,
      legalMoves: filteredKingMoves,
      legalAttacks: filteredKingAttacks,
    },
  };
};
