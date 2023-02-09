import "./Chessboard.css";
import Tile from "./Tile.js";
import {useEffect, useState} from "react"
import {checkMoves} from "../utils/chessUtils.js"
import {findStyleClass, startBoard} from "../utils/chessBoardUtils.js"


export default function Chessboard() {
  const [board, setBoard] = useState(startBoard)
  const [selectedTile, setSelectedTile] = useState()
 
  const updateBoard = () =>{
    const validTiles = checkMoves(selectedTile)

      setBoard(board.map( (tile) => {
        if(tile.value ===  selectedTile.value){
          return {...tile, "styleClass": `${findStyleClass(tile.x, tile.y)}-selected`}
        }else {
          for(let i = 0; i < validTiles.length; i++){
            if(validTiles[i].x === tile.x  && validTiles[i].y === tile.y){
              console.log("valid", tile)
              return {...tile, "styleClass": `${findStyleClass(tile.x, tile.y)}-movable`}
            }
          }
          return {...tile, "styleClass": findStyleClass(tile.x, tile.y)}
        }
      }))

  }

  const selectTile = (tile) => {
    setSelectedTile(tile)
  }

  useEffect( () => {
    if(selectedTile){
      updateBoard()
    }
  }, [selectedTile])
  return <div className="board">
    {board.map((e) => <Tile tileData={e} selectTile={selectTile} updateBoard={updateBoard}/>)}
  </div>;
}
