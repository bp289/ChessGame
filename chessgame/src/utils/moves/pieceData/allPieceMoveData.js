import {
  createDirections,
  createPawnDirections,
} from "../../constants/directionConstants";

import { isValidCoordinate } from "../../constants/coordinateValidation";

export const moveMap = {
  pawn: {
    findTiles: (currentTile, allyLocations, enemyLocations, color) => {
      const { normal: directions, attack: attackDirections } =
        createPawnDirections(color);

      const firstMove = currentTile.pieceOnTile?.firstMove ? 2 : 1;

      const { moves, attacks, protections } = getMoves(
        allyLocations,
        enemyLocations,
        attackDirections,
        currentTile,
        1,
        color,
        true
      );
      return {
        moves: getMoves(
          allyLocations,
          enemyLocations,
          directions,
          currentTile,
          firstMove,
          color,
          false
        ).moves,
        attacks,
        protections,
        potentialAttacks: moves,
      };
    },
  },
  knight: {
    findTiles: (selectedTile, allyLocations, enemyLocations, color) => {
      const tiles = [
        { x: selectedTile.x - 1, y: selectedTile.y + 2 },
        { x: selectedTile.x + 1, y: selectedTile.y + 2 },
        { x: selectedTile.x - 1, y: selectedTile.y - 2 },
        { x: selectedTile.x + 1, y: selectedTile.y - 2 },
        { x: selectedTile.x + 2, y: selectedTile.y - 1 },
        { x: selectedTile.x - 2, y: selectedTile.y - 1 },
        { x: selectedTile.x + 2, y: selectedTile.y + 1 },
        { x: selectedTile.x - 2, y: selectedTile.y + 1 },
      ];

      const attacks = [];
      const protections = [];
      const loc = [allyLocations, enemyLocations].flat();

      [...tiles].forEach((validTile) => {
        if (isValidCoordinate(validTile.x, validTile.y)) {
          for (let i = 0; i < loc.length; i++) {
            if (loc[i].x === validTile.x && loc[i].y === validTile.y) {
              if (loc[i].pieceOnTile.color === color) {
                tiles.splice(tiles.indexOf(validTile), 1);
                protections.push(validTile);
              } else {
                tiles.splice(tiles.indexOf(validTile), 1);
                attacks.push(validTile);
              }
            }
          }
        } else {
          tiles.splice(tiles.indexOf(validTile), 1);
        }
      });

      return { moves: tiles, attacks: attacks, protections: protections };
    },
  },
  bishop: {
    findTiles: (currentTile, allyLocations, enemyLocations, color) => {
      const directions = createDirections("diagonal");

      return getMoves(
        allyLocations,
        enemyLocations,
        directions,
        currentTile,
        7,
        color,
        true
      );
    },
  },
  rook: {
    findTiles: (currentTile, allyLocations, enemyLocations, color) => {
      const directions = createDirections("straight");
      return getMoves(
        allyLocations,
        enemyLocations,
        directions,
        currentTile,
        7,
        color,
        false
      );
    },
  },
  queen: {
    findTiles: (currentTile, allyLocations, enemyLocations, color) => {
      const { straightDirections, diagonalDirections } =
        createDirections("both");

      const diagonals = getMoves(
        allyLocations,
        enemyLocations,
        diagonalDirections,
        currentTile,
        7,
        color,
        true
      );

      const straights = getMoves(
        allyLocations,
        enemyLocations,
        straightDirections,
        currentTile,
        7,
        color,
        false
      );

      return {
        moves: [diagonals.moves, straights.moves].flat(),
        attacks: [diagonals.attacks, straights.attacks].flat(),
        protections: [diagonals.protections, straights.protections].flat(),
      };
    },
  },
  king: {
    findTiles: (currentTile, allyLocations, enemyLocations, color) => {
      const { straightDirections, diagonalDirections } =
        createDirections("both");

      const diagonals = getMoves(
        allyLocations,
        enemyLocations,
        diagonalDirections,
        currentTile,
        1,
        color,
        true
      );

      const straights = getMoves(
        allyLocations,
        enemyLocations,
        straightDirections,
        currentTile,
        1,
        color,
        false
      );

      return {
        moves: [diagonals.moves, straights.moves].flat(),
        attacks: [diagonals.attacks, straights.attacks].flat(),
        protections: [diagonals.protections, straights.protections].flat(),
      };
    },
  },
};

function getMoves(
  allyLocations,
  enemyLocations,
  directions,
  currentTile,
  limit,
  color,
  diagonals
) {
  const { up, down, left, right } = directions;
  for (let i = 1; i <= limit; i++) {
    const currentDir = diagonals
      ? {
          up: {
            //upRight
            x: currentTile.x + i,
            y: currentTile.y + i,
          },
          down: {
            //upLeft
            x: currentTile.x - i,
            y: currentTile.y + i,
          },
          right: {
            //downRight
            x: currentTile.x + i,
            y: currentTile.y - i,
          },
          left: {
            //downLeft
            x: currentTile.x - i,
            y: currentTile.y - i,
          },
        }
      : {
          up: {
            x: currentTile.x,
            y: currentTile.y + i,
          },
          down: {
            x: currentTile.x,
            y: currentTile.y - i,
          },
          right: {
            x: currentTile.x + i,
            y: currentTile.y,
          },
          left: {
            x: currentTile.x - i,
            y: currentTile.y,
          },
        };

    try {
      calculateAttacksAndMoves(
        [allyLocations, enemyLocations].flat(),
        directions,
        currentDir,
        color
      );
    } catch (e) {
      console.error(e, currentTile, directions);
    }
  }

  return {
    moves: [
      up.legalMoves,
      down.legalMoves,
      left.legalMoves,
      right.legalMoves,
    ].flat(),
    attacks: [
      up.attackTile,
      down.attackTile,
      left.attackTile,
      right.attackTile,
    ].flat(),
    protections: [
      up.protectingTile,
      down.protectingTile,
      left.protectingTile,
      right.protectingTile,
    ].flat(),
  };
}

function calculateAttacksAndMoves(
  pieceLocations,
  directions,
  currentDir,
  color
) {
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
          if (location.pieceOnTile.color !== color) {
            direction.attackTile.push(location);
          } else if (location.pieceOnTile.color === color) {
            if (direction.protectingTile) {
              direction?.protectingTile.push(location);
            }
          }
        }
      });

      if (!direction.blocked) {
        direction.legalMoves.push(currentDirection);
      }
    } else {
      direction.blocked = true;
    }
  }
}
