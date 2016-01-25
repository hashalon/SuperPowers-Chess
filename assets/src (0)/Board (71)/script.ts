class Board {
    
    protected size  : Sup.Math.Vector2;
    protected scale : number;
    protected root : Sup.Actor;
    
    protected pieces : AbstractPiece[];
    
    // GETTER for pieces
    public get Root() : Sup.Actor{
        return this.root;
    }
    public get Size() : Sup.Math.Vector2{
        return this.size;
    }
    public get Pieces() : AbstractPiece[]{
        return this.pieces;
    }    
    public set Pieces( pieces : AbstractPiece[] ){
        this.pieces = pieces;
    }
    
    public constructor( root : Sup.Actor, scale : number = 1, size : Sup.Math.Vector2 = new Sup.Math.Vector2(8,8) ){
        this.root   = root;
        this.scale  = scale;
        this.size   = size;
        // we create a new array for the pieces
        this.pieces = [];
    }
    
    // return true if the pointed square is valid
    public isValidPosition( pos : Sup.Math.Vector2 ) : boolean {
        // as long as the piece is within those boundaries
        return (
            -1 < pos.x && pos.x < this.size.x &&
            -1 < pos.y && pos.y < this.size.y
        );
    }
    
    public getPieceAtPosition( pos : Sup.Math.Vector2 ) : AbstractPiece {
        for( let piece of this.pieces ){
            let coord = piece.coordinates;
            // if the piece is at the given position
            if( coord.x == pos.x && coord.y == pos.y && !piece.potentialyDestroyed ){
                return piece;
            }
        }
        // we didn't find a piece at the given position
        return null;
    }
    
    public getPiecesOfType( isBlack : boolean, type = AbstractPiece ) : AbstractPiece[]{
        let result : AbstractPiece[] = [];
        for( let piece of this.pieces ){
            // if the piece is of the the right team and of the correct type
            if( piece.IsBlack == isBlack && piece instanceof type ){
                // we add it to the list
                result.push(piece);
            }
        }
        return result;
    }
    
    // allow to remove a piece from the board
    public removePiece( piece : AbstractPiece ){
        this.pieces.splice( this.pieces.indexOf(piece), 1 );
    }
    
    public convertCoordinates( coord : Sup.Math.Vector2 ) : Sup.Math.Vector3 {
        return new Sup.Math.Vector3( coord.x*this.scale, 0, coord.y*this.scale );
    }
    public convertPosition( pos : Sup.Math.Vector3 ) : Sup.Math.Vector2 {
        return new Sup.Math.Vector2( pos.x/this.scale, pos.z/this.scale );
    }
}
