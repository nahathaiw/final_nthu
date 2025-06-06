import PlayerBattle from "./playerbattle";

const { ccclass, property } = cc._decorator;

@ccclass
export default class SakuraProjectile extends cc.Component {
    @property
    speed: number = 400;

    @property
    damage: number = 15;

    @property
    direction: cc.Vec2 = cc.v2(-1, 0); // ✅ Leftward by default

    update(dt: number) {
        // 🌸 Move left
        this.node.x += this.direction.x * this.speed * dt;
        this.node.y += this.direction.y * this.speed * dt;

        // 🌸 Gentle spin for style
        this.node.angle += 60 * dt;
    }

    onBeginContact(contact: cc.PhysicsContact, self: cc.Collider, other: cc.Collider) {
        const player = other.node.getComponent(PlayerBattle);

        if (player && typeof player.takeDamage === "function") {
            console.log(`🌸 Sakura hit player for ${this.damage} damage.`);
            player.takeDamage(this.damage);
            this.node.destroy();
        }
    }
}
