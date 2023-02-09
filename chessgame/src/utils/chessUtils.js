const checkMoves = (selectedTile) => {
    if (selectedTile.pieceOnTile.color === "white"){
      if(selectedTile.pieceOnTile.piece === "pawn"){
        return [ 
          {x: selectedTile.x, y: selectedTile.y + 2}, 
          {x:selectedTile.x, y:selectedTile.y + 1}
        ]
      }
    }

    if (selectedTile.pieceOnTile.color === "black"){
      if(selectedTile.pieceOnTile.piece === "pawn"){
        return [ 
          {x: selectedTile.x, y: selectedTile.y - 2}, 
          {x:selectedTile.x, y:selectedTile.y - 1}
        ]
      }
    }
}

const moveMap = { 
  pawn: { 
    white: () => {

    }, 
    black: () => {

    }
  },
  knight: () => {

  },
  bishop: () => {

  },
  rook: () => {

  },
  queen: () => {

  },
  king: () => {

  }

}

module.exports = {
   checkMoves,
}