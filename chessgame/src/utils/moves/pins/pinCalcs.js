const findDeltaSign = (num) => {
  if (num === 0) return num;
  if (num > 0) return 1;
  if (num < 0) return -1;
};

// calculate x1 - x2 and y1 - y2 to get the total distance.
const calculateDelta = (origin, destination) => {
  const deltaX = destination.x - origin.x;
  const deltaY = destination.y - origin.y;

  return { x: deltaX, y: deltaY };
};

export const getValidMovesOnPin = (pieceOrigin, destination) => {
  const moves = [];
  let { x: originX, y: originY } = pieceOrigin;
  let { x: deltaX, y: deltaY } = calculateDelta(pieceOrigin, destination);
  // if we have positive we move up, if negative we move down
  const ySign = findDeltaSign(deltaY);
  //if we have positive we move left, if negative we move right
  const xSign = findDeltaSign(deltaX);

  while (deltaX !== 0 || deltaY !== 0) {
    originX += xSign;
    originY += ySign;
    moves.push({ x: originX, y: originY });
    if (deltaX !== 0) deltaX += xSign * -1;
    if (deltaY !== 0) deltaY += ySign * -1;
  }

  return moves;
};
