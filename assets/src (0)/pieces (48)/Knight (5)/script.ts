class Knight extends JumpMovePiece {
    
    public init( board : Board ){
        super.init(board);
        
        // we define the jumps for the knight
        this.jumps = [
            new Sup.Math.Vector2( 2, 1),
            new Sup.Math.Vector2(-2, 1),
            new Sup.Math.Vector2( 2,-1),
            new Sup.Math.Vector2(-2,-1),
            new Sup.Math.Vector2( 1, 2),
            new Sup.Math.Vector2(-1, 2),
            new Sup.Math.Vector2( 1,-2),
            new Sup.Math.Vector2(-1,-2)
        ];
    }
}
Sup.registerBehavior(Knight);
