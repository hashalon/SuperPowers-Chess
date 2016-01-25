class Pawn extends AbstractPiece {

    public getPossibleMoves( checkNextMove : boolean ) : ISquare[]{
        let list : ISquare[] = [];
        
        let front : Sup.Math.Vector2 = this.coordinates;
        let left  : Sup.Math.Vector2;
        let right : Sup.Math.Vector2;
        
        // we recover the possible moves of the piece
        if( this.isBlack ){
            --front.y;
            left  = front.clone();
            right = front.clone();
        }else{
            ++front.y;
            left  = front.clone();
            right = front.clone();
        }
        --left .x;
        ++right.x;
        
        // we check each move and we add it if it's a valid move
        let pieceInFront = this.checkMoveFront( checkNextMove, list, front );
        this.checkMoveSide( checkNextMove, list, left  );
        this.checkMoveSide( checkNextMove, list, right );

        // if the pawn hasn't been moved, it can make the "En passant" move
        if( !this.hasMoved && !pieceInFront ){
            // we recover possible move
            let long = this.coordinates;
            if( this.isBlack ){
                long.y -= 2;
            }else{
                long.y += 2;
            }
            // we check if the move is valid
            this.checkMoveFront( checkNextMove, list, long );
        }
        return list;
    }
    
    protected checkMoveFront( checkNextMove:boolean, list:ISquare[], pos:Sup.Math.Vector2 ) : boolean{
        let pieceInFront = true;
        
        // we recover info of the given position
        let isquare = this.getISquare( pos );
        // if the position exists
        if( isquare.isValid ){
            if( isquare.otherPiece == null ){
                // there is no piece in front of that pawn
                pieceInFront = false;
                
                // we concider the next position
                this.potCoord = pos;
                
                // we add the move to the list
                this.addToList( checkNextMove, isquare, list );
                
                // we have made our verifications
                this.potCoord = null;
            }
        }
        return pieceInFront;
    }
    protected checkMoveSide( checkNextMove:boolean, list:ISquare[], pos:Sup.Math.Vector2 ){
        // we recover info of the given position
        let isquare = this.getISquare( pos );
        // if the position exists
        if( isquare.isValid ){
            // the move is posible only if there is a piece and it is black
            if( isquare.otherPiece != null && isquare.isEnemy ){
                
                // we concider this possible move
                this.potCoord = pos;
                isquare.otherPiece.potentialyDestroyed  = true;
                
                // we add the piece to the list
                this.addToList( checkNextMove, isquare, list );
                
                // we have made our verifications
                this.potCoord = null;
                isquare.otherPiece.potentialyDestroyed  = false;
            }
        }
    }
    
    public shouldBePromoted() : boolean{
        if( this.isBlack ){ // if pawn is black
            // if the pawn has reached the bottom of the board
            return this.coordinates.y <= 0;
        }else{ // if pawn is white
            // if the pawn has reached the top of the board
            return this.coordinates.y >= this.board.Size.y-1;
        }
        return false;
    }
    
}
Sup.registerBehavior(Pawn);
