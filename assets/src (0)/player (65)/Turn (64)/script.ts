class Turn {
    
    protected player : Player;
    protected board  : Board;
    
    protected isInCheck : boolean;
    protected isInPat   : boolean;
    
    protected pieces : AbstractPiece[];
    protected moves  : ISquare[][];
    
    protected selected : AbstractPiece;
    protected effects  : Sup.Actor[];   
    
    protected isOver    : boolean;
    protected promoting : boolean;
    
    // GETTER SETTER
    public get Player() : Player{
        return this.player;
    }
    
    public get IsInCheck() : boolean{
        return this.isInCheck;
    }
    public get IsInPat() : boolean{
        return this.isInPat;
    }
    public get IsInMate() : boolean{
        // if the player is both in check and in pat, then he is in mate
        return this.isInCheck && this.isInPat;
    }
    
    public get Pieces() : AbstractPiece[]{
        return this.pieces;
    }
    
    // GETTER and SETTER for the selected piece
    public get SelectedPiece() : AbstractPiece{
        return this.selected;
    }
    public set SelectedPiece( piece:AbstractPiece ){
        this.selected = piece;
    }
    // GETTER for the effects
    public get Effects() : Sup.Actor[]{
        return this.effects;
    }
    // GETTER and SETTER for the end turn variable
    public get IsOver(){
        return this.isOver;
    }
    public set IsOver( isOver:boolean ){
        this.isOver = isOver;
    }
    // GETTER and SETTER to know if the player is promoting a piece
    public get IsPromoting() : boolean{
        return this.promoting;
    }
    public set IsPromoting( promoting:boolean ){
        this.promoting = promoting;
    }
    
    public constructor( player:Player, board:Board ){
        this.player = player;
        this.board  = board;
        
        this.isInCheck = false;
        this.isInPat   = false;
        
        // we calculate the moves the other player can make at the next turn
        let pieces = this.board.getPiecesOfType( !this.player.IsBlack );
        for( let i=0; i<pieces.length; ++i ){
            let potMoves = pieces[i].getPossibleMoves( false );
            // we check if the king is in check
            for( let move of potMoves ){
                if( move.otherPiece instanceof King && move.isEnemy ){
                    this.isInCheck = true;
                }
            }
        }
        
        // we calculate the moves the current player can make
        this.moves = [];
        this.pieces = this.board.getPiecesOfType( this.player.IsBlack );
        for( let i=0; i<this.pieces.length; ++i ){
            let potMoves = this.pieces[i].getPossibleMoves( true );
            this.moves[i] = potMoves;
        }
        
        let allEmpty = true;
        // we check if we can still make moves
        for( let i=0; i<this.moves.length; ++i ){
            if( this.moves[i].length > 0 ){
                allEmpty = false;
            }
        }
        // if no moves allow the king to no be in check, then it is in pat
        this.isInPat = allEmpty;
    }
    
    public createEffects( moves:ISquare[] ){
        // if we already have effects displayed
        if( this.effects != null ){
            // we need to remove them
            this.destroyEffects();
        }
        // we create a new array
        this.effects = [];
        // for each possible move of the selected piece
        for( let move of moves ){
            // we add a prefab to the scene
            let prefab = Sup.appendScene("prefab/visuals/Effect")[0];
            // we recover the behavior of the prefab
            let behavior = prefab.getBehavior(Effect);
            // we initialize the prefab
            behavior.init( this.board, move );
            // we add the prefab to the list
            this.effects.push( prefab );
        }
    }
    
    public destroyEffects(){
        // for each effect stored
        for( let effect of this.effects ){
            // we destroy it
            effect.destroy();
        }
        // we reset the array
        this.effects = null;
    }
    
    public getMovesForPiece( piece : AbstractPiece ) : ISquare[]{
        let index = this.pieces.indexOf(piece);
        return this.moves[index];
    }
    public getMovesForSelection() : ISquare[]{
        return this.getMovesForPiece(this.selected);
    }
    
    // we must give the class to promote the selected piece
    public promoteSelected( name:string ){
        // based on the team, the path to the prefab may change
        let path = this.player.IsBlack ? "black" : "white";
        // we import the prefab in the scene
        let prefab = Sup.appendScene("prefab/"+path+"/"+name)[0];
        // we recover the behavior of the prefab
        let piece = prefab.getBehavior(AbstractPiece);
        // we initialize the piece
        piece.init(this.board);
        // we move it to the position of the selected piece
        piece.coordinates = this.selected.coordinates;
        // we destroy the old piece
        this.selected.DestroyPiece();
        // once we have promoted a piece, the turn is necessarly over
        this.isOver = true;
    }
}
