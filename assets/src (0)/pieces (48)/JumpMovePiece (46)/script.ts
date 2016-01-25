abstract class JumpMovePiece extends AbstractPiece {
    
    protected jumps : Array<Sup.Math.Vector2>;
    
    public getPossibleMoves( checkNextMove:boolean ) : ISquare[]{
        // we keep track of the objects
        let list : ISquare[] = [];
        // we check each move to see if it's valid
        for( let move of this.jumps ){
            // we recover the position of the piece after the move
            let pos = this.coordinates.add( move );
            this.checkMoveJump( checkNextMove, list, pos );
        }
        return list;
    }
    
    protected checkMoveJump( checkNextMove:boolean, list:ISquare[], pos:Sup.Math.Vector2 ){
        // we recover info at the given position
        let isquare = this.getISquare( pos );
        // if the position is a valid square
        if( isquare.isValid ){
            // we consider the state of the board if we choose this position
            this.potCoord = pos
            // if there is no piece at the given position
            if( isquare.otherPiece == null ){
                
                // we add the move to the list
                this.addToList( checkNextMove, isquare, list );
                
            }else if( isquare.isEnemy ){
                
                // we consider the piece destroyed
                isquare.otherPiece.potentialyDestroyed = true;
                // we add the move to the list
                this.addToList( checkNextMove, isquare, list );
                // we've made our verifications
                isquare.otherPiece.potentialyDestroyed  = false;
            }
            // we made our verifications we can revert the state of the piece
            this.potCoord = null;
        }
    }
    
}
