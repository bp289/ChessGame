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

  return pieceLocations;
};

const reducedPinAttacks = (
  enemysPinAttacks,
  allyLocations,
  enemyLocations,
  pieceLocations
) => {
  const { queens, rooks, bishops } = enemysPinAttacks;
  // const pieceInfo = { ...pieceLocations };

  const queenPins = checkForPins(
    queens,
    allyLocations,
    enemyLocations,
    "queen"
  );
  filterMovesFromPins(queenPins, pieceLocations);
  const rookPins = checkForPins(rooks, allyLocations, enemyLocations, "rook");
  const bishopPins = checkForPins(
    bishops,
    allyLocations,
    enemyLocations,
    "bishop"
  );

  return { queenPins, rookPins, bishopPins };
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
  console.log(pinnedPieces);
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

      console.log(pinnedValue, name, allowedMoves);

      allPieceData[name].forEach((piece, index) => {
        if (piece.currentlyAt.value === pinnedValue) {
          console.log(allPieceData[name][index]);
          allPieceData[name][index].legalMoves.filter((move) => {
            console.log(move);

            //TODO: filter allPieceData, make sure all moves are allowed with the pins
          });

          allPieceData[name][index].legalAttacks.filter((attack) => {
            console.log(attack.attackingTile);
          });
        }
      });
    });
  }
};
