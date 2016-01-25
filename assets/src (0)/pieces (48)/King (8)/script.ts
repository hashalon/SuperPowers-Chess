class King extends JumpMovePiece {
    
    public init( board : Board ){
        super.init(board);
        
        // we define the jumps for the King
        this.jumps = [
            new Sup.Math.Vector2( 1, 0),
            new Sup.Math.Vector2(-1, 0),
            new Sup.Math.Vector2( 0, 1),
            new Sup.Math.Vector2( 0,-1),
            new Sup.Math.Vector2( 1, 1),
            new Sup.Math.Vector2( 1,-1),
            new Sup.Math.Vector2(-1, 1),
            new Sup.Math.Vector2(-1,-1)
        ];
    }
    
    // we override the method to allow castling
    public move( isquare : ISquare ){
        super.move( isquare );
        // if the isquare is of type ICastling
        if( 'piece2' in isquare ){
            // we cast the isquare
            let icastling = <ICastling> isquare;
            
            // we move the other piece of the castling
            let isquare2 = this.getISquare( icastling.coord2 );
            icastling.piece2.move( isquare2 );
        }
    }
    
    // we override the method to allow castling
    public getPossibleMoves( checkNextMove : boolean ) : ISquare[]{
        // we extends this behavior to support castling
        let list = super.getPossibleMoves(checkNextMove);
        // castling is possible only if the king and a rook hasn't moved yet
        if( !this.hasMoved ){
            let rooks = this.board.getPiecesOfType( this.isBlack, Rook );
            // we check castling for each rook
            for( let rook of rooks ){
                // if the rook hasn't been moved
                if( !rook.HasMoved ){
                    // we can perform a castling
                    this.checkCastling( checkNextMove, rook, list );
                }
            }
        }
        return list;
    }
    
    public checkCastling ( checkNextMove:boolean, piece:AbstractPiece, list:ISquare[] ){
        // we recover the direction and the length between the two piece
        let direction = piece.coordinates.subtract( this.coordinates );
        let length = direction.length();
        direction.normalize();
        // we only allow castling if the direction is orthogonal
        if( direction.x != 0 && direction.y != 0 && length < 3 ){
            // the direction is not orthogonal, castling is not possible
            return;
        }
        // we recover the position of the king
        let pos = this.coordinates;
        // we check each square between the king and the other piece
        for( let i=1; i<length; ++i ){
            // we check the next square
            pos.add( direction );
            let isquare = this.getISquare( pos );
            // if there is a piece between the king and the other piece
            if( !isquare.isValid || isquare.otherPiece != null ){
                return;
            }else if( checkNextMove ){
                if( this.kingWouldBeInCheck() ){
                    return;
                }
            }
        }
        // we've made our verifications
        let coord = this.coordinates.add( direction.clone().multiplyScalar(2) );
        let isquare : ICastling = <ICastling>this.getISquare( coord );
        isquare.piece2 = piece;
        isquare.coord2 = coord.clone().add( direction.clone().negate() );
        list.push( isquare );
    }
}
Sup.registerBehavior(King);

interface ICastling extends ISquare {
    piece2  : AbstractPiece;
    coord2 : Sup.Math.Vector2;
} 
