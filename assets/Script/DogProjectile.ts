import Enemy from "./Enemy";

const { ccclass, property } = cc._decorator;

@ccclass
export default class DogProjectile extends cc.Component {
    @property
    speed: number = 600;

    @property
    damage: number = 30;

    update(dt: number) {
        this.node.x += this.speed * dt;
    }

    onBeginContact(contact: cc.PhysicsContact, self: cc.Collider, other: cc.Collider) {
        const enemy = other.node.getComponent(Enemy);

        if (enemy && typeof enemy.takeDamage === "function") {
            console.log(`🐶 Dog hit ${other.node.name} and dealt ${this.damage} damage.`);
            enemy.takeDamage(this.damage);
        } else {
            console.log(`🐾 Dog hit non-enemy: ${other.node.name}`);
        }

        this.node.destroy(); // destroy dog after collision
    }
}
