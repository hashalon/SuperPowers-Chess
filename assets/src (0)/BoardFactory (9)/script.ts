// this class allow to create a board, it is not required to play the game in the main loop
class BoardFactory extends Sup.Behavior {
    
    // we define two attributes to define the size of the board
    public width  : number = 8;
    public height : number = 8;
    public scale  : number = 2;    
    
    protected game   : Game;
    protected hud    : HUD;
    protected camera : Sup.Actor;
    protected board  : Board;
    
    start() {
        this.game  = this.actor.getBehavior(Game);
        this.board = new Board( this.actor, this.scale, new Sup.Math.Vector2(this.width,this.height) );
        this.actor.setPosition( -(this.width*0.5-0.5)*this.scale, 0, -(this.height*0.5-0.5)*this.scale );
        
        this.hud = Sup.getActor("HUD").getBehavior(HUD);
        this.hud.Game = this.game; // pass the game to the HUD
        
        // we recover the camera center point
        let center = Sup.getActor("Center");
        this.camera = center.getChild("Camera");
        
        // we generate the board
        for( let i=0; i<this.width; ++i ){
            for( let j=0; j<this.height; ++j ){
                let pos = new Sup.Math.Vector2( i, j );
                if( this.board.isValidPosition( pos ) ){
                    // we create the block
                    let block : Sup.Actor;
                    // if coordinates are both even or not even
                    if( i%2 == j%2 ){
                        block = Sup.appendScene("prefab/white/Block")[0];
                    }else{
                        block = Sup.appendScene("prefab/black/Block")[0];
                    }
                    // we make the block being a child of the board
                    block.setParent( this.actor );
                    // we set it's position
                    block.setLocalPosition( i*this.scale, 0, j*this.scale );
                }
            }
        }
        // we add the prints
        this.initPrints( "HGFEDCBA", true , -1 );
        this.initPrints( "HGFEDCBA", true ,  8 );
        this.initPrints( "12345678", false, -1 );
        this.initPrints( "12345678", false,  8 );
        
        // we init the pieces of each player
        this.initSide(false);
        this.initSide(true );
        
        let camControl = center.getBehavior(CameraControl);
        this.game.init(this.hud,camControl,this.board);
        
        // the game doesn't need the factory anymore
        this.destroy();
    }
    
    protected initPrints( prints : string, isHorizontal : boolean, pos : number ){
        for( let i=0; i<prints.length; ++i ){
            let print = Sup.appendScene("prefab/visuals/Print")[0];
            let coord = new Sup.Math.Vector2();
            if( isHorizontal ){
                coord.x = i;
                coord.y = pos;
            }else{
                coord.x = pos;
                coord.y = i;
            }
            print.getBehavior(Print).init( this.board, coord, this.camera, prints[i] );
        }
    }
    
    protected initSide( blackSide : boolean ){
        // we create a list of the pieces
        let pawns  = new Array<AbstractPiece>();
        let pieces = new Array<AbstractPiece>();
        let path   =  blackSide ? "prefab/black/" : "prefab/white/";
        
        // we create the pawns
        for( let i=0; i<this.width; ++i ){
            pawns[i] = Sup.appendScene( path+"Pawn" )[0].getBehavior( AbstractPiece );
        }
        // we create the rooks
        pieces[0] = Sup.appendScene( path+"Rook" )[0].getBehavior( AbstractPiece );
        pieces[7] = Sup.appendScene( path+"Rook" )[0].getBehavior( AbstractPiece );
        // we create the knights
        pieces[1] = Sup.appendScene( path+"Knight" )[0].getBehavior( AbstractPiece );
        pieces[6] = Sup.appendScene( path+"Knight" )[0].getBehavior( AbstractPiece );
        // we create the bishops
        pieces[2] = Sup.appendScene( path+"Bishop" )[0].getBehavior( AbstractPiece );
        pieces[5] = Sup.appendScene( path+"Bishop" )[0].getBehavior( AbstractPiece );
        // we create the queen and the king
        pieces[4] = Sup.appendScene( path+"Queen" )[0].getBehavior( AbstractPiece );
        pieces[3] = Sup.appendScene( path+"King"  )[0].getBehavior( AbstractPiece );
        
        let pawn_y  = blackSide ? this.height-2 : 1;
        let piece_y = blackSide ? this.height-1 : 0;
        for( let i=0; i<pawns.length; ++i ){
            // we init the pawn
            pawns[i].init( this.board );
            // we position the pawn
            pawns[i].coordinates = new Sup.Math.Vector2( i, pawn_y );
        }
        for( let i=0; i<pieces.length; ++i ){
            // we init the piece
            pieces[i].init( this.board );
            // we position the piece
            pieces[i].coordinates = new Sup.Math.Vector2( i, piece_y );
        }
    }
}
Sup.registerBehavior(BoardFactory);
