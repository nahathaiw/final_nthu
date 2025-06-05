const { ccclass, property } = cc._decorator;

@ccclass
export default class Bullet2 extends cc.Component {
    @property
    speed: number = 800;

    private direction: cc.Vec2 = cc.v2(1, 0);

    init(dir: cc.Vec2) {
        this.direction = dir.normalize();
    }

    update(dt: number) {
        const delta = this.direction.mul(this.speed * dt);
        const newPos = this.node.position.add(new cc.Vec3(delta.x, delta.y, 0));
        this.node.setPosition(newPos);

        if (Math.abs(this.node.x) > 1000 || Math.abs(this.node.y) > 1000) {
            this.node.destroy();
        }
    }

    
}
