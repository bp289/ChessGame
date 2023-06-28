export const moveMap = {
  pawn: {
    findTiles: (currentTile, allyLocations, enemyLocations, color) => {
      const directions = {
        up: { legalMoves: [], attackTile: [], blocked: false },
        down: { legalMoves: [], attackTile: [], blocked: true },
        left: { legalMoves: [], attackTile: [], blocked: true },
        right: { legalMoves: [], attackTile: [], blocked: true },
      };

      const otherPieces = allyLocations;
      const enemyPieces = [];
      if (color === "white") {
        return currentTile.pieceOnTile.firstMove
          ? getStraight(
              otherPieces,
              enemyPieces,
              directions,
              currentTile,
              2,
              color
            )
          : getStraight(
              otherPieces,
              enemyPieces,
              directions,
              currentTile,
              1,
              color
            );
      } else {
        directions.up.blocked = true;
        directions.down.blocked = false;
        return currentTile.pieceOnTile.firstMove
          ? getStraight(
              otherPieces,
              enemyPieces,
              directions,
              currentTile,
              2,
              color
            )
          : getStraight(
              otherPieces,
              enemyPieces,
              directions,
              currentTile,
              1,
              color
            );
      }
    },
  },
  knight: {
    findTiles: (selectedTile, allyLocations, enemyLocations) => {
      const tiles = [];
      tiles.push(
        { x: selectedTile.x - 1, y: selectedTile.y + 2 },
        { x: selectedTile.x + 1, y: selectedTile.y + 2 },
        { x: selectedTile.x - 1, y: selectedTile.y - 2 },
        { x: selectedTile.x + 1, y: selectedTile.y - 2 },
        { x: selectedTile.x + 2, y: selectedTile.y - 1 },
        { x: selectedTile.x - 2, y: selectedTile.y - 1 },
        { x: selectedTile.x + 2, y: selectedTile.y + 1 },
        { x: selectedTile.x - 2, y: selectedTile.y + 1 }
      );

      const loc = allyLocations.flat().map((e) => {
        return { x: e.x, y: e.y };
      });
      [...tiles].forEach((validTile) => {
        for (let i = 0; i < loc.length; i++) {
          if (loc[i].x === validTile.x && loc[i].y === validTile.y) {
            tiles.splice(tiles.indexOf(validTile), 1);
          }
        }
      });

      return tiles;
    },
  },
  bishop: {
    findTiles: (currentTile, allyLocations, enemyLocations, color) => {
      const directions = {
        upRight: { legalMoves: [], blocked: false },
        downRight: { legalMoves: [], blocked: false },
        upLeft: { legalMoves: [], blocked: false },
        downLeft: { legalMoves: [], blocked: false },
      };

      return getDiagonals(
        Object.values(allyLocations).flat(),
        directions,
        currentTile,
        7
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

      console.log("ally", allyLocations, "enemy", enemyLocations);

      const gaming = getStraight(
        allyLocations,
        enemyLocations,
        directions,
        currentTile,
        7,
        color
      );

      return gaming;
    },
  },
  queen: {
    findTiles: (currentTile, allyLocations, enemyLocations) => {
      const straightDirections = {
        up: { legalMoves: [], blocked: false },
        down: { legalMoves: [], blocked: false },
        left: { legalMoves: [], blocked: false },
        right: { legalMoves: [], blocked: false },
      };
      const diagonalDirections = {
        upRight: { legalMoves: [], blocked: false },
        downRight: { legalMoves: [], blocked: false },
        upLeft: { legalMoves: [], blocked: false },
        downLeft: { legalMoves: [], blocked: false },
      };
      return [
        getDiagonals(
          Object.values(allyLocations).flat(),
          diagonalDirections,
          currentTile,
          7
        ),
        // getStraight(
        //   Object.values(locations[currentTile.pieceOnTile.color]).flat(),
        //   straightDirections,
        //   currentTile,
        //   7
        // ),
      ].flat();
    },
  },
  king: {
    findTiles: (currentTile, allyLocations, enemyLocations) => {
      const straightDirections = {
        up: { legalMoves: [], attackTile: [], blocked: false },
        down: { legalMoves: [], attackTile: [], blocked: false },
        left: { legalMoves: [], attackTile: [], blocked: false },
        right: { legalMoves: [], attackTile: [], blocked: false },
      };
      const diagonalDirections = {
        upRight: { legalMoves: [], blocked: false },
        downRight: { legalMoves: [], blocked: false },
        upLeft: { legalMoves: [], blocked: false },
        downLeft: { legalMoves: [], blocked: false },
      };
      return [
        getDiagonals(
          Object.values(allyLocations).flat(),
          diagonalDirections,
          currentTile
        ),
        // getStraight(
        //   Object.values(locations[currentTile.pieceOnTile.color]).flat(),
        //   straightDirections,
        //   currentTile,
        //   1
        // ),
      ].flat();
    },
  },
};

function getDiagonals(pieceLocations, directions, currentTile, limit) {
  for (let i = 1; i <= limit; i++) {
    const currentUR = {
      x: currentTile.x + i,
      y: currentTile.y + i,
    };

    const currentUL = {
      x: currentTile.x - i,
      y: currentTile.y + i,
    };

    const currentDR = {
      x: currentTile.x + i,
      y: currentTile.y - i,
    };

    const currentDL = {
      x: currentTile.x - i,
      y: currentTile.y - i,
    };
    pieceLocations.forEach((location) => {
      if (location.x === currentUR.x && location.y === currentUR.y) {
        directions.upRight.blocked = true;
      }
      if (location.x === currentUR.x && location.y === currentUR.y) {
        directions.upRight.blocked = true;
      }
      if (location.x === currentUL.x && location.y === currentUL.y) {
        directions.upLeft.blocked = true;
      }
      if (location.x === currentDR.x && location.y === currentDR.y) {
        directions.downRight.blocked = true;
      }
      if (location.x === currentDL.x && location.y === currentDL.y) {
        directions.downLeft.blocked = true;
      }
    });
    if (!directions.upRight.blocked) {
      directions.upRight.legalMoves.push(currentUR);
    }
    if (!directions.upLeft.blocked) {
      directions.upLeft.legalMoves.push(currentUL);
    }
    if (!directions.downRight.blocked) {
      directions.downRight.legalMoves.push(currentDR);
    }
    if (!directions.downLeft.blocked) {
      directions.downLeft.legalMoves.push(currentDL);
    }
  }

  return {
    moves: [
      directions.upRight.legalMoves,
      directions.downRight.legalMoves,
      directions.upLeft.legalMoves,
      directions.downLeft.legalMoves,
    ].flat(),
    attacks: [],
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
  const pawn = false;
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

    if (up.blocked) {
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
      right.attack,
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
      location.pieceOnTile.color !== color
        ? directions.up.attackTile.push(currentDir.up)
        : null;
    }
    if (
      location.x === currentDir.down.x &&
      location.y === currentDir.down.y &&
      !down.blocked
    ) {
      down.blocked = true;
      location.pieceOnTile.color !== color
        ? directions.down.attackTile.push(currentDir.down)
        : null;
    }
    if (
      location.x === currentDir.right.x &&
      location.y === currentDir.right.y &&
      !right.blocked
    ) {
      right.blocked = true;
      location.pieceOnTile.color !== color
        ? directions.right.attackTile.push(currentDir.right)
        : null;
    }
    if (
      location.x === currentDir.left.x &&
      location.y === currentDir.left.y &&
      !left.blocked
    ) {
      left.blocked = true;
      location.pieceOnTile.color !== color
        ? directions.left.attackTile.push(currentDir.left)
        : null;
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

function straightAttackFinder(enemyLocations, directions, currentDir) {
  const { up, down, left, right } = directions;
  const ends = {
    up: up[up.length - 1],
    down: down[down.length - 1],
    right: right[right.length - 1],
    left: left[right.length - 1],
  };
}
