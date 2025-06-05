const { ccclass, property } = cc._decorator;

@ccclass
export default class DoorTrigger extends cc.Component {
    @property({ type: cc.String })
    targetScene: string = "PE_Game_Menu";

    private anim: cc.Animation = null;
    private triggered: boolean = false;

    onLoad() {
        cc.director.getCollisionManager().enabled = true;
        cc.director.getCollisionManager().enabledDebugDraw = true;

        this.anim = this.getComponent(cc.Animation);
        if (this.anim) {
            console.log("[DoorTrigger] ✅ Animation found. Default clip:", this.anim.defaultClip?.name);
        } else {
            console.warn("[DoorTrigger] ❌ Animation not found.");
        }

        const collider = this.getComponent(cc.PhysicsBoxCollider);
        if (collider) {
            console.log("[DoorTrigger] ✅ PhysicsBoxCollider found. Sensor:", collider.sensor);
        } else {
            console.warn("[DoorTrigger] ❌ PhysicsBoxCollider not found.");
        }
    }

    onBeginContact(contact, selfCollider, otherCollider) {
        console.log("[DoorTrigger] 🔄 Begin contact with:", otherCollider.node.name);

        if (this.triggered) return;

        if (otherCollider.node.name === "Player") {
            console.log("[DoorTrigger] ✅ Player touched the door.");
            this.triggered = true;
            this.openAndLoadScene();
        } else {
            console.log("[DoorTrigger] ❌ Ignored collision from non-player.");
        }
    }

    openAndLoadScene() {
        if (this.anim) {
            console.log("[DoorTrigger] ▶ Playing animation: PE_OPEN");
            this.anim.play("PE_OPEN");
        }

        const collider = this.getComponent(cc.PhysicsBoxCollider);
        if (collider) {
            this.scheduleOnce(() => {
                collider.enabled = false;
                console.log("[DoorTrigger] 🚫 Collider disabled.");
            }, 0.5);
        }

        this.scheduleOnce(() => {
            console.log("[DoorTrigger] 🌟 Loading scene:", this.targetScene);
            cc.director.loadScene(this.targetScene);
        }, 1.0);
    }
}
