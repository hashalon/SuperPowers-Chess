/*
change the way the game analyse the board

getPossibleMoves should return a array of Position and Pieces (use struct/interface to do so)

at the beginning of each turn,
we check the possible moves of each piece and store it into a map (key=the piece, value=the move struct)
while we check for the possible moves, we check if the king is in check and if we're in mate

we change the way the game display messages
change the way we promote a pawn

*/
