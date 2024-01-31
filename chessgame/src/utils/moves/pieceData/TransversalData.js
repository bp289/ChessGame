export const incrementDiagonals = (i, currentTile) => {
  const { x, y } = currentTile;
  return {
    up: { x: x + i, y: y + i }, //upRight
    down: { x: x - i, y: y + i }, //upLeft
    right: { x: x + i, y: y - i }, //downRight
    left: { x: x - i, y: y - i }, //downLeft
  };
};

export const incrementStraights = (i, currentTile) => {
  const { x, y } = currentTile;
  return {
    up: { x, y: y + i },
    down: { x, y: y - i },
    right: { x: x + i, y },
    left: { x: x - i, y },
  };
};
