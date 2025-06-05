const { ccclass, property } = cc._decorator;

@ccclass
export default class NuclearStartManager extends cc.Component {
    
    @property(cc.Button)
    startButton: cc.Button = null!;

    @property(cc.Button)
    exitButton: cc.Button = null!;

    onLoad() {
        this.startButton.node.on('click', this.onStartClick, this);
        this.exitButton.node.on('click', this.onExitClick, this);
    }

    onStartClick() {
        cc.director.loadScene("Nuclearshooting");
    }

    onExitClick() {
        cc.director.loadScene("GameScene");
    }
}
