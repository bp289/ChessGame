import "./Chessboard.css";
export default function tile({tileData, selectTile}){
    return(
        <>
            <span className={tileData.styleClass} 
                onClick={ () => { 
                    if( "color" in tileData.pieceOnTile){
                        selectTile(tileData)
                      
                    }
                }
            }>
            {tileData.pieceOnTile.piece}
            </span>
        </>
    )
} 