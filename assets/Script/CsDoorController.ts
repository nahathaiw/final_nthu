const { ccclass, property } = cc._decorator;

@ccclass
export default class CsDoorController extends cc.Component {
    @property({ type: cc.String })
    targetScene: string = "CS_ModeSelect";

    private anim: cc.Animation = null;
    private triggered: boolean = false;

    onLoad() {
        cc.director.getCollisionManager().enabled = true;
        cc.director.getCollisionManager().enabledDebugDraw = true;

        this.anim = this.getComponent(cc.Animation);
        if (this.anim) {
            console.log("[CsDoorController] ✅ Animation found. Default clip:", this.anim.defaultClip?.name);
        } else {
            console.warn("[CsDoorController] ❌ Animation component not found.");
        }

        const collider = this.getComponent(cc.PhysicsBoxCollider);
        if (collider) {
            console.log("[CsDoorController] ✅ PhysicsBoxCollider found.");
        } else {
            console.warn("[CsDoorController] ❌ PhysicsBoxCollider not found.");
        }
    }

    onBeginContact(contact, selfCollider, otherCollider) {
        console.log("[CsDoorController] 🔄 Begin contact with:", otherCollider.node.name);

        if (this.triggered) return;

        if (otherCollider.node.name === "Player") {
            console.log("[CsDoorController] ✅ Player touched the CS door.");
            this.triggered = true;
            this.openAndLoadScene();
        } else {
            console.log("[CsDoorController] ❌ Ignored collision from non-player.");
        }
    }

    openAndLoadScene() {
        if (this.anim) {
            console.log("[CsDoorController] ▶ Playing animation: Cs_Door_Open");
            this.anim.play("Cs_Door_Open");
        }

        // Do NOT disable the collider anymore

        this.scheduleOnce(() => {
            console.log("[CsDoorController] 🌟 Loading scene:", this.targetScene);
            cc.director.loadScene(this.targetScene);
        }, 1.0);
    }
}
