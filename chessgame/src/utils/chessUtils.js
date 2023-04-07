import tile from "../components/Tile";
import { findStyleClass } from "./chessBoardUtils";

export const showMoves = (selectedTile, board) => {
  const piece = selectedTile.pieceOnTile;
  // let legalMoves = moveMap[piece.name].findTiles(selectedTile, pieceDetails);

  // return board.map((tile) => {
  //   if (tile.value === selectedTile.value) {
  //     return {
  //       ...tile,
  //       styleClass: `${findStyleClass(tile.x, tile.y)}-selected`,
  //     };
  //   } else {
  //     for (let i = 0; i < legalMoves.length; i++) {
  //       if (legalMoves[i].x === tile.x && legalMoves[i].y === tile.y) {
  //         return {
  //           ...tile,
  //           styleClass: `${findStyleClass(tile.x, tile.y)}-movable`,
  //         };
  //       }
  //     }
  //     return { ...tile, styleClass: findStyleClass(tile.x, tile.y) };
  //   }
  // });
};

export const legalMoves = (board) => {
  let pieceLocations = getBoardDetails(board);

  const white = { ...pieceLocations.white };
  const black = { ...pieceLocations.black };

  Object.keys(white).forEach((piece) => {
    pieceLocations.white[piece] = white[piece].map((tile) => {
      console.log(piece);
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

export const getBoardDetails = (board) => {
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
    findTiles: (currentTile, Locations) => {
      const legalMoves = [];
      if (currentTile.pieceOnTile.color === "white") {
        const otherPieces = Locations.white;
        Object.values(otherPieces).forEach((piece) => {
          if (currentTile.x + 1 !== piece.x) {
            return [];
          }
        });
        legalMoves.push(
          { x: currentTile.x, y: currentTile.y + 2 },
          { x: currentTile.x, y: currentTile.y + 1 }
        );
      } else if (currentTile.pieceOnTile.color === "black") {
        const otherPieces = Locations.white;
        Object.values(otherPieces).forEach((piece) => {
          if (currentTile.x + 1 !== piece.x) {
            return [];
          }
        });
        legalMoves.push(
          { x: currentTile.x, y: currentTile.y - 2 },
          { x: currentTile.x, y: currentTile.y - 1 }
        );
      }
      return legalMoves;
    },
  },
  knight: {
    findTiles: (selectedTile) => {
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
      return [];
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
        return getDiagonals(locations.white, directions, currentTile);
      }

      if (currentTile.pieceOnTile.color === "black") {
        return getDiagonals(locations.black, directions, currentTile);
      }
    },
  },
  rook: {
    findTiles: (selectedTile) => {
      const tiles = [];
      for (let i = 1; i <= 7; i++) {
        tiles.push(
          {
            x: selectedTile.x,
            y: selectedTile.y + i,
          },
          {
            x: selectedTile.x + i,
            y: selectedTile.y,
          },
          {
            x: selectedTile.x,
            y: selectedTile.y - i,
          },
          {
            x: selectedTile.x - i,
            y: selectedTile.y,
          }
        );
      }
      return tiles;
    },
  },
  queen: {
    findTiles: (selectedTile, color) => {
      const tiles = [];
      for (let i = 1; i <= 7; i++) {
        tiles.push(
          {
            x: selectedTile.x + i,
            y: selectedTile.y + i,
          },
          {
            x: selectedTile.x - i,
            y: selectedTile.y + i,
          },
          {
            x: selectedTile.x + i,
            y: selectedTile.y - i,
          },
          {
            x: selectedTile.x - i,
            y: selectedTile.y - i,
          },
          {
            x: selectedTile.x,
            y: selectedTile.y + i,
          },
          {
            x: selectedTile.x + i,
            y: selectedTile.y,
          },
          {
            x: selectedTile.x,
            y: selectedTile.y - i,
          },
          {
            x: selectedTile.x - i,
            y: selectedTile.y,
          }
        );
      }
      return tiles;
    },
  },
  king: {
    findTiles: (selectedTile) => {
      const tiles = [];
      tiles.push(
        { x: selectedTile.x + 1, y: selectedTile.y },
        { x: selectedTile.x + 1, y: selectedTile.y + 1 },
        { x: selectedTile.x, y: selectedTile.y + 1 },
        { x: selectedTile.x - 1, y: selectedTile.y + 1 },
        { x: selectedTile.x - 1, y: selectedTile.y },
        { x: selectedTile.x - 1, y: selectedTile.y - 1 },
        { x: selectedTile.x, y: selectedTile.y - 1 },
        { x: selectedTile.x + 1, y: selectedTile.y - 1 }
      );
      return tiles;
    },
  },
};

function getDiagonals(pieces, directions, currentTile) {
  for (let i = 1; i <= 7; i++) {
    if (!directions.upRight.blocked) {
      const currentUR = {
        x: currentTile.x + i,
        y: currentTile.y + i,
      };

      directions.upRight.legalMoves.push(currentUR);
    }
    if (!directions.upLeft.blocked) {
      const currentUL = {
        x: currentTile.x - i,
        y: currentTile.y + i,
      };

      directions.upLeft.legalMoves.push(currentUL);
    }
    if (!directions.downRight.blocked) {
      const currentDR = {
        x: currentTile.x + i,
        y: currentTile.y - i,
      };

      directions.downRight.legalMoves.push(currentDR);
    }
    if (!directions.downLeft.blocked) {
      const currentDR = {
        x: currentTile.x - i,
        y: currentTile.y - i,
      };

      directions.downLeft.legalMoves.push(currentDR);
    }
  }
  return null;
}
