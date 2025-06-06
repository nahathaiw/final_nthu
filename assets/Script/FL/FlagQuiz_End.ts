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
        // ✅ 儲存返回主場景時的座標
        cc.sys.localStorage.setItem("returnX", "1880.879");
        cc.sys.localStorage.setItem("returnY", "3292.695");

        cc.audioEngine.stopMusic(); // optional, if BGM is still playing
        cc.director.loadScene("GameScene"); // go to main menu
    }

    onClickRetry() {
        cc.audioEngine.stopMusic(); // optional, restart fresh
        cc.director.loadScene("FlagQuiz"); // reload the quiz scene
    }
}
