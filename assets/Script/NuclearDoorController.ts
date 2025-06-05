const { ccclass, property } = cc._decorator;

@ccclass
export default class NuclearDoorTrigger extends cc.Component {
    @property({ type: cc.String })
    targetScene: string = "Nuclearshooting";

    private anim: cc.Animation = null;
    private triggered: boolean = false;

    onLoad() {
        cc.director.getCollisionManager().enabled = true;
        cc.director.getCollisionManager().enabledDebugDraw = true;

        this.anim = this.getComponent(cc.Animation);
        if (this.anim) {
            console.log("[NuclearDoorTrigger] ✅ Animation component found. Default clip:", this.anim.defaultClip?.name);
        } else {
            console.warn("[NuclearDoorTrigger] ❌ Animation not found.");
        }

        const collider = this.getComponent(cc.PhysicsBoxCollider);
        if (collider) {
            console.log("[NuclearDoorTrigger] ✅ PhysicsBoxCollider found. Sensor:", collider.sensor);
        } else {
            console.warn("[NuclearDoorTrigger] ❌ PhysicsBoxCollider not found.");
        }
    }

    onBeginContact(contact, selfCollider, otherCollider) {
        console.log("[NuclearDoorTrigger] 🔄 Begin contact with:", otherCollider.node.name);

        if (this.triggered) return;

        if (otherCollider.node.name === "Player") {
            console.log("[NuclearDoorTrigger] ✅ Player touched the nuclear door.");
            this.triggered = true;
            this.openAndLoadScene();
        } else {
            console.log("[NuclearDoorTrigger] ❌ Ignored collision from non-player.");
        }
    }

   openAndLoadScene() {
    if (this.anim) {
        console.log("[NuclearDoorTrigger] ▶ Playing animation: Nuclear_Door_Open");
        this.anim.play("Nuclear_Door_Open");
    }

    // No more disabling collider!

    this.scheduleOnce(() => {
        console.log("[NuclearDoorTrigger] 🌟 Loading scene:", this.targetScene);
        cc.director.loadScene(this.targetScene);
    }, 1.0);
}

}
