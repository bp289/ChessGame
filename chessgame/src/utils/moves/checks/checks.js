import { xyMatch } from "../../constants/coordinateValidation";
import { getMovesBlockingKing } from "../pieceData/TransversalData";

export const updateKingStatus = (
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

  enemyAttacks.forEach((enemyAttack) => {
    for (const attack of enemyAttack.attacks) {
      if (xyMatch(attack, currentLocation)) {
        isInCheck = true;

        piecesChecking.push({
          attackingFrom: enemyAttack.currentTile,
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

export const filterMovesDuringCheck = (kingCheckData, currentPieceMoves) => {
  const { piecesChecking, filteredKing: kingTile } = kingCheckData;

  const allAllowedMoves = {};
  const allAllowedAttacks = {};

  piecesChecking.forEach((attacker) => {
    const {
      pieceOnTile: { name },
      value,
      x,
      y,
    } = attacker.attackingFrom;
    const allowedMoves =
      name === "rook" || name === "bishop" || name === "queen"
        ? getMovesBlockingKing(kingTile.currentlyAt, attacker.attackingFrom)
        : [];

    allAllowedAttacks[value] = { x, y, name };
    allAllowedMoves[value] = { x, y, name, moves: allowedMoves };
  });

  if (piecesChecking.length > 1) {
    const verifiedAllowedAttacks = [];
    const verifiedAllowedMoves = [];
    for (let attackKey in allAllowedAttacks) {
      const attackToCheck = allAllowedAttacks[attackKey];
      const currentAttackAllowed = verifyMove(attackToCheck, allAllowedMoves);
      if (currentAttackAllowed) verifiedAllowedAttacks.push(attackToCheck);
    }

    const allowedMoveKeys = Object.values(allAllowedMoves);

    for (let i = 1; i < allowedMoveKeys.length; i++) {
      const moveToCheck = allowedMoveKeys[i];
      const restOfAllowedMoves = allowedMoveKeys.toSpliced(i, 1);
      const currentMoveAllowed = verifyMove(moveToCheck, restOfAllowedMoves);
      if (currentMoveAllowed) verifiedAllowedMoves.push(currentMoveAllowed);
    }
    return filterMovesForEachPieceType(
      currentPieceMoves,
      verifiedAllowedMoves,
      verifiedAllowedAttacks
    );
  } else {
    const verifiedAllowedAttacks = Object.values(allAllowedAttacks);
    const verifiedAllowedMoves = Object.values(allAllowedMoves)[0].moves;

    return filterMovesForEachPieceType(
      currentPieceMoves,
      verifiedAllowedMoves,
      verifiedAllowedAttacks
    );
  }
};

const verifyMove = (moveToCheck, allAllowedMoves) => {
  for (let moveKey in allAllowedMoves) {
    const allowedMoves = allAllowedMoves[moveKey].moves;
    const moveMatch = allowedMoves.find((move) => xyMatch(move, moveToCheck));
    if (!moveMatch) {
      return false;
    }
  }
  return true;
};

const filterMovesForEachPieceType = (
  pieceMoves,
  allowedMoves,
  allowedAttacks
) => {
  const result = {};
  for (const pieceType in pieceMoves) {
    const newMoves = pieceMoves[pieceType].map((piece) => {
      if (pieceType === "king") return pieceType;
      const newLegalMoves = piece.legalMoves?.filter((moveToCheck) =>
        allowedMoves.find((move) => xyMatch(moveToCheck, move))
      );

      const newLegalAttacks = piece.legalAttacks?.filter((moveToCheck) =>
        allowedAttacks.find((allowedAttack) =>
          xyMatch(moveToCheck, allowedAttack)
        )
      );

      return {
        ...piece,
        legalAttacks: newLegalAttacks,
        legalMoves: newLegalMoves,
      };
    });

    result[pieceType] = newMoves;
  }

  return result;
};
