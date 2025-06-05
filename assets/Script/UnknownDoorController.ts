const { ccclass, property } = cc._decorator

@ccclass
export default class UnknownDoorController extends cc.Component {
    private anim: cc.Animation = null;
    private triggered: boolean = false;

    onLoad() {
        cc.director.getCollisionManager().enabled = true;
        cc.director.getCollisionManager().enabledDebugDraw = true;

        this.anim = this.getComponent(cc.Animation);
        if (this.anim) {
            console.log("[UnknownDoorController] ✅ Animation found. Default clip:", this.anim.defaultClip?.name);
        } else {
            console.warn("[UnknownDoorController] ❌ Animation component not found.");
        }

        const collider = this.getComponent(cc.PhysicsBoxCollider);
        if (collider) {
            console.log("[UnknownDoorController] ✅ PhysicsBoxCollider found.");
        } else {
            console.warn("[UnknownDoorController] ❌ PhysicsBoxCollider not found.");
        }
    }

    onBeginContact(contact, selfCollider, otherCollider) {
        console.log("[UnknownDoorController] 🔄 Begin contact with:", otherCollider.node.name);

        if (this.triggered) return;

        if (otherCollider.node.name === "Player") {
            console.log("[UnknownDoorController] ✅ Player touched the Unknown door.");
            this.triggered = true;
            this.playOpenAnimation();
        } else {
            console.log("[UnknownDoorController] ❌ Ignored collision from non-player.");
        }
    }

    playOpenAnimation() {
        if (this.anim) {
            console.log("[UnknownDoorController] ▶ Playing animation: Uk_Open_Door");
            this.anim.play("Uk_Open_Door");
        }
    }
}
