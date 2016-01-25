class OldPlayerBehavior extends Sup.Behavior {
    
    private isEnded     : boolean;
    
    private board       : Board;
    private camera      : Sup.Camera;
    private turnMsg     : Sup.SpriteRenderer;
    private message     : Sup.SpriteRenderer;
    private promotion   : Sup.Actor;
    private ray         : Sup.Math.Ray;
    private camBehavior : CameraControl;
    
    private isBlack     : boolean; // set the turn
    private pieces      : Array<Sup.Actor>;
    private effects     : Array<Sup.Actor>;
    private selected    : AbstractPiece;
    private inPromotion : boolean;

    start() {
        this.isEnded     = false;
        //this.board       = Sup.getActor("Board"  ).getBehavior(Board);
        this.camera      = Sup.getActor("Camera" ).camera;
        this.turnMsg     = Sup.getActor("Turn"   ).spriteRenderer;
        this.message     = Sup.getActor("Message").spriteRenderer;
        this.promotion   = Sup.getActor("Promo");
        this.ray         = new Sup.Math.Ray();
        this.camBehavior = this.actor.getBehavior(CameraControl);
        this.isBlack     = false; // it is white turn first
        this.inPromotion = false;
        this.promotion.setVisible(false);
    }

    update() {
        // if we didn't recover the list of piece we can move
        if( this.pieces == null ){
            this.pieces = Util.convertBehaviors( this.board.getPiecesOfType(this.isBlack) );
            //this.board.checkKing(this.isBlack);
            
            // we display a message if the king is in check
            this.message.actor.setVisible(false);
            if( this.isBlack ){
                this.turnMsg.setAnimation("turn_b", true);
                // if the black king is in check
                /*if( this.board.check_black ){
                    this.message.actor.setVisible(true);
                    // maybe it's a mate
                    if( this.board.isInMate( this.isBlack ) ){
                        this.message.setAnimation( "mate_b", true );
                        this.isEnded = true;
                    }else{
                        this.message.setAnimation( "check_b", true );
                    }
                }*/
            }else{
                this.turnMsg.setAnimation("turn_w", true);
                // if the white king is in check
                /*if( this.board.check_white ){
                    this.message.actor.setVisible(true);
                    // maybe it's a mate
                    if( this.board.isInMate( this.isBlack ) ){
                        this.message.setAnimation( "mate_w", true );
                        this.isEnded = true;
                    }else{
                        this.message.setAnimation( "check_w", true );
                    }
                }*/
            }
        }
        
        let mouseSelect = false;
        
        // when the player press the mouse button
        if( Sup.Input.wasMouseButtonJustPressed(0) && !this.isEnded ){
            // we update the raycast
            this.ray.setFromCamera(this.camera,Sup.Input.getMousePosition());
            
            // first we choose the promotion of a pawn
            if( this.inPromotion ){
                // we check the buttons
                let hits = this.ray.intersectActors( this.promotion.getChildren() );
                // only one promotion can be choose
                for( let hit of hits ){
                    mouseSelect = true;
                    // we create a new piece
                    let promo = Sup.appendScene("prefab/"+(this.isBlack?"black":"white")+"/"+hit.actor.getName())[0].getBehavior(AbstractPiece);
                    promo.actor.setParent(this.board.Root);
                    promo.init(this.board);
                    promo.coordinates = this.selected.coordinates;
                    this.board.Pieces.push(promo);
                    
                    // we destroy the old pawn
                    this.selected.DestroyPiece();
                    
                    this.inPromotion = false;
                    this.promotion.setVisible(false);
                    this.isBlack  = !this.isBlack; // we switch turn
                    this.selected = null; // we unselect the piece
                    this.pieces   = null; // we clear the set of pieces
                }
            } else {
                // second we check for piece we want to move
                // we check if we selected a piece
                let hits = this.ray.intersectActors( this.pieces );
                // only one piece could have been selected
                for( let hit of hits ){
                    mouseSelect = true; // we selected something
                    this.selected = hit.actor.getBehavior(AbstractPiece);
                    // we recover the movement the piece can make
                    let moves = this.selected.getPossibleMoves(true);
                    // we clear the effects
                    this.clearEffects();    
                    // for each move we recovered
                    for( let move of moves ){
                        move.coord.multiplyScalar(2);
                        // we create a effect to show the player he can make the move
                        let effect = Sup.appendScene("prefab/Effect")[0];
                        effect.setParent(this.board.Root);
                        effect.setLocalPosition( move.coord.x, 0, move.coord.y );
                        this.effects.push( effect );
                    }
                }
            }
            
            // then we check for possible moves
            if( this.effects != null && this.selected != null && !mouseSelect ){
                // we check if we selected a move
                let hits = this.ray.intersectActors( this.effects );
                // only one move could have been selected
                for( let hit of hits ){
                    mouseSelect = true;
                    let pos = hit.actor.getLocalPosition();
                    let move = new Sup.Math.Vector2( pos.x, pos.z );
                    move.multiplyScalar( 0.5 );
                    
                    //this.selected.move(move);     // we move the piece
                    // if the moved piece is a pawn
                    if( this.selected instanceof Pawn ){
                        // if the pawn reach the end of the board
                        if( this.selected.isBlack ){
                            /*if( this.selected.position.y < 1 ){
                                this.displayPromotion();
                            }*/
                        }else{
                            /*if( this.selected.position.y > this.board.height-2 ){
                                this.displayPromotion();
                            }*/
                        }
                    }
                    // if we're not promoting a pawn, we can change of turn
                    if( !this.inPromotion ){
                        this.isBlack  = !this.isBlack; // we switch turn
                        this.selected = null; // we unselect the piece
                        this.pieces   = null; // we clear the set of pieces
                    }
                    this.clearEffects();  // we clear the effects
                }
            }
        }
        // when the player hold the mouse button and he didn't click on a piece or a move
        if( Sup.Input.isMouseButtonDown(0) && !mouseSelect ){
            this.camBehavior.holdMouse = true;
        }else{
            this.camBehavior.holdMouse = false;
        }
        
    }

    public clearEffects(){
        if( this.effects != null ){
            for( let effect of this.effects ){
                effect.destroy();
            }
        }
        this.effects = new Array<Sup.Actor>();
    }
    
    public displayPromotion(){
        this.inPromotion = true;
        this.promotion.setVisible(true);
        // we display a menu to choose the promotion
        let buttons = this.promotion.getChildren();
        for( let button of buttons ){
            // we recover the name of the animation we want to play
            let anim = button.spriteRenderer.getAnimation();
            anim = anim.substr(0,anim.length-2);
            // if it's black turn
            if( this.isBlack ){
                button.spriteRenderer.setAnimation( anim+"_b" );
            }else{ // if it's white turn
                button.spriteRenderer.setAnimation( anim+"_w" );
            }
        }
    }
}
Sup.registerBehavior(OldPlayerBehavior);
