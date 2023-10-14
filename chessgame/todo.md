## TODO list:

1. Checks - Make player aware when in check
   Currently we can log out if the player is in check, need to parse this data to display something to the player.
2. Moves that check - if a move will put the current player in check, dont allow that as a valid move.
3. Checkmate, if there are no valid places for the king to move to, end the game.
4. Stalemate, if there are no valid places for the king to move to, but you are not in check, end the game as a stalemate rather than a checkmate.
5. Allow Castling, when the king or rook has not been moved and they see each other, allow castling.
6. Implement Castling, now that we are allowed to castle, give the player the option to do it.
7. Promotions, when we move a piece to the end of the board, allow promotions, player can change to a specific peice to promote to.
8. En passant, implement en passant move.
