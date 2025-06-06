const { ccclass } = cc._decorator;

@ccclass
export default class DogEasterEgg extends cc.Component {

    onLoad() {
        cc.director.getPhysicsManager().enabled = true;
       // cc.director.getPhysicsManager().debugDrawFlags = cc.PhysicsManager.DrawBits.AABB;

        this.scheduleOnce(() => {
            console.log("✅ DogEasterEgg loaded on:", this.node.name);
        }, 0.1);
    }

    onBeginContact(contact: cc.PhysicsContact, selfCollider: cc.PhysicsCollider, otherCollider: cc.PhysicsCollider) {
        console.log("🐶 BEGIN CONTACT with:", otherCollider.node.name);

        if (otherCollider.node.name === "Player") {
            console.log("🎉 Player confirmed! Removing gravity and loading EasterEggMaze...");

            // ✅ Remove gravity before entering EasterEggMaze
            cc.director.getPhysicsManager().gravity = cc.v2(0, 0);

            cc.director.loadScene("EasterEggMaze");
        }
    }
}
