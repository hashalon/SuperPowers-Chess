class Game extends Sup.Behavior{
    
    protected hud      : HUD;
    protected camera   : CameraControl;
    protected board    : Board;
    protected player_w : Player;
    protected player_b : Player;    

    protected turnBlack : boolean;
    
    public get HUD() : HUD{
        return this.hud;
    }
    public get Camera() : CameraControl{
        return this.camera;
    }
    public get Board() : Board{
        return this.board;
    }
    public get PlayerWhite() : Player{
        return this.player_w;
    }
    public get PlayerBlack() : Player{
        return this.player_b;
    }    
    
    public init( hud:HUD, camera:CameraControl, board:Board ){
        this.hud      = hud;
        this.camera   = camera;
        this.board    = board;
        this.player_w = new Player(this, false);
        this.player_b = new Player(this, true );
        
        // the first player is the white one
        this.turnBlack = false;
        // we start the turn of the white player
        this.player_w.startTurn();
    }
    
    public update() {
        if( this.turnBlack ){
            this.player_b.updatePlayer();
        }else{
            this.player_w.updatePlayer();
        }
    }
    
    public switchTurn(){
        // we switch the turn
        this.turnBlack = !this.turnBlack;
        // we recover the player for the new turn
        let player = this.turnBlack ? this.player_b : this.player_w;
        // we initialize the turn of the player
        player.startTurn();
    }

    public getCurrentTurn () : Turn{
        if( this.turnBlack ){
            return this.player_b.Turn;
        }else{
            return this.player_w.Turn;
        }
        return null;
    }
}
Sup.registerBehavior(Game);