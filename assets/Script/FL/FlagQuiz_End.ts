const { ccclass, property } = cc._decorator;

@ccclass
export default class FlagQuiz_End extends cc.Component {
    @property(cc.Label)
    scoreLabel: cc.Label = null;

    onLoad() {
        const percent = cc.sys.localStorage.getItem("finalScorePercent");
        this.scoreLabel.string = `Your Score: ${percent}%`;
    }

    onClickBackToMain() {
        cc.audioEngine.stopMusic(); // optional, if BGM is still playing
        cc.director.loadScene("GameScene"); // go to main menu
    }

    onClickRetry() {
        cc.audioEngine.stopMusic(); // optional, restart fresh
        cc.director.loadScene("FlagQuiz"); // reload the quiz scene
    }
}
