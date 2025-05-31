const { ccclass, property } = cc._decorator;

@ccclass
export default class CameraFollow extends cc.Component {
    @property(cc.Node)
    target: cc.Node = null;

    @property
    followSpeed: number = 10; // ← Make this higher for faster catch-up

    update(dt: number) {
        if (!this.target) return;

        const current = this.node.getPosition();
        const target = this.target.getPosition();
        const newPos = current.lerp(target, 1 - Math.pow(0.001, dt * this.followSpeed));

        this.node.setPosition(newPos);
    }
}
