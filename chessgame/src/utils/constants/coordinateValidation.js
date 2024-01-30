export const xyMatch = (xy1, xy2) => xy1.x === xy2.x && xy1.y === xy2.y;

export const isValidCoordinate = (x, y) => x >= 1 && x <= 8 && y >= 1 && y <= 8;
