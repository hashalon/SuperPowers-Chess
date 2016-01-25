let Util = {
    
    convertBehaviors( behaviors : Sup.Behavior[] ) : Sup.Actor[]{
        let actors : Sup.Actor[] = [];
        for( let behavior of behaviors ){
            actors.push( behavior.actor );
        }
        return actors;
    },
    // this function assume that there is only one behavior per actor
    convertActors( actors : Sup.Actor[] ) : Sup.Behavior[]{
        let behaviors : Sup.Behavior[] = [];
        for( let actor of actors ){
            behaviors.push( actor.getBehavior[0] );
        }
        return behaviors;
    }
    
};
