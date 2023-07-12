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
        return currentTile.pieceOnTile.firstMove
          ? {
              moves: getStraight(
                allyLocations,
                [],
                directions,
                currentTile,
                2,
                color
              ).moves,
              attacks: getDiagonals(
                [],
                enemyLocations,
                attackDirections,
                currentTile,
                1
              ).attacks,
            }
          : {
              moves: getStraight(
                allyLocations,
                [],
                directions,
                currentTile,
                1,
                color
              ).moves,
              attacks: getDiagonals(
                [],
                enemyLocations,
                attackDirections,
                currentTile,
                1
              ).attacks,
            };
      } else {
        directions.up.blocked = true;
        directions.down.blocked = false;
        for (let direction in attackDirections) {
          attackDirections[direction].blocked =
            !attackDirections[direction].blocked;
        }

        return currentTile.pieceOnTile.firstMove
          ? {
              moves: getStraight(
                allyLocations,
                [],
                directions,
                currentTile,
                2,
                color
              ).moves,
              attacks: getDiagonals(
                [],
                enemyLocations,
                attackDirections,
                currentTile,
                1
              ).attacks,
            }
          : {
              moves: getStraight(
                allyLocations,
                [],
                directions,
                currentTile,
                1,
                color
              ).moves,
              attacks: getDiagonals(
                [],
                enemyLocations,
                attackDirections,
                currentTile,
                1
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

      return getDiagonals(
        allyLocations,
        enemyLocations,
        directions,
        currentTile,
        7,
        color
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

      return getStraight(
        allyLocations,
        enemyLocations,
        directions,
        currentTile,
        7,
        color
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

      const diagonals = getDiagonals(
        allyLocations,
        enemyLocations,
        diagonalDirections,
        currentTile,
        7,
        color
      );

      const straights = getStraight(
        allyLocations,
        enemyLocations,
        straightDirections,
        currentTile,
        7,
        color
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

      const diagonals = getDiagonals(
        allyLocations,
        enemyLocations,
        diagonalDirections,
        currentTile,
        1,
        color
      );

      const straights = getStraight(
        allyLocations,
        enemyLocations,
        straightDirections,
        currentTile,
        1,
        color
      );

      return {
        moves: [diagonals.moves, straights.moves].flat(),
        attacks: [diagonals.attacks, straights.attacks].flat(),
      };
    },
    checkForChecks: (currentMoves, currentLocation, enemyAttacks) => {
      return { isInCheck: null, movesThatCheck: [] };
    },
  },
};

function getDiagonals(
  allyLocations,
  enemyLocations,
  directions,
  currentTile,
  limit,
  color
) {
  const { up, down, left, right } = directions;

  for (let i = 1; i <= limit; i++) {
    const currentDir = {
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
    };

    straightMoveFinder(
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

function getStraight(
  allyLocations,
  enemyLocations,
  directions,
  currentTile,
  limit,
  color
) {
  const { up, down, left, right } = directions;
  for (let i = 1; i <= limit; i++) {
    const currentDir = {
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

    straightMoveFinder(
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
      up?.attackTile,
      down?.attackTile,
      left?.attackTile,
      right?.attack,
    ].flat(),
  };
}

function straightMoveFinder(pieceLocations, directions, currentDir, color) {
  const { up, down, left, right } = directions;

  pieceLocations.forEach((location) => {
    if (
      location.x === currentDir.up.x &&
      location.y === currentDir.up.y &&
      !up.blocked
    ) {
      up.blocked = true;
      if (location.pieceOnTile.color !== color)
        directions.up.attackTile.push(currentDir.up);
    }
    if (
      location.x === currentDir.down.x &&
      location.y === currentDir.down.y &&
      !down.blocked
    ) {
      down.blocked = true;
      if (location.pieceOnTile.color !== color)
        directions.down.attackTile.push(currentDir.down);
    }
    if (
      location.x === currentDir.right.x &&
      location.y === currentDir.right.y &&
      !right.blocked
    ) {
      right.blocked = true;
      if (location.pieceOnTile.color !== color)
        directions.right.attackTile.push(currentDir.right);
    }
    if (
      location.x === currentDir.left.x &&
      location.y === currentDir.left.y &&
      !left.blocked
    ) {
      left.blocked = true;
      if (location.pieceOnTile.color !== color)
        directions.left.attackTile.push(currentDir.left);
    }
  });

  if (!up.blocked) {
    up.legalMoves.push(currentDir.up);
  }
  if (!down.blocked) {
    down.legalMoves.push(currentDir.down);
  }
  if (!right.blocked) {
    right.legalMoves.push(currentDir.right);
  }
  if (!left.blocked) {
    left.legalMoves.push(currentDir.left);
  }
}
