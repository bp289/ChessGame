import { moveMap } from "../pieceData/allPieceMoveData";
import { getValidMovesOnPin } from "./pinCalcs";
import { isKingOnSameDiagonal } from "./pinCalcs";
import { xyMatch } from "../../constants/coordinateValidation";

export const setPins = (
  pieceLocations,
  white,
  black,
  whiteAttacks,
  blackAttacks
) => {
  const pinnedBlackPieces = reducedPinAttacks(
    whiteAttacks,
    { ...black },
    { ...white },
    pieceLocations.black
  );

  const pinnedWhitePieces = reducedPinAttacks(
    blackAttacks,
    { ...white },
    { ...black },
    pieceLocations.white
  );

  return { white: pinnedWhitePieces, black: pinnedBlackPieces };
};

const reducedPinAttacks = (
  enemysPinAttacks,
  allyLocations,
  enemyLocations,
  pieceLocations
) => {
  const king = allyLocations.king[0];

  const { queens, rooks, bishops } = enemysPinAttacks;
  // const pieceInfo = { ...pieceLocations };
  let pieceData = { ...pieceLocations };
  const queenPins = checkForPins(
    queens,
    allyLocations,
    enemyLocations,
    "queen",
    king
  );
  pieceData = filterMovesFromPins(queenPins, pieceData);
  const rookPins = checkForPins(
    rooks,
    allyLocations,
    enemyLocations,
    "rook",
    king
  );
  pieceData = filterMovesFromPins(rookPins, pieceData);
  const bishopPins = checkForPins(
    bishops,
    allyLocations,
    enemyLocations,
    "bishop",
    king
  );
  pieceData = filterMovesFromPins(bishopPins, pieceData);

  return pieceData;
};

const checkForPins = (
  pinningPieces,
  allyLocations,
  enemyLocations,
  attackingPieceName,
  kingLocation
) => {
  const pins = {};

  const allLocations = Object.values(allyLocations)
    .flat()
    .concat(Object.values(allyLocations).flat());

  for (const piece of pinningPieces) {
    const {
      attacks,
      currentTile: {
        value: enemyValue,
        pieceOnTile: { color: enemyColor },
        x,
        y,
      },
    } = piece;

    const attackerXY = { x, y };

    if (attacks.length > 0) {
      const pinnedPieces = attacks.reduce(
        (totalPinningAttacks, currentPieceUnderAttack) => {
          if (!isKingOnSameDiagonal(currentPieceUnderAttack, allLocations))
            return totalPinningAttacks;
          if (
            !kingAttackedWhenPieceDissappears(
              allyLocations,
              attackingPieceName,
              currentPieceUnderAttack,
              enemyLocations,
              piece,
              enemyColor
            )
          )
            return totalPinningAttacks;

          const moves = getValidMovesOnPin(
            currentPieceUnderAttack,
            attackerXY
          ).concat(
            getValidMovesOnPin(currentPieceUnderAttack, kingLocation).filter(
              (moveLocation) => !xyMatch(moveLocation, kingLocation)
            )
          );

          totalPinningAttacks.push({
            pinnedPiece: currentPieceUnderAttack,
            allowedMoves: moves,
          });

          return totalPinningAttacks;
        },
        []
      );

      if (pinnedPieces.length > 0) {
        pins[enemyValue] = pinnedPieces;
      }
    }
  }

  return pins;
};

const kingAttackedWhenPieceDissappears = (
  allyLocations,
  attackingPieceName,
  currentPieceUnderAttack,
  enemyLocations,
  attackingPieceTile,
  enemyColor
) => {
  const {
    pieceOnTile: { name },
    value: pieceUnderAttackValue,
  } = currentPieceUnderAttack;

  const newAllyLocations = { ...allyLocations };

  newAllyLocations[name] = newAllyLocations[name].filter(
    (currentPiece) => currentPiece.value !== pieceUnderAttackValue
  );

  const movesWithoutPieceUnderAttack = moveMap[attackingPieceName].findTiles(
    attackingPieceTile.currentTile,
    Object.values(newAllyLocations).flat(),
    Object.values(enemyLocations).flat(),
    enemyColor
  );

  return movesWithoutPieceUnderAttack.attacks.some(
    (attack) => attack.pieceOnTile.name === "king"
  );
};

const filterMovesFromPins = (pinnedPieces, allPieceData) => {
  for (let piece in pinnedPieces) {
    const currentPins = pinnedPieces[piece];

    currentPins.forEach((piece) => {
      const {
        pinnedPiece: {
          value: pinnedValue,
          pieceOnTile: { name },
        },
        allowedMoves,
      } = piece;

      allPieceData[name].forEach((piece, index) => {
        if (piece.currentlyAt.value === pinnedValue) {
          allPieceData[name][index].legalMoves = allPieceData[name][
            index
          ].legalMoves.filter((move) =>
            allowedMoves.some((allowedMove) => xyMatch(move, allowedMove))
          );

          allPieceData[name][index].legalAttacks = allPieceData[name][
            index
          ].legalAttacks.filter((attack) =>
            allowedMoves.some((allowedMove) => xyMatch(attack, allowedMove))
          );
        }
      });
    });
  }

  return allPieceData;
};
