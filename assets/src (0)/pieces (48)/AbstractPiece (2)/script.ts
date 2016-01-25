abstract class AbstractPiece extends Sup.Behavior {
    
    public    isBlack  : boolean = false; // define the team of the piece
    
    protected board    : Board;            // we keep a reference to the board
    protected hasMoved : boolean;          // some piece has special properties if they didn't moved yet
    protected potCoord : Sup.Math.Vector2; // we keep a reference to the next possible position of the piece   
    protected potDestr : boolean;          // we suppose the piece will be destroyed on the next move
    
    // we create a getter 
    get IsBlack(): boolean{
        return this.isBlack;
    }
    // we create a getter to know if the piece has been moved
    get HasMoved(): boolean{
        return this.hasMoved;
    }
    // we create setter and getter to position our pieces
    get coordinates(): Sup.Math.Vector2 {
        // if the potential coordinates are set then we are checking if the move is valid
        if( this.potCoord != null ){
            return this.potCoord;
        }
        return this.board.convertPosition(this.actor.getLocalPosition());
    }
    set coordinates( pos : Sup.Math.Vector2 ){
        this.actor.setLocalPosition( this.board.convertCoordinates(pos) );
    }
    // we create setter and getter to concider if the piece could be destroyed
    get potentialyDestroyed(): boolean {
        return this.potDestr;
    }
    set potentialyDestroyed( destroy : boolean ){
        this.potDestr = destroy;
    }
    
    // we init the piece
    public init( board : Board ){
        this.board    = board;
        this.hasMoved = false;
        this.potDestr = false;
        // we parent the piece to the board
        this.actor.setParent( this.board.Root );
        // we add the piece to the list
        this.board.Pieces.push(this);
    }

    public move( isquare : ISquare ){
        // if the square exists
        if( isquare.isValid ){
            // if there is a piece at the position
            if( isquare.otherPiece != null ){
                // if it's a piece of the other team
                if( isquare.isEnemy ){
                    // we destroy it
                    isquare.otherPiece.DestroyPiece();
                }else{
                    // the piece at the position is of the same team
                    return; // we cancel the move
                }
            }
            // we make the move
            this.coordinates = isquare.coord;
            this.hasMoved = true;
        }
    }

    // return the possible moves of the piece
    public abstract getPossibleMoves( checkNextMove : boolean ) : ISquare[];
    
    // this is a shortcut function because we often need if the king might be in check if we make a certain move
    // return true if the move has been added
    protected addToList( checkNextMove:boolean, isquare:ISquare, list:ISquare[] ) : boolean{
        // we see if we need to check the moves of the enemy pieces
        // before checking the moves of each enemy piece /!\
        if( checkNextMove ){
            // if the move makes the player king to not be in check
            if( !this.kingWouldBeInCheck() ){
                list.push( isquare );
                return true; // the move has been added
            }
        }else{
            list.push( isquare );
            return true; // the move has been added
        }
        return false; // the move haven't been added
    }

    protected getISquare( pos : Sup.Math.Vector2 ) : ISquare {
        let isquare = {
            piece      : this,
            coord      : pos.clone(),
            isValid    : false,
            otherPiece : null,
            isEnemy    : null
        };
        // if the position is part of the board
        if( this.board.isValidPosition( pos ) ){
            isquare.isValid = true;
            isquare.otherPiece = this.board.getPieceAtPosition( pos );
            // if there is a piece at that position
            if( isquare.otherPiece != null ){
                // if the piece is of the other team
                isquare.isEnemy = (this.isBlack != isquare.otherPiece.isBlack);
            }
        }
        return isquare;
    }
    
    protected kingWouldBeInCheck() : boolean{
        // we check each piece of the board
        for( let piece of this.board.Pieces ){
            // if it's a piece of the other team and is not destroyed
            if( piece.IsBlack != this.isBlack && !piece.potentialyDestroyed ){
                // we don't want to be stuck in an endless loop, we don't check for next possible moves
                let moves = piece.getPossibleMoves(false);
                for( let move of moves ){
                    // if the there is a king of our current team on the square
                    if( move.otherPiece instanceof King && move.isEnemy ){
                        // then the king is in check
                        return true;
                    }
                }
            }
        }
        return false;
    }
    
    public DestroyPiece(){
        this.board.removePiece(this);
        this.actor.destroy();
    }
}

interface ISquare {
    piece      : AbstractPiece;
    coord      : Sup.Math.Vector2;
    isValid    : boolean;
    otherPiece : AbstractPiece;
    isEnemy    : boolean;
}
