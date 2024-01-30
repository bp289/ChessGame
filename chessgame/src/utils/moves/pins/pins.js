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
  const { queens, rooks, bishops } = enemysPinAttacks;
  // const pieceInfo = { ...pieceLocations };
  let pieceData = { ...pieceLocations };
  const queenPins = checkForPins(
    queens,
    allyLocations,
    enemyLocations,
    "queen"
  );
  pieceData = filterMovesFromPins(queenPins, pieceData);
  const rookPins = checkForPins(rooks, allyLocations, enemyLocations, "rook");
  pieceData = filterMovesFromPins(rookPins, pieceData);
  const bishopPins = checkForPins(
    bishops,
    allyLocations,
    enemyLocations,
    "bishop"
  );
  pieceData = filterMovesFromPins(bishopPins, pieceData);

  return pieceData;
};

const checkForPins = (
  pinningPieces,
  allyLocations,
  enemyLocations,
  pieceName
) => {
  const pins = {};
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
        const {
          pieceOnTile: { name },
          value: pieceUnderAttackValue,
          x,
          y,
        } = attack;

        const kingOnSameDiagonal = isKingOnSameDiagonal(
          attack,
          [
            Object.values(allyLocations).flat(),
            Object.values(enemyLocations).flat(),
          ].flat()
        );

        //TODO: MAKE SURE THE ATTACKED PIECE IS IN THE SAME DIAGONAL OR STRAIGHT AS THE KING.
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

        const attackOnKing = movesWithoutPieceUnderAttack.attacks.find(
          (attack) => attack.pieceOnTile.name === "king"
        );

        if (attackOnKing) {
          const king = attackOnKing;

          const kingXY = { x: king.x, y: king.y };
          console.log(
            "victim ->",
            name,
            attack,
            "is pinned:",
            attackOnKing ? true : false
          );

          const moves = [
            getValidMovesOnPin(pieceUnderAttackXY, attackerXY),
            getValidMovesOnPin(pieceUnderAttackXY, kingXY).filter(
              ({ x, y }) => x !== kingXY.x && y !== kingXY.y
            ),
          ].flat();

          totalPinningAttacks.push({
            pinnedPiece: attack,
            allowedMoves: moves,
          });

          return totalPinningAttacks;
        }

        return totalPinningAttacks;

        // find the direction from which you are being attacked from
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
  const straights = getBlockingPieces(
    locations,
    createDirections("straight"),
    piece,
    7,
    piece.pieceOnTile.color,
    false
  );
  const diagonals = getBlockingPieces(
    locations,
    createDirections("diagonal"),
    piece,
    7,
    piece.pieceOnTile.color,
    true
  );

  console.log(diagonals, straights);
};

const getBlockingPieces = (
  allPieceData,
  directions,
  currentTile,
  limit,
  color,
  diagonals
) => {
  const { up, down, left, right } = directions;
  for (let i = 1; i <= limit; i++) {
    const currentDir = diagonals
      ? incrementDiagonals(i, currentTile)
      : incrementStraights(i, currentTile);

    try {
      calculateBlockings(allPieceData, directions, currentDir, color);
    } catch (e) {
      console.error(e, currentTile, directions);
    }
  }

  return {
    blockingPieces: [
      up.attackTile,
      down.attackTile,
      left.attackTile,
      right.attackTile,
    ].flat(),
  };
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

function calculateBlockings(pieceLocations, directions, currentDir) {
  const { up, down, left, right } = { ...directions };

  const directionMappings = [
    { direction: up, currentDirection: currentDir.up },
    { direction: down, currentDirection: currentDir.down },
    { direction: right, currentDirection: currentDir.right },
    { direction: left, currentDirection: currentDir.left },
  ];

  for (const mapping of directionMappings) {
    const { direction, currentDirection } = mapping;

    if (isValidCoordinate(currentDirection.x, currentDirection.y)) {
      pieceLocations.forEach((location) => {
        if (
          location.x === currentDirection.x &&
          location.y === currentDirection.y &&
          !direction.blocked
        ) {
          direction.blocked = true;
          console.log(location);
          direction.attackTile.push(location);
        }
      });
    } else {
      direction.blocked = true;
    }
  }
}
