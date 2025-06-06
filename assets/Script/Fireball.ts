const { ccclass, property } = cc._decorator;

@ccclass
export default class Fireball extends cc.Component {
    @property
    speed: number = 500;

    @property
    damage: number = 20;

    onLoad() {
        console.log("✅ Fireball script loaded!");
    }

    update(dt: number) {
        this.node.x += this.speed * dt;
    }

    onBeginContact(contact: cc.PhysicsContact, self: cc.Collider, other: cc.Collider) {
        console.log("🔥 onBeginContact triggered with", other.node.name);

        let node = other?.node;
        while (node) {
            const enemy = node.getComponent("Enemy");
            if (enemy && typeof enemy.takeDamage === "function") {
                console.log(`💥 Hit ${node.name}, dealing ${this.damage} damage.`);
                enemy.takeDamage(this.damage);
                this.node.destroy(); // Destroy the fireball
                return;
            }
            node = node.parent;
        }

        console.warn("❌ Hit something that is not an enemy or takeDamage is missing.");
    }
}
