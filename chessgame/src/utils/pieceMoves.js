export const moveMap = {
  pawn: {
    findTiles: (currentTile, locations) => {
      const directions = {
        up: { legalMoves: [], attackTile: [], blocked: false },
        down: { legalMoves: [], attackTile: [], blocked: true },
        left: { legalMoves: [], attackTile: [], blocked: true },
        right: { legalMoves: [], attackTile: [], blocked: true },
      };
      const legalMoves = [];
      if (currentTile.pieceOnTile.color === "white") {
        const otherPieces = Object.values(locations.white).flat();
        const enemyPieces = Object.values(locations.black).flat();
        return currentTile.pieceOnTile.firstMove
          ? getStraight(otherPieces, directions, currentTile, 2, enemyPieces)
          : getStraight(otherPieces, directions, currentTile, 1, enemyPieces);
      } else if (currentTile.pieceOnTile.color === "black") {
        directions.up.blocked = true;
        directions.down.blocked = false;

        const otherPieces = Object.values(locations.black).flat();

        const enemyPieces = Object.values(locations.white).flat();

        return currentTile.pieceOnTile.firstMove
          ? getStraight(otherPieces, directions, currentTile, 2, enemyPieces)
          : getStraight(otherPieces, directions, currentTile, 1, enemyPieces);
      }
      return legalMoves;
    },
  },
  knight: {
    findTiles: (selectedTile, locations) => {
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

      if (selectedTile.pieceOnTile.color === "white") {
        const loc = Object.values(locations.white)
          .flat()
          .map((e) => {
            return { x: e.x, y: e.y };
          });
        [...tiles].forEach((validTile) => {
          for (let i = 0; i < loc.length; i++) {
            if (loc[i].x === validTile.x && loc[i].y === validTile.y) {
              tiles.splice(tiles.indexOf(validTile), 1);
            }
          }
        });
      }

      if (selectedTile.pieceOnTile.color === "black") {
        const loc = Object.values(locations.white)
          .flat()
          .map((e) => {
            return { x: e.x, y: e.y };
          });
        [...tiles].forEach((validTile) => {
          for (let i = 0; i < loc.length; i++) {
            if (loc[i].x === validTile.x && loc[i].y === validTile.y) {
              tiles.splice(tiles.indexOf(validTile), 1);
            }
          }
        });
      }
      return tiles;
    },
  },
  bishop: {
    findTiles: (currentTile, locations) => {
      const directions = {
        upRight: { legalMoves: [], blocked: false },
        downRight: { legalMoves: [], blocked: false },
        upLeft: { legalMoves: [], blocked: false },
        downLeft: { legalMoves: [], blocked: false },
      };

      return getDiagonals(
        Object.values(locations[currentTile.pieceOnTile.color]).flat(),
        directions,
        currentTile,
        7
      );
    },
  },
  rook: {
    findTiles: (currentTile, locations) => {
      const tiles = [];

      const directions = {
        up: { legalMoves: [], attackTile: [], blocked: false },
        down: { legalMoves: [], attackTile: [], blocked: false },
        left: { legalMoves: [], attackTile: [], blocked: false },
        right: { legalMoves: [], attackTile: [], blocked: false },
      };

      return getStraight(
        Object.values(locations[currentTile.pieceOnTile.color]).flat(),
        directions,
        currentTile,
        7,
        Object.values(
          locations[
            currentTile.pieceOnTile.color === "black" ? "white" : "black"
          ]
        ).flat()
      );
    },
  },
  queen: {
    findTiles: (currentTile, locations) => {
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
          Object.values(locations[currentTile.pieceOnTile.color]).flat(),
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
    findTiles: (currentTile, locations) => {
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
          Object.values(locations[currentTile.pieceOnTile.color]).flat(),
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
  pieceLocations,
  directions,
  currentTile,
  limit,
  enemyLocations
) {
  const { up, down, left, right } = directions;
  const pawn = false;
  for (let i = 1; i <= limit; i++) {
    const currentUp = {
      x: currentTile.x,
      y: currentTile.y + i,
    };
    const currentDown = {
      x: currentTile.x,
      y: currentTile.y - i,
    };
    const currentRight = {
      x: currentTile.x + i,
      y: currentTile.y,
    };
    const currentLeft = {
      x: currentTile.x - i,
      y: currentTile.y,
    };

    pieceLocations.forEach((location) => {
      if (location.x === currentUp.x && location.y === currentUp.y) {
        up.blocked = true;
        up.attackTile.push({ y: currentUp.y + 1, ...currentUp });
      }
      if (location.x === currentDown.x && location.y === currentDown.y) {
        down.blocked = true;
        down?.attackTile.push({ y: currentDown.y - 1, ...currentDown });
      }
      if (location.x === currentRight.x && location.y === currentRight.y) {
        right.blocked = true;
        right?.attackTile.push({ x: currentRight.y + 1, ...currentRight });
      }
      if (location.x === currentLeft.x && location.y === currentLeft.y) {
        left.blocked = true;
        left?.attackTile.push({ y: currentLeft.y - 1, ...currentLeft });
      }
    });

    if (!up.blocked) {
      up.legalMoves.push(currentUp);
    }
    if (!down.blocked) {
      down.legalMoves.push(currentDown);
    }
    if (!right.blocked) {
      right.legalMoves.push(currentRight);
    }
    if (!left.blocked) {
      left.legalMoves.push(currentLeft);
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
  };
}
