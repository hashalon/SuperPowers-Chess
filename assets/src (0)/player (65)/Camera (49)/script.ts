class CameraControl extends Sup.Behavior {
    
    public sensibility : number = 2;
    public speed       : number = 0.5;
    public closest     : number = 1;
    public farest      : number = 50;
    
    public up       : string = "UP";
    public down     : string = "DOWN";
    public left     : string = "LEFT";
    public right    : string = "RIGHT";
    public forward  : string = "PAGE_UP";
    public backward : string = "PAGE_DOWN";

    protected anchor : Sup.Actor;
    protected camera : Sup.Actor;
    protected angle  : Sup.Math.Vector3;
    
    public holdMouse : boolean;
    
    public get Camera() : Sup.Actor{
        return this.camera;
    }
    public get Angle() : Sup.Math.Vector3{
        return this.angle;
    }
    public set Angle( angle: Sup.Math.Vector3 ){
        this.angle = angle;
    }

    awake() {
        this.anchor = this.actor.getChild("Anchor");
        this.camera = this.actor.getChild("Camera");
        this.angle  = new Sup.Math.Vector3();
        // we recover the default rotation of the camera
        this.angle.x = this.actor .getLocalEulerY();
        this.angle.y = this.anchor.getLocalEulerX();
        this.angle.z = this.camera.getLocalPosition().z;
        this.holdMouse = false;
    }

    update() {
        let move = this.getMove( this.holdMouse );
        
        // we calculate the x rotation
        this.angle.x += move.x;
        this.angle.x % Math.PI*2;
        
        // we calculate the y rotation
        this.angle.y += move.y;
        if( this.angle.y < -Math.PI*0.5 ){
            this.angle.y = -Math.PI*0.5;
        }
        if( this.angle.y > 0 ){
            this.angle.y = 0;
        }
        
        // we move the camera along the z axis
        this.angle.z += move.z;
        if( this.angle.z < this.closest ){
            this.angle.z = this.closest;
        }
        if( this.angle.z > this.farest ){
            this.angle.z = this.farest;
        }
        
        // we apply the rotations
        this.actor .setLocalEulerY( this.angle.x );
        this.anchor.setLocalEulerX( this.angle.y );
        this.camera.setLocalZ( this.angle.z );
    }
    
    protected getMove( holdMouse : boolean ) : Sup.Math.Vector3{
        let move = new Sup.Math.Vector3();
        if( Sup.Input.isKeyDown( this.up    ) ) move.y-=0.01;
        if( Sup.Input.isKeyDown( this.down  ) ) move.y+=0.01;
        move.x *= this.speed;
        if( Sup.Input.isKeyDown( this.left  ) ) move.x-=0.01;
        if( Sup.Input.isKeyDown( this.right ) ) move.x+=0.01;
        move.y *= this.speed;
        
        if( holdMouse ){
            move.x += Sup.Input.getMouseDelta().x * -this.sensibility;
            move.y -= Sup.Input.getMouseDelta().y * -this.sensibility;
        }
        
        if( Sup.Input.isKeyDown( this.forward  ) || Sup.Input.isMouseButtonDown(5) ) --move.z;
        if( Sup.Input.isKeyDown( this.backward ) || Sup.Input.isMouseButtonDown(6) ) ++move.z;
        move.z *= this.speed;
        return move;
    }
    
}
Sup.registerBehavior(CameraControl);
