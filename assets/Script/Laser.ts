import Enemy from "./Enemy";

const { ccclass, property } = cc._decorator;

@ccclass
export default class Laser extends cc.Component {
    @property
    speed: number = 1000;

    @property
    damage: number = 10;

    update(dt: number) {
        this.node.x += this.speed * dt;
    }

    onBeginContact(contact: cc.PhysicsContact, self: cc.Collider, other: cc.Collider) {
        const enemy = other.node.getComponent(Enemy);
        if (enemy) {
            console.log(`💥 Laser hit ${other.node.name}, dealing ${this.damage}`);
            enemy.takeDamage(this.damage);
        } else {
            console.log(`⚠️ Laser hit non-enemy: ${other.node.name}`);
        }

        this.node.destroy(); // destroy laser after hit
    }
}
