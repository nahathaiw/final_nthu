const { ccclass, property } = cc._decorator;

@ccclass
export default class BattleController extends cc.Component {
    @property(cc.Prefab)
    fireballPrefab: cc.Prefab = null;

    @property(cc.Node)
    firePoint: cc.Node = null;

    onLoad() {
        // ✅ Enable physics engine
        cc.director.getPhysicsManager().enabled = true;

        // ✅ (Optional) Show physics debug shapes
        cc.director.getPhysicsManager().debugDrawFlags =
        cc.PhysicsManager.DrawBits.e_aabbBit |
        cc.PhysicsManager.DrawBits.e_shapeBit;

    }

    fireFireball() {
        if (!this.fireballPrefab || !this.firePoint) {
            console.warn("❌ Missing fireballPrefab or firePoint");
            return;
        }

        const fb = cc.instantiate(this.fireballPrefab);
        fb.parent = this.node.parent;

        const worldPos = this.firePoint.convertToWorldSpaceAR(cc.v2(0, 0));
        fb.setPosition(worldPos);

        const anim = fb.getComponent(cc.Animation);
        if (anim) anim.play("fireball_anim");

        console.log("🔥 Fireball launched!");
    }

    // ✅ Attach this to the Fire button's Click Event
    onFireClick() {
        console.log("🔥 Fire button clicked!");
        this.fireFireball();
    }
}
