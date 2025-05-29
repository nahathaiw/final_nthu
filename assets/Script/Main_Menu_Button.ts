const { ccclass, property } = cc._decorator;

@ccclass
export default class StartButton extends cc.Component {
    @property({ tooltip: "Target scene name to load on click" })
    targetScene: string = "GameScene";

    onLoad() {
        this.node.on(cc.Node.EventType.TOUCH_END, this.onClick, this);
    }

    onClick() {
        cc.director.loadScene(this.targetScene);
    }

    onDestroy() {
        this.node.off(cc.Node.EventType.TOUCH_END, this.onClick, this);
    }
}
