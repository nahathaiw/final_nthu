const { ccclass, property } = cc._decorator;

@ccclass
export default class BattleController extends cc.Component {
    @property(cc.Prefab)
    fireballPrefab: cc.Prefab = null;

    @property(cc.Prefab)
    laserPrefab: cc.Prefab = null;

    @property(cc.Prefab)
    dogPrefab: cc.Prefab = null; // 🐶 New: Dog projectile prefab

    @property(cc.Node)
    firePoint: cc.Node = null;

    onLoad() {
        cc.director.getPhysicsManager().enabled = true;
        //cc.director.getPhysicsManager().debugDrawFlags =
          //  cc.PhysicsManager.DrawBits.e_aabbBit |
            //cc.PhysicsManager.DrawBits.e_shapeBit;
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

    fireLaser() {
        if (!this.laserPrefab || !this.firePoint) {
            console.warn("❌ Missing laserPrefab or firePoint");
            return;
        }

        const laser = cc.instantiate(this.laserPrefab);
        laser.parent = this.node.parent;
        const worldPos = this.firePoint.convertToWorldSpaceAR(cc.v2(0, 0));
        laser.setPosition(worldPos);

        console.log("🚀 Laser fired!");
    }

    fireDog() {
        if (!this.dogPrefab || !this.firePoint) {
            console.warn("❌ Missing dogPrefab or firePoint");
            return;
        }

        const dog = cc.instantiate(this.dogPrefab);
        dog.parent = this.node.parent;
        const worldPos = this.firePoint.convertToWorldSpaceAR(cc.v2(0, 0));
        dog.setPosition(worldPos);

        console.log("🐶 Dog launched!");
    }

    onFireClick() {
        console.log("🔥 Fire button clicked!");
        this.fireFireball();
    }

    onLaserClick() {
        console.log("🚀 Laser button clicked!");
        this.fireLaser();
    }

    onDogClick() {
        console.log("🐶 Dog button clicked!");
        this.fireDog();
    }
}
