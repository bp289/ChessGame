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
  //console.log("enemyAttaks", enemyAttacks);
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
  console.log(currentPieceMoves);
  const { piecesChecking, filteredKing: kingTile } = kingCheckData;
  piecesChecking.forEach((attacker) => {
    const {
      pieceOnTile: { name },
      value,
    } = attacker.attackingFrom;

    const availableMoves =
      name === "rook" || name === "bishop" || name === "queen"
        ? findBlocks({ ...currentPieceMoves }, attacker.attackingFrom, kingTile)
        : findAttacks({ ...currentPieceMoves }, attacker.attackingFrom);
  });
};

const findBlocks = (currentPieceMoves, attacker, kingTile) => {
  const newPieceMoves = {};
  const movesBlockingKing = getMovesBlockingKing(
    kingTile.currentlyAt,
    attacker
  );

  for (const pieceType in currentPieceMoves) {
    if (pieceType === "king") continue;

    newPieceMoves[pieceType] = currentPieceMoves[pieceType].map((piece) => {
      if (
        piece.currentlyAt.value === "f4" ||
        piece.currentlyAt.value === "b1"
      ) {
        console.log(piece.legalAttacks, piece.legalMoves);
      }
      const updatedLegalAttacks = onSameDiagonalAsKing(
        piece.legalAttacks,
        movesBlockingKing
      );
      const updatedLegalMoves = onSameDiagonalAsKing(
        piece.legalMoves,
        movesBlockingKing
      );

      if (
        piece.currentlyAt.value === "f4" ||
        piece.currentlyAt.value === "b1"
      ) {
        console.log(piece, updatedLegalAttacks, updatedLegalMoves);
      }

      return {
        legalMoves: updatedLegalMoves,
        legalAttacks: updatedLegalAttacks,
        ...piece,
      };
    });
  }
  return newPieceMoves;
};

const onSameDiagonalAsKing = (currentMoves, movesBlocking) =>
  currentMoves.filter((move) =>
    movesBlocking.find((moveBlocking) => xyMatch(move, moveBlocking))
  );

const findAttacks = (currentPieceMoves, attacker) => {
  const newPieceMoves = {};
  for (const pieceType in currentPieceMoves) {
    newPieceMoves[pieceType] = currentPieceMoves[pieceType].map((piece) => {
      const attackThatTakesAttacker = piece.legalAttacks.find((legalAttack) =>
        xyMatch(legalAttack, attacker)
      );

      return {
        legalMoves: [],
        legalAttacks: attackThatTakesAttacker ? [attackThatTakesAttacker] : [],
        ...piece,
      };
    });
  }
  return newPieceMoves;
};
