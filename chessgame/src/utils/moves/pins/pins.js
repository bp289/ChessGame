import { moveMap } from "../pieceMoves";
import { getValidMovesOnPin } from "./pinCalcs";
import {
  xyMatch,
  isValidCoordinate,
} from "../../constants/coordinateValidation";
import { createDirections } from "../../constants/directionConstants";

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

  for (let piece of pinningPieces) {
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
      const pinnedPieces = attacks.reduce((totalPinningAttacks, attack) => {
        if (!isKingOnSameDiagonal(attack, allLocations))
          return totalPinningAttacks;

        const {
          pieceOnTile: { name },
          value: pieceUnderAttackValue,
          x,
          y,
        } = attack;

        const pieceUnderAttackXY = { x, y };

        const newAllyLocations = { ...allyLocations };

        newAllyLocations[name] = newAllyLocations[name].filter(
          (currentPiece) => currentPiece.value !== pieceUnderAttackValue
        );

        const movesWithoutPieceUnderAttack = moveMap[
          attackingPieceName
        ].findTiles(
          piece.currentTile,
          Object.values(newAllyLocations).flat(),
          Object.values(enemyLocations).flat(),
          enemyColor
        );

        const attackOnKing = movesWithoutPieceUnderAttack.attacks.some(
          (attack) => attack.pieceOnTile.name === "king"
        );

        if (attackOnKing) {
          console.log("victim ->", name, attack, "is pinned:", attackOnKing);

          const moves = getValidMovesOnPin(
            pieceUnderAttackXY,
            attackerXY
          ).concat(
            getValidMovesOnPin(pieceUnderAttackXY, kingLocation).filter(
              (moveLocation) => !xyMatch(moveLocation, kingLocation)
            )
          );

          totalPinningAttacks.push({
            pinnedPiece: attack,
            allowedMoves: moves,
          });

          return totalPinningAttacks;
        }

        return totalPinningAttacks;
      }, []);

      if (pinnedPieces.length > 0) {
        pins[enemyValue] = pinnedPieces;
      }
    }
  }

  return pins;
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

const isKingOnSameDiagonal = (piece, locations) => {
  // const { straightDirections, diagonalDirections } = createDirections("both");
  // console.log(piece, straightDirections);
  const straights = findKing(
    locations,
    createDirections("straight"),
    piece,
    7,
    piece.pieceOnTile.color,
    false
  );
  const diagonals = findKing(
    locations,
    createDirections("diagonal"),
    piece,
    7,
    piece.pieceOnTile.color,
    true
  );

  return straights || diagonals;
};

const findKing = (
  allPieceData,
  directions,
  currentTile,
  limit,
  color,
  diagonals
) => {
  let kingMatch = false;
  for (let i = 1; i <= limit; i++) {
    const currentDir = diagonals
      ? incrementDiagonals(i, currentTile)
      : incrementStraights(i, currentTile);

    try {
      kingMatch = transverseDirections(
        allPieceData,
        directions,
        currentDir,
        color
      );
    } catch (e) {
      console.error(e, currentTile, directions);
    }
  }

  return kingMatch;
};

const incrementDiagonals = (i, currentTile) => {
  const { x, y } = currentTile;
  return {
    up: { x: x + i, y: y + i }, //upRight
    down: { x: x - i, y: y + i }, //upLeft
    right: { x: x + i, y: y - i }, //downRight
    left: { x: x - i, y: y - i }, //downLeft
  };
};

const incrementStraights = (i, currentTile) => {
  const { x, y } = currentTile;
  return {
    up: { x, y: y + i },
    down: { x, y: y - i },
    right: { x: x + i, y },
    left: { x: x - i, y },
  };
};

function transverseDirections(pieceLocations, directions, currentDir, color) {
  const { up, down, left, right } = { ...directions };
  let kingMatch = false;
  const directionMappings = [
    { direction: up, currentDirection: currentDir.up },
    { direction: down, currentDirection: currentDir.down },
    { direction: right, currentDirection: currentDir.right },
    { direction: left, currentDirection: currentDir.left },
  ];

  for (const mapping of directionMappings) {
    const { direction, currentDirection } = mapping;
    if (kingMatch) break;
    if (isValidCoordinate(currentDirection.x, currentDirection.y)) {
      for (const location of pieceLocations) {
        const locationMatch =
          location.x === currentDirection.x &&
          location.y === currentDirection.y &&
          !direction.blocked;
        if (locationMatch) {
          direction.blocked = true;
          kingMatch =
            location.pieceOnTile.color === color &&
            location.pieceOnTile.name === "king";
          if (kingMatch) break;
        }
      }
    } else {
      direction.blocked = true;
    }
  }
  return kingMatch;
}
