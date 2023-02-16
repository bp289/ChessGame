const checkMoves = (selectedTile, board) => {
  const piece = selectedTile.pieceOnTile.piece;
  return moveMap[piece].findTiles(selectedTile);
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
  knight: { findTiles: (selectedTile, color) => {} },
  bishop: {
    findTiles: (selectedTile) => {
      const tiles = [];
      for (let i = 1; i <= 7; i++) {
        tiles.push({
          x: selectedTile.x + i,
          y: selectedTile.y + i,
        });
        tiles.push({
          x: selectedTile.x - i,
          y: selectedTile.y + i,
        });
        tiles.push({
          x: selectedTile.x + i,
          y: selectedTile.y - i,
        });
        tiles.push({
          x: selectedTile.x - i,
          y: selectedTile.y - i,
        });
      }
      return tiles;
    },
  },
  rook: {
    findTiles: (selectedTile) => {
      const tiles = [];
      for (let i = 1; i <= 7; i++) {
        tiles.push({
          x: selectedTile.x,
          y: selectedTile.y + i,
        });
        tiles.push({
          x: selectedTile.x + i,
          y: selectedTile.y,
        });
        tiles.push({
          x: selectedTile.x,
          y: selectedTile.y - i,
        });
        tiles.push({
          x: selectedTile.x - i,
          y: selectedTile.y,
        });
      }
      return tiles;
    },
  },
  queen: {
    findTiles: (selectedTile, color) => {
      const tiles = [];
      for (let i = 1; i <= 7; i++) {
        tiles.push({
          x: selectedTile.x + i,
          y: selectedTile.y + i,
        });
        tiles.push({
          x: selectedTile.x - i,
          y: selectedTile.y + i,
        });
        tiles.push({
          x: selectedTile.x + i,
          y: selectedTile.y - i,
        });
        tiles.push({
          x: selectedTile.x - i,
          y: selectedTile.y - i,
        });
        tiles.push({
          x: selectedTile.x,
          y: selectedTile.y + i,
        });
        tiles.push({
          x: selectedTile.x + i,
          y: selectedTile.y,
        });
        tiles.push({
          x: selectedTile.x,
          y: selectedTile.y - i,
        });
        tiles.push({
          x: selectedTile.x - i,
          y: selectedTile.y,
        });
      }
      return tiles;
    },
  },
  king: { findTiles: (selectedTile, color) => {} },
};

module.exports = {
  checkMoves,
};
