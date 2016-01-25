class Effect extends Sup.Behavior {
    
    protected move:ISquare;
    
    public get Move(){
        return this.move;
    }
    
    public init( board:Board, move:ISquare ) {
        this.actor.setParent( board.Root );
        this.move = move;
        this.actor.setLocalPosition( board.convertCoordinates(move.coord) );
    }

    public update() {
        this.actor.rotateLocalEulerY( 0.01 );
        let height = 1-(Math.sin(Date.now()*0.01)*0.01);
        this.actor.setLocalScaleY(height);
    }
}
Sup.registerBehavior(Effect);
