abstract class DirectionalMovePiece extends AbstractPiece {
    
    protected directions : Array<Sup.Math.Vector2>;
    
    public getPossibleMoves( checkNextMove:boolean ) : ISquare[]{
        let list : ISquare[] = [];
        for( let move of this.directions ){
            this.checkMoveInDirection( checkNextMove, list, this.coordinates, move );
        }
        
        return list;
    }
    
    // recursively add the valid moves in the given direction
    protected checkMoveInDirection( checkNextMove:boolean, list:ISquare[], pos:Sup.Math.Vector2, dir:Sup.Math.Vector2 ){
        // we assume the pos is the previous position
        pos = pos.clone().add(dir);
        
        // we get info from the given position
        let isquare = this.getISquare( pos );
        // if the position exists
        if( isquare.isValid ){
            
            // we consider the state of the board if we choose this position
            this.potCoord = pos;
            
            // if there is no piece at the given position
            if( isquare.otherPiece == null ){
                
                // we add the move to the list
                this.addToList( checkNextMove, isquare, list );
                // we check for the next square
                this.checkMoveInDirection( checkNextMove, list, pos, dir );
                
            }else if( isquare.isEnemy ){
                
                // we consider that the piece is destroyed
                isquare.otherPiece.potentialyDestroyed = true;
                // we add the piece to the list
                this.addToList( checkNextMove, isquare, list );
                // we've made our verifications
                isquare.otherPiece.potentialyDestroyed  = false;
                
            }
            // we made our verifications we can revert the state of the piece
            this.potCoord = null;
        }
    }
}
