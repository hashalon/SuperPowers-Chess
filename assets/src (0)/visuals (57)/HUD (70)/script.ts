class HUD extends Sup.Behavior {
    
    protected game   : Game;
    protected camera : Sup.Camera;
    protected ray    : Sup.Math.Ray;    
    
    protected promo         : Sup.Actor;
    protected btnActors     : Sup.Actor[];
    protected btnAnimations : string[];
    protected btnTypes      : string[];   

    protected turnMsg : Sup.SpriteRenderer; // we just need to change the sprite
    protected message : Sup.Actor;          // we need to be able to hide the actor

    public set Game( game:Game ){
        this.game = game;
    }

    awake() {
        this.camera = this.actor.camera;
        this.ray    = new Sup.Math.Ray();
        
        // we create the promo menu
        this.promo  = this.actor.getChild("Promo");
        this.btnActors     = [];
        this.btnAnimations = [];
        this.btnTypes      = [];
        // we recover each button and we add the corresponding class to the list
        this.initButton( 0, "Rook"  , "rook"  , "Rook"   );
        this.initButton( 1, "Knight", "knight", "Knight" );
        this.initButton( 2, "Bishop", "bishop", "Bishop" );
        this.initButton( 3, "Queen" , "queen" , "Queen"  );
        // we hide the promo menu
        this.promo.setVisible(false);
        
        this.turnMsg = this.actor.getChild("Turn").spriteRenderer;
        this.message = this.actor.getChild("Message");
    }
    
    // allow to init a button
    private initButton( index:number, childName:string, animName:string, prefab:string ){
        this.btnActors    [index] = this.promo.getChild(childName);
        this.btnAnimations[index] = animName;
        this.btnTypes     [index] = prefab;
    }

    update() {
        // if the promo menu is visible, then we want to select a promotion for a pawn
        if( this.promo.getVisible() ){
            // we create a ray at the mouse position
            this.ray.setFromCamera( this.camera, Sup.Input.getMousePosition() );
            // we recover what we hit
            let hits = this.ray.intersectActors( this.btnActors );
            // should be called only once
            for( let hit of hits ){
                
                // we check for mouse click after casting ray to add effect to the actor we pass the cursor on
                if( Sup.Input.wasMouseButtonJustPressed(0) ){
                    // we recover the current turn
                    let turn = this.game.getCurrentTurn();
                    turn.promoteSelected( this.getPrefabFromButton( hit.actor ) );
                    // we chose a promotion, we can hide the menu
                    this.promo.setVisible(false);
                }
            }
        }
    }
    
    // this function allow to recover a class from an actor
    protected getPrefabFromButton( button:Sup.Actor ){
        let index = this.btnActors.indexOf(button);
        return this.btnTypes[index];
    }
        
    // this must be called when we start a turn
    public displayTurn( turn:Turn ){
        // animations end with a character that specify the color of the sprite
        let strend = turn.Player.IsBlack ? "_b" : "_w";
        // we display which player has to play
        this.turnMsg.setAnimation("turn"+strend);
        
        // we assume that we have to display a message
        this.message.setVisible(true);
        if( turn.IsInMate ){
            this.message.spriteRenderer.setAnimation("mate"+strend);
        }else if( turn.IsInPat ){
            this.message.spriteRenderer.setAnimation("pat"+strend);
        }else if( turn.IsInCheck ){
            this.message.spriteRenderer.setAnimation("check"+strend);
        }else{
            // no message to display
            this.message.setVisible(false);
        }
    }
    
    // this must be called when a pawn reach the end of the board
    public displayPromo( isBlack:boolean ){
        // animations end with a character that specify the color of the sprite
        let strend = isBlack ? "_b" : "_w";
        
        // we need to display the promo menu
        this.promo.setVisible(true);
        
        // for each button
        for( let i=0; i<this.btnActors.length; ++i ){
            this.btnActors[i].spriteRenderer.setAnimation(this.btnAnimations[i]+strend);
        }
    }
    
}
Sup.registerBehavior(HUD);
