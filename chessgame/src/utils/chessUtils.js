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

  const pinnedLocations = setPins(
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
    if (enemyAttack.potentialAttacks)
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
        filteredKingAttacks = filteredKingAttacks.filter(
          (kingAttack) => kingAttack.x !== attack.x || attack.y !== kingAttack.y
        );

        filteredKingMoves = filteredKingMoves.filter(
          (kingMove) => kingMove.x !== attack.x || attack.y !== kingMove.y
        );
      }

    //Potential attacks from pawns.
    if (enemyAttack.potentialAttacks) {
      for (const attack of enemyAttack.potentialAttacks) {
        //all places that enemy is attacking an ally piece, which king cant move to
        filteredKingAttacks = filteredKingAttacks.filter(
          (kingAttack) => kingAttack.x !== attack.x || attack.y !== kingAttack.y
        );

        filteredKingMoves = filteredKingMoves.filter(
          (kingMove) => kingMove.x !== attack.x || attack.y !== kingMove.y
        );
      }
    }
  });

  //all places that enemy can see, where king cant move to
  enemyMoves.forEach((enemyMove) => {
    if (enemyMove.currentTile.pieceOnTile !== "pawn") {
      for (const move of enemyMove.moves) {
        filteredKingAttacks = filteredKingAttacks.filter(
          (kingAttack) => kingAttack.x !== move.x || kingAttack.y !== move.y
        );

        filteredKingMoves = filteredKingMoves.filter(
          (kingMove) => kingMove.x !== move.x || kingMove.y !== move.y
        );
      }
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

const setPins = (pieceLocations, white, black, whiteAttacks, blackAttacks) => {
  const pinnedBlackPieces = findAttacks(
    whiteAttacks,
    { ...black },
    { ...white }
  );
  const pinnedWhitePieces = findAttacks(
    blackAttacks,
    { ...white },
    { ...black },
    pieceLocations
  );

  return pieceLocations;
};

const findAttacks = (enemysPinAttacks, allyLocations, enemyLocations) => {
  const { queens, rooks, bishops } = enemysPinAttacks;

  const queenPins = checkForPins(
    queens,
    allyLocations,
    enemyLocations,
    "queen"
  );
  const rookPins = checkForPins(rooks, allyLocations, enemyLocations, "rook");
  const bishopPins = checkForPins(
    bishops,
    allyLocations,
    enemyLocations,
    "bishop"
  );
};

const checkForPins = (
  pinningPieces,
  allyLocations,
  enemyLocations,
  pieceName
) => {
  pinningPieces.forEach((piece) => {
    const {
      attacks,
      currentTile: {
        value: enemyValue,
        pieceOnTile: { name: enemyName, color: enemyColor },
        x,
        y,
      },
    } = piece;

    const attackerXY = { x, y };

    if (attacks.length > 0) {
      console.warn("attacker ->", enemyName, enemyValue);
      const pinnedPieces = attacks.map((attack) => {
        const {
          pieceUnderAttack: {
            pieceOnTile: { name },
            value: pieceUnderAttackValue,
            x,
            y,
          },
        } = attack;

        const pieceUnderAttackXY = { x, y };
        const newAllyLocations = { ...allyLocations };

        newAllyLocations[name] = newAllyLocations[name].filter(
          (currentPiece) => currentPiece.value !== pieceUnderAttackValue
        );

        const movesWithoutPieceUnderAttack = moveMap[pieceName].findTiles(
          piece.currentTile,
          Object.values(newAllyLocations).flat(),
          Object.values(enemyLocations).flat(),
          enemyColor
        );

        const isPinned = movesWithoutPieceUnderAttack.attacks.some(
          (attack) => attack.pieceUnderAttack.pieceOnTile.name === "king"
        );

        if (isPinned) {
          console.log("victim ->", name, attack, "is pinned:", isPinned);
          console.log(pinDirectionAndDistance(pieceUnderAttackXY, attackerXY));
        }
        // find the direction from which you are being attacked from

        return attack;
      });
    }

    // check here if movesWithoutPieceUnderAttack  has any attacks for the king.
    // if yes -> set piece as pinned, find direction of pin
    // if no -> do nothing.
  });
};

const pinDirectionAndDistance = (victim, attacker) => {
  console.log(victim, attacker);
  const deltaX = attacker.x - victim.x;
  const deltaY = attacker.y - victim.y;

  console.log(deltaX, deltaY);
  if (deltaX === 0) {
    return { direction: "Vertical", distance: deltaY };
  } else if (deltaY === 0) {
    return { direction: "Horizontal", distance: deltaX };
  } else {
    return {
      direction: "Diagonal",
      distanceX: deltaX,
      distanceY: deltaY,
    };
  }
};
