import UserManager from "../Usermanagement";  // ← 根據你的路徑調整

const { ccclass, property } = cc._decorator;

@ccclass
export default class FlagQuiz_End extends cc.Component {
    @property(cc.Label)
    scoreLabel: cc.Label = null;

    private finalScore: number = 0;

    onLoad() {
        const percentStr = cc.sys.localStorage.getItem("finalScorePercent");
        this.finalScore = parseInt(percentStr) || 0;

        this.scoreLabel.string = `Your Score: ${this.finalScore}%`;

        // ✅ 將分數寫入 Firebase
        UserManager.updateScoreIfHigher("FlagQuiz", this.finalScore);
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
