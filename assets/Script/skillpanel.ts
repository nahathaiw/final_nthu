const { ccclass, property } = cc._decorator;

@ccclass
export default class SkillPanel extends cc.Component {
    @property(cc.Button)
    laserBtn: cc.Button = null;

    @property(cc.Button)
    fireBtn: cc.Button = null;

    @property(cc.Button)
    dogBtn: cc.Button = null;

    start() {
        this.laserBtn.node.on('click', this.onLaser, this);
        this.fireBtn.node.on('click', this.onFire, this);
        this.dogBtn.node.on('click', this.onDog, this);
    }

    onLaser() {
        console.log("🔴 Laser skill activated!");
        // TODO: implement laser skill
    }

    onFire() {
        console.log("🔥 Fireball launched!");
        // TODO: implement fireball logic
    }

    onDog() {
        console.log("🐶 Dog skill unleashed!");
        // TODO: implement dog skill logic
    }
}
