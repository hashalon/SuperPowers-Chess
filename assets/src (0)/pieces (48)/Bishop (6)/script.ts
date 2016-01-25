class Bishop extends DirectionalMovePiece {
    
    public init( board : Board ){
        super.init(board);
        
        // we define the directions for the Bishop
        this.directions = [
            new Sup.Math.Vector2( 1, 1),
            new Sup.Math.Vector2( 1,-1),
            new Sup.Math.Vector2(-1, 1),
            new Sup.Math.Vector2(-1,-1)
        ];
    }
}
Sup.registerBehavior(Bishop);
