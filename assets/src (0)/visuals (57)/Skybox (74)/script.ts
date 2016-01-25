class Skybox extends Sup.Behavior {
    
    private camera  : Sup.Actor;
    
    public start() {
        this.camera  = Sup.getActor("Camera");
    }

    public update() {
        this.actor.setOrientation( this.camera.getOrientation() );
    }
}
Sup.registerBehavior(Skybox);
