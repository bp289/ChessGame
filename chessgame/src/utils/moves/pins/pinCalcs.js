import {
  xyMatch,
  isValidCoordinate,
} from "../../constants/coordinateValidation";
import {
  incrementDiagonals,
  incrementStraights,
} from "../pieceData/TransversalData";
import { createDirections } from "../../constants/directionConstants";
const findDeltaSign = (num) => {
  if (num === 0) return num;
  if (num > 0) return 1;
  if (num < 0) return -1;
};

// calculate x1 - x2 and y1 - y2 to get the total distance.
const calculateDelta = (origin, destination) => {
  const deltaX = destination.x - origin.x;
  const deltaY = destination.y - origin.y;

  return { x: deltaX, y: deltaY };
};

export const getValidMovesOnPin = (pieceOrigin, destination) => {
  const moves = [];
  let { x: originX, y: originY } = pieceOrigin;
  let { x: deltaX, y: deltaY } = calculateDelta(pieceOrigin, destination);
  // if we have positive we move up, if negative we move down
  const ySign = findDeltaSign(deltaY);
  //if we have positive we move left, if negative we move right
  const xSign = findDeltaSign(deltaX);

  while (deltaX !== 0 || deltaY !== 0) {
    originX += xSign;
    originY += ySign;
    moves.push({ x: originX, y: originY });
    if (deltaX !== 0) deltaX += xSign * -1;
    if (deltaY !== 0) deltaY += ySign * -1;
  }

  return moves;
};

export const isKingOnSameDiagonal = (piece, locations) => {
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

  console.log(straights, diagonals);

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

      if (kingMatch) return true;
    } catch (e) {
      console.error(e, currentTile, directions);
    }
  }

  return kingMatch;
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
