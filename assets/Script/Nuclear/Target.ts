const { ccclass } = cc._decorator;

@ccclass
export default class Target extends cc.Component {

    onHit() {
        // 可加入動畫或特效
        this.node.destroy();
    }
}
