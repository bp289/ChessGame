import { moveMap } from "../pieceMoves";
import { getValidMovesOnPin } from "./pinCalcs";
import xyMatch from "../../constants/xyMatch";
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
          pieceOnTile: { name },
          value: pieceUnderAttackValue,
          x,
          y,
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
          (attack) => attack.pieceOnTile.name === "king"
        );

        if (attackOnKing) {
          const king = attackOnKing;

          const kingXY = { x: king.x, y: king.y };
          // console.log(
          //   "victim ->",
          //   name,
          //   attack,
          //   "is pinned:",
          //   attackOnKing ? true : false
          // );

          const moves = [
            getValidMovesOnPin(pieceUnderAttackXY, attackerXY),
            getValidMovesOnPin(pieceUnderAttackXY, kingXY).filter(
              ({ x, y }) => x !== kingXY.x && y !== kingXY.y
            ),
          ].flat();

          totalPinningAttacks.push({
            pinnedPiece: attack,
            allowedMoves: moves,
          });

          return totalPinningAttacks;
        }

        return totalPinningAttacks;

        // find the direction from which you are being attacked from
      }, []);

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
            allowedMoves.some((allowedMove) => xyMatch(attack, allowedMove))
          );
        }
      });
    });
  }

  return allPieceData;
};
