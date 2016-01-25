class Queen extends DirectionalMovePiece {
    
    public init( board : Board ){
        super.init(board);
        
        // we define the directions for the Queen
        this.directions = [
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
}
Sup.registerBehavior(Queen);
