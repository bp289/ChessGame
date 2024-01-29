import xyMatch from "../constants/xyMatch";

export const checkForChecks = (
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
        console.log(isInCheck);
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
