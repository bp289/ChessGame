import { moveMap } from "../pieceMoves";
import { getValidMovesOnPin } from "./pinCalcs";

export const setPins = (
  pieceLocations,
  white,
  black,
  whiteAttacks,
  blackAttacks
) => {
  const pinnedBlackPieces = reducedPinAttacks(
    whiteAttacks,
    { ...black },
    { ...white },
    pieceLocations.black
  );

  const pinnedWhitePieces = reducedPinAttacks(
    blackAttacks,
    { ...white },
    { ...black },
    pieceLocations.white
  );

  console.log(pinnedWhitePieces);

  return { white: pinnedWhitePieces, black: pinnedBlackPieces };
};

const reducedPinAttacks = (
  enemysPinAttacks,
  allyLocations,
  enemyLocations,
  pieceLocations
) => {
  const { queens, rooks, bishops } = enemysPinAttacks;
  // const pieceInfo = { ...pieceLocations };
  let pieceData = { ...pieceLocations };
  const queenPins = checkForPins(
    queens,
    allyLocations,
    enemyLocations,
    "queen"
  );
  pieceData = filterMovesFromPins(queenPins, pieceData);
  const rookPins = checkForPins(rooks, allyLocations, enemyLocations, "rook");
  pieceData = filterMovesFromPins(rookPins, pieceData);
  const bishopPins = checkForPins(
    bishops,
    allyLocations,
    enemyLocations,
    "bishop"
  );
  pieceData = filterMovesFromPins(bishopPins, pieceData);

  return pieceData;
};

const checkForPins = (
  pinningPieces,
  allyLocations,
  enemyLocations,
  pieceName
) => {
  const pins = {};
  for (let piece of pinningPieces) {
    const {
      attacks,
      currentTile: {
        value: enemyValue,
        pieceOnTile: { color: enemyColor },
        x,
        y,
      },
    } = piece;

    const attackerXY = { x, y };

    if (attacks.length > 0) {
      const pinnedPieces = attacks.reduce((totalPinningAttacks, attack) => {
        const {
          pieceUnderAttack: {
            pieceOnTile: { name },
            value: pieceUnderAttackValue,
            x,
            y,
          },
        } = attack;

        const pieceUnderAttackXY = { x, y };
        const newAllyLocations = { ...allyLocations };

        newAllyLocations[name] = newAllyLocations[name].filter(
          (currentPiece) => currentPiece.value !== pieceUnderAttackValue
        );

        const movesWithoutPieceUnderAttack = moveMap[pieceName].findTiles(
          piece.currentTile,
          Object.values(newAllyLocations).flat(),
          Object.values(enemyLocations).flat(),
          enemyColor
        );

        const attackOnKing = movesWithoutPieceUnderAttack.attacks.find(
          (attack) => attack.pieceUnderAttack.pieceOnTile.name === "king"
        );

        if (attackOnKing) {
          const { pieceUnderAttack: king } = attackOnKing;

          const kingXY = { x: king.x, y: king.y };
          console.log("victim ->", name, attack, "is pinned:", attackOnKing);

          const moves = [
            getValidMovesOnPin(pieceUnderAttackXY, attackerXY),
            getValidMovesOnPin(pieceUnderAttackXY, kingXY).filter(
              ({ x, y }) => x !== kingXY.x && y !== kingXY.y
            ),
          ].flat();

          totalPinningAttacks.push({
            pinnedPiece: attack.pieceUnderAttack,
            allowedMoves: moves,
          });

          return totalPinningAttacks;
        }

        return totalPinningAttacks;

        // find the direction from which you are being attacked from
      }, []);

      console.log(pinnedPieces);

      if (pinnedPieces.length > 0) {
        pins[enemyValue] = pinnedPieces;
      }
    }
  }

  return pins;
};

const filterMovesFromPins = (pinnedPieces, allPieceData) => {
  for (let piece in pinnedPieces) {
    const currentPins = pinnedPieces[piece];

    currentPins.forEach((piece) => {
      const {
        pinnedPiece: {
          value: pinnedValue,
          pieceOnTile: { name },
        },
        allowedMoves, //TODO: MAKE SURE THIS IS THE ONLY MOVES BEING USED BY THE PIECE
      } = piece;

      allPieceData[name].forEach((piece, index) => {
        if (piece.currentlyAt.value === pinnedValue) {
          allPieceData[name][index].legalMoves = allPieceData[name][
            index
          ].legalMoves.filter((move) =>
            allowedMoves.some((allowedMove) => xyMatch(move, allowedMove))
          );

          allPieceData[name][index].legalAttacks = allPieceData[name][
            index
          ].legalAttacks.filter((attack) =>
            allowedMoves.some((allowedMove) =>
              xyMatch(attack.pieceUnderAttack, allowedMove)
            )
          );
        }
      });
    });
  }

  return allPieceData;
};

const xyMatch = (xy1, xy2) => xy1.x === xy2.x && xy1.y === xy2.y;
