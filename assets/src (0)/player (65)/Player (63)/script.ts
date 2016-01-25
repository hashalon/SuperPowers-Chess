class Player {
    
    protected game   : Game;
    protected camera : Sup.Actor;
    protected ray    : Sup.Math.Ray;    

    protected isBlack   : boolean;
    
    protected turn    : Turn;
    protected lastCam : Sup.Math.Vector3;
    
    public get IsBlack() : boolean{
        return this.isBlack;
    }
    public get IsInCheck() : boolean{
        return this.turn.IsInCheck;
    }
    public get IsInMate() : boolean{
        return this.turn.IsInMate;
    }
    public get Turn() : Turn{
        return this.turn;
    }

    public constructor( game : Game, isBlack : boolean ){
        this.game    = game;
        this.isBlack = isBlack;
        this.camera  = this.game.Camera.Camera;
        this.ray     = new Sup.Math.Ray();
    }
    
    // when we start the turn
    public startTurn(){
        // we check if the king is in check
        this.turn = new Turn(this,this.game.Board);
        this.game.HUD.displayTurn( this.turn );
    }
    // when we end the turn
    public endTurn(){
        // we clear the memory
        this.turn = null;
    }
    
    // called once per frame when it is the turn of the player to play
    public updatePlayer() {
        // did we selected something with the mouse
        let mouseSelect = false;
        
        // as long as the game is not over
        if( !this.isGameOver() ){
            
            // if the player is not promoting a piece
            if( !this.turn.IsPromoting ){
                
                // we create a ray at the mouse position
                this.ray.setFromCamera( this.camera.camera, Sup.Input.getMousePosition() );
                
                // FIRST
                // we test hits for pieces
                // we recover what we hit
                let hits = this.ray.intersectActors( Util.convertBehaviors(this.turn.Pieces) );
                // we should intersect with only one piece
                for( let hit of hits ){

                    // if the player press the left click
                    if( Sup.Input.wasMouseButtonJustPressed(0) ){
                        mouseSelect = true; // we selected something
                        // must be the piece the player wants to move
                        this.turn.SelectedPiece = hit.actor.getBehavior(AbstractPiece);
                        // we recover the possible moves for the selected piece
                        let moves = this.turn.getMovesForSelection();
                        // we create effects for those moves
                        this.turn.createEffects(moves);
                    }
                }

                // SECOND
                // we test hits for effects
                // if we have effects visible and we didn't selected the piece in the same frame
                if( this.turn.Effects != null && !mouseSelect){
                    // we recover what we hit
                    let hits = this.ray.intersectActors( this.turn.Effects );
                    // we should intersect with only one effect
                    for( let hit of hits ){

                        // if the player press the left click
                        if( Sup.Input.wasMouseButtonJustPressed(0) ){
                            mouseSelect = true; // we selected something
                            // must be the move the player wants to make
                            let effect = hit.actor.getBehavior(Effect);
                            // we move the selected piece to the right square
                            this.turn.SelectedPiece.move( effect.Move );
                            // we destroy the effects
                            this.turn.destroyEffects();

                            // if the piece we just move was a pawn
                            if( this.turn.SelectedPiece instanceof Pawn ){
                                let pawn = <Pawn>this.turn.SelectedPiece;
                                // and if the pawn reached the end of the board
                                if( pawn.shouldBePromoted() ){
                                    this.game.HUD.displayPromo(this.isBlack);
                                    this.turn.IsPromoting = true;
                                }else{
                                    this.turn.IsOver = true;
                                }
                            }else{
                                this.turn.IsOver = true;
                            }
                        }
                    }
                }
            }
            
            if( this.turn.IsOver ){
                // the turn of player is over, it's time to swith turn
                this.game.switchTurn();
            }
        }
        
        // THIRD
        // if we didn't select anything and yet we are pressing the mouse click
        if( Sup.Input.isMouseButtonDown(0) && !mouseSelect ){
            // we want to rotate the camera with the mouse
            this.game.Camera.holdMouse = true;
        }else{
            // other wise we don't
            this.game.Camera.holdMouse = false;
        }
    }
    
    protected isGameOver(){
        if( this.turn != null ){
            // if we are either in pat or in mate
            return this.turn.IsInPat; // the game is over
        }
        return false;
    }

}
