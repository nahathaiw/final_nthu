const { ccclass, property } = cc._decorator;

@ccclass
export default class EndScene extends cc.Component {
    @property(cc.Label)
    scoreLabel: cc.Label = null;

    onLoad() {
        const percent = cc.sys.localStorage.getItem("finalScorePercent");
        this.scoreLabel.string = `Your Score: ${percent}%`;
    }

    onClickBackToMain() {
        cc.director.loadScene("GameScene");
    }
}
