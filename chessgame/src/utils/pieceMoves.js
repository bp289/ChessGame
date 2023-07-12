export const moveMap = {
  pawn: {
    findTiles: (currentTile, allyLocations, enemyLocations, color) => {
      const directions = {
        up: { legalMoves: [], attackTile: [], blocked: false }, //upRight
        down: { legalMoves: [], attackTile: [], blocked: true }, //upLeft
        left: { legalMoves: [], attackTile: [], blocked: true }, //downRight
        right: { legalMoves: [], attackTile: [], blocked: true }, //downLeft
      };

      const attackDirections = {
        up: { legalMoves: [], attackTile: [], blocked: false }, //upRight
        down: { legalMoves: [], attackTile: [], blocked: false }, //upLeft
        left: { legalMoves: [], attackTile: [], blocked: true }, //downRight
        right: { legalMoves: [], attackTile: [], blocked: true }, //downLeft
      };

      if (color === "white") {
        return currentTile.pieceOnTile?.firstMove
          ? {
              moves: getMoves(
                allyLocations,
                [],
                directions,
                currentTile,
                2,
                color,
                false
              ).moves,
              attacks: getMoves(
                [],
                enemyLocations,
                attackDirections,
                currentTile,
                1,
                color,
                true
              ).attacks,
            }
          : {
              moves: getMoves(
                allyLocations,
                [],
                directions,
                currentTile,
                1,
                color,
                false
              ).moves,
              attacks: getMoves(
                [],
                enemyLocations,
                attackDirections,
                currentTile,
                1,
                color,
                true
              ).attacks,
            };
      } else {
        directions.up.blocked = true;
        directions.down.blocked = false;
        for (let direction in attackDirections) {
          attackDirections[direction].blocked =
            !attackDirections[direction].blocked;
        }

        return currentTile.pieceOnTile?.firstMove
          ? {
              moves: getMoves(
                allyLocations,
                [],
                directions,
                currentTile,
                2,
                color,
                false
              ).moves,
              attacks: getMoves(
                [],
                enemyLocations,
                attackDirections,
                currentTile,
                1,
                color,
                true
              ).attacks,
            }
          : {
              moves: getMoves(
                allyLocations,
                [],
                directions,
                currentTile,
                1,
                color,
                false
              ).moves,
              attacks: getMoves(
                [],
                enemyLocations,
                attackDirections,
                currentTile,
                1,
                color,
                true
              ).attacks,
            };
      }
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

      const loc = [allyLocations, enemyLocations].flat();

      [...tiles].forEach((validTile) => {
        if (isValidCoordinate(validTile.x, validTile.y)) {
          for (let i = 0; i < loc.length; i++) {
            if (loc[i].x === validTile.x && loc[i].y === validTile.y) {
              if (loc[i].pieceOnTile.color == color) {
                tiles.splice(tiles.indexOf(validTile), 1);
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

      return { moves: tiles, attacks: attacks };
    },
  },
  bishop: {
    findTiles: (currentTile, allyLocations, enemyLocations, color) => {
      const directions = {
        up: { legalMoves: [], attackTile: [], blocked: false },
        down: { legalMoves: [], attackTile: [], blocked: false },
        left: { legalMoves: [], attackTile: [], blocked: false },
        right: { legalMoves: [], attackTile: [], blocked: false },
      };

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
      const directions = {
        up: { legalMoves: [], attackTile: [], blocked: false },
        down: { legalMoves: [], attackTile: [], blocked: false },
        left: { legalMoves: [], attackTile: [], blocked: false },
        right: { legalMoves: [], attackTile: [], blocked: false },
      };

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
      const straightDirections = {
        up: { legalMoves: [], attackTile: [], blocked: false },
        down: { legalMoves: [], attackTile: [], blocked: false },
        left: { legalMoves: [], attackTile: [], blocked: false },
        right: { legalMoves: [], attackTile: [], blocked: false },
      };
      const diagonalDirections = {
        up: { legalMoves: [], attackTile: [], blocked: false },
        down: { legalMoves: [], attackTile: [], blocked: false },
        left: { legalMoves: [], attackTile: [], blocked: false },
        right: { legalMoves: [], attackTile: [], blocked: false },
      };

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
      };
    },
  },
  king: {
    findTiles: (currentTile, allyLocations, enemyLocations, color) => {
      const straightDirections = {
        up: { legalMoves: [], attackTile: [], blocked: false },
        down: { legalMoves: [], attackTile: [], blocked: false },
        left: { legalMoves: [], attackTile: [], blocked: false },
        right: { legalMoves: [], attackTile: [], blocked: false },
      };
      const diagonalDirections = {
        up: { legalMoves: [], attackTile: [], blocked: false },
        down: { legalMoves: [], attackTile: [], blocked: false },
        left: { legalMoves: [], attackTile: [], blocked: false },
        right: { legalMoves: [], attackTile: [], blocked: false },
      };

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
      };
    },
    checkForChecks: (
      currentMoves,
      currentLocation,
      enemyAttacks,
      enemyMoves,
      enemyLocations
    ) => {
      const { x, y } = currentLocation;
      let checkCount = 0;
      let isInCheck = false;
      const potentialChecks = [];
      const potentialAttacks = [];
      console.log(currentLocation);
      enemyAttacks.forEach((enemyAttack) => {
        for (const attack of enemyAttack.attacks) {
          if (attack.x == x && attack.y == y) {
            isInCheck = true;
            checkCount++;
          }
        }
      });

      enemyMoves.forEach((enemyMove) => {
        const { piece, moves } = enemyMove;
        const color = currentLocation.color === "black" ? "white" : "black";
        const dangerousMoves = { piece, checkMoves: [] };
        for (const move of moves) {
          dangerousMoves.checkMoves.push(
            moveMap[piece].findTiles(
              move,
              enemyLocations,
              [currentLocation],
              color
            ).attacks
          );
        }

        potentialAttacks.push(dangerousMoves);
      });

      console.log(potentialAttacks);

      return { isInCheck, potentialChecks, checkCount };
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

    calculateAttacksAndMoves(
      [allyLocations, enemyLocations].flat(),
      directions,
      currentDir,
      color
    );
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
  };
}

function calculateAttacksAndMoves(
  pieceLocations,
  directions,
  currentDir,
  color
) {
  const { up, down, left, right } = directions;

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
            direction.attackTile.push(currentDirection);
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

function isValidCoordinate(x, y) {
  return x >= 1 && x <= 8 && y >= 1 && y <= 8;
}
