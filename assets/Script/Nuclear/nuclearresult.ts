import UserManager from "../Usermanagement";  // ⬅️ 確保你有這行！

const { ccclass, property } = cc._decorator;

@ccclass
export default class ResultManager extends cc.Component {

    @property(cc.Label)
    resultLabel: cc.Label = null;

    private finalScore: number = 0;

    setFinalScore(score: number) {
        this.finalScore = score;

        // ✅ 自動將分數記錄到 Firebase
        UserManager.updateScoreIfHigher("NuclearGame", score);

        this.showResult();
    }

    showResult() {
        let grade = "D";
        if (this.finalScore > 1500) grade = "A";
        else if (this.finalScore > 1000) grade = "B";
        else if (this.finalScore > 500) grade = "C";

        this.resultLabel.string = `分數：${this.finalScore}\n成績：${grade}`;
    }

    exitButton() {
        cc.director.loadScene("GameScene");
    }
}
