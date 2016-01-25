class Print extends Sup.Behavior {
    
    protected camera : Sup.Actor;
    
    init( board : Board, coord : Sup.Math.Vector2, camera : Sup.Actor, character : string ) {
        this.actor.setParent( board.Root );
        this.actor.setLocalPosition( board.convertCoordinates( coord ) );
        this.camera = camera;
        this.actor.textRenderer.setText(character);
    }

    update() {
        this.actor.setOrientation( this.camera.getOrientation() );
    }
}
Sup.registerBehavior(Print);
