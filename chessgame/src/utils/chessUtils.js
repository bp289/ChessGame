import { findStyleClass } from "./chessBoardUtils";

export const showMoves = (selectedTile, board) => {
  const piece = selectedTile.pieceOnTile.piece;
  const legalMoves = moveMap[piece].findTiles(selectedTile);
  return board.map((tile) => {
    if (tile.value === selectedTile.value) {
      return {
        ...tile,
        styleClass: `${findStyleClass(tile.x, tile.y)}-selected`,
      };
    } else {
      for (let i = 0; i < legalMoves.length; i++) {
        if (legalMoves[i].x === tile.x && legalMoves[i].y === tile.y) {
          return {
            ...tile,
            styleClass: `${findStyleClass(tile.x, tile.y)}-movable`,
          };
        }
      }
      return { ...tile, styleClass: findStyleClass(tile.x, tile.y) };
    }
  });
};

const moveMap = {
  pawn: {
    findTiles: (selectedTile) => {
      if (selectedTile.pieceOnTile.color === "white") {
        return [
          { x: selectedTile.x, y: selectedTile.y + 2 },
          { x: selectedTile.x, y: selectedTile.y + 1 },
        ];
      } else if (selectedTile.pieceOnTile.color === "black") {
        return [
          { x: selectedTile.x, y: selectedTile.y - 2 },
          { x: selectedTile.x, y: selectedTile.y - 1 },
        ];
      }
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
      return tiles;
    },
  },
  bishop: {
    findTiles: (selectedTile) => {
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
          }
        );
      }
      return tiles;
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
