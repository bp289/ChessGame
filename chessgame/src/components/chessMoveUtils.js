import { findStyleClass } from "./chessBoardUtils";

export const showMoves = (moves, selectedTile, board) => {
  console.log(selectedTile.value, moves);
  moves = moves[selectedTile.pieceOnTile.color][
    selectedTile.pieceOnTile?.name
  ].filter((e) => e.currentlyAt.value === selectedTile.value)[0].legalMoves;
  console.log(moves);
  return board.map((tile) => {
    if (tile.value === selectedTile.value) {
      return {
        ...tile,
        styleClass: `${findStyleClass(tile.x, tile.y)}-selected`,
      };
    } else {
      for (let i = 0; i < moves.length; i++) {
        if (moves[i].x === tile.x && moves[i].y === tile.y) {
          console.log({ ...tile, styleClass: "movable" });
          return {
            ...tile,
            styleClass: "movable",
          };
        }
      }
      return { ...tile, styleClass: findStyleClass(tile.x, tile.y) };
    }
  });
};

export const legalMoves = (board) => {
  let pieceLocations = getBoardDetails(board);

  const white = { ...pieceLocations.white };
  const black = { ...pieceLocations.black };

  Object.keys(white).forEach((piece) => {
    pieceLocations.white[piece] = white[piece].map((tile) => {
      return {
        currentlyAt: tile,
        legalMoves: moveMap[piece].findTiles(tile, getBoardDetails(board)),
      };
    });
  });

  Object.keys(black).forEach((piece) => {
    pieceLocations.black[piece] = black[piece].map((tile) => {
      return {
        currentlyAt: tile,
        legalMoves: moveMap[piece].findTiles(tile, getBoardDetails(board)),
      };
    });
  });

  return pieceLocations;
};

const getBoardDetails = (board) => {
  const pieceLocation = {
    white: {
      pawn: [],
      knight: [],
      bishop: [],
      rook: [],
      queen: [],
      king: [],
    },
    black: {
      pawn: [],
      knight: [],
      bishop: [],
      rook: [],
      queen: [],
      king: [],
    },
  };

  board.forEach((tile) => {
    if (tile.pieceOnTile?.color === "white") {
      if (pieceLocation.white[tile.pieceOnTile.name]) {
        pieceLocation.white[tile.pieceOnTile.name].push(tile);
      }
    }

    if (tile.pieceOnTile?.color === "black") {
      if (pieceLocation.black[tile.pieceOnTile.name]) {
        pieceLocation.black[tile.pieceOnTile.name].push(tile);
      }
    }
  });

  return pieceLocation;
};

const moveMap = {
  pawn: {
    findTiles: (currentTile, locations) => {
      const directions = {
        up: { legalMoves: [], blocked: false },
        down: { legalMoves: [], blocked: true },
        left: { legalMoves: [], blocked: true },
        right: { legalMoves: [], blocked: true },
      };
      const legalMoves = [];
      if (currentTile.pieceOnTile.color === "white") {
        const otherPieces = Object.values(locations.white)
          .flat()
          .map((e) => {
            return { x: e.x, y: e.y };
          });
        return currentTile.pieceOnTile.firstMove
          ? getStraight(otherPieces, directions, currentTile, 2)
          : getStraight(otherPieces, directions, currentTile, 1);
      } else if (currentTile.pieceOnTile.color === "black") {
        directions.up.blocked = true;
        directions.down.blocked = false;

        const otherPieces = Object.values(locations.black)
          .flat()
          .map((e) => {
            return { x: e.x, y: e.y };
          });
        return currentTile.pieceOnTile.firstMove
          ? getStraight(otherPieces, directions, currentTile, 2)
          : getStraight(otherPieces, directions, currentTile, 1);
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
        const loc = Object.values(locations.black)
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
      if (currentTile.pieceOnTile.color === "white") {
        return getDiagonals(
          Object.values(locations.white).flat(),
          directions,
          currentTile,
          7
        );
      }

      if (currentTile.pieceOnTile.color === "black") {
        return getDiagonals(
          Object.values(locations.black).flat(),
          directions,
          currentTile,
          7
        );
      }
    },
  },
  rook: {
    findTiles: (currentTile, locations) => {
      const directions = {
        up: { legalMoves: [], blocked: false },
        down: { legalMoves: [], blocked: false },
        left: { legalMoves: [], blocked: false },
        right: { legalMoves: [], blocked: false },
      };
      if (currentTile.pieceOnTile.color === "white") {
        return getStraight(
          Object.values(locations.white).flat(),
          directions,
          currentTile,
          7
        );
      }

      if (currentTile.pieceOnTile.color === "black") {
        return getStraight(
          Object.values(locations.black).flat(),
          directions,
          currentTile,
          7
        );
      }
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
      if (currentTile.pieceOnTile.color === "white") {
        return [
          getDiagonals(
            Object.values(locations.white).flat(),
            diagonalDirections,
            currentTile
          ),
          getStraight(
            Object.values(locations.white).flat(),
            straightDirections,
            currentTile,
            7
          ),
        ].flat();
      }

      if (currentTile.pieceOnTile.color === "black") {
        return [
          getDiagonals(
            Object.values(locations.black).flat(),
            diagonalDirections,
            currentTile
          ),
          getStraight(
            Object.values(locations.black).flat(),
            straightDirections,
            currentTile,
            7
          ),
        ].flat();
      }
    },
  },
  king: {
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
      if (currentTile.pieceOnTile.color === "white") {
        return [
          getDiagonals(
            Object.values(locations.white).flat(),
            diagonalDirections,
            currentTile,
            1
          ),
          getStraight(
            Object.values(locations.white).flat(),
            straightDirections,
            currentTile,
            1
          ),
        ].flat();
      }

      if (currentTile.pieceOnTile.color === "black") {
        return [
          getDiagonals(
            Object.values(locations.black).flat(),
            diagonalDirections,
            currentTile,
            1
          ),
          getStraight(
            Object.values(locations.black).flat(),
            straightDirections,
            currentTile,
            1
          ),
        ].flat();
      }
    },
  },
};

function getDiagonals(pieceLocations, directions, currentTile, limit) {
  for (let i = 1; limit <= 7; i++) {
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

  return [
    directions.upRight.legalMoves,
    directions.downRight.legalMoves,
    directions.upLeft.legalMoves,
    directions.downLeft.legalMoves,
  ].flat();
}

function getStraight(pieceLocations, directions, currentTile, limit) {
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
        directions.up.blocked = true;
      }
      if (location.x === currentDown.x && location.y === currentDown.y) {
        directions.down.blocked = true;
      }
      if (location.x === currentRight.x && location.y === currentRight.y) {
        directions.right.blocked = true;
      }
      if (location.x === currentLeft.x && location.y === currentLeft.y) {
        directions.left.blocked = true;
      }
    });
    if (!directions.up.blocked) {
      directions.up.legalMoves.push(currentUp);
    }
    if (!directions.down.blocked) {
      directions.down.legalMoves.push(currentDown);
    }
    if (!directions.right.blocked) {
      directions.right.legalMoves.push(currentRight);
    }
    if (!directions.left.blocked) {
      directions.left.legalMoves.push(currentLeft);
    }
  }

  return [
    directions.up.legalMoves,
    directions.down.legalMoves,
    directions.left.legalMoves,
    directions.right.legalMoves,
  ].flat();
}
