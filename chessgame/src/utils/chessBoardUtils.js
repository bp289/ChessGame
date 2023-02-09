
const xAxis = ["a", "b", "c", "d", "e", "f", "g", "h"];
const backPieces = {
    "a":"rook",
    "b": "knight",
    "c": "bishop",
    "d": "queen",
    "e": "king",
    "f": "bishop",
    "g": "knight",
    "h": "rook"
}

function findStyleClass(x, y){

  return (x + y) % 2 === 0 ? "light" : "dark"
}

function findStartPiece(tile){

    switch(tile[1]){
      case "2":
        return {color:"white",piece:"pawn"}
      case "7":
        return {color:"black",piece:"pawn"}
      case "1":
        return {color:"white", piece:`${backPieces[tile[0]]}`}
      case "8":
        return {color:"black", piece:`${backPieces[tile[0]]}`}
      default:
        return {}
    }
  
}
const startBoard = () => {
    const board = []
    for (let x = 1; x <= 8; x++) {
        for (let y = 8; y >= 1; y--) {
          board.push(
            {
              "value": `${xAxis[x - 1]}${y}`,
              "styleClass": findStyleClass(x, y),
              "pieceOnTile": findStartPiece(`${xAxis[x - 1]}${y}`),
              "x": x,
              "y": y
            }
          );
        }
    }
    return board
};





module.exports = {
    findStartPiece,
    findStyleClass,
    startBoard
 }