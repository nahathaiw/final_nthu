import UserManager from "../Usermanagement";  // ← 請根據你的實際目錄調整

const { ccclass, property } = cc._decorator;

@ccclass
export default class ResultSceneController extends cc.Component {
    @property(cc.Label)
    resultLabel: cc.Label = null;

    onLoad() {
        const percentStr = cc.sys.localStorage.getItem("finalScorePercent");
        const isPractice = cc.sys.localStorage.getItem("mode") === "practice";

        if (isPractice) {
            this.resultLabel.string = "Practice Complete!";
        } else if (percentStr) {
            const percent = parseInt(percentStr);
            const grade = this.getLetterGrade(percent);
            this.resultLabel.string = `You got ${grade} (${percent}%)`;

            // ✅ 正式模式下寫入 Firebase 分數
            UserManager.updateScoreIfHigher("CSQuiz", percent);
        } else {
            this.resultLabel.string = "Score not found.";
        }
    }

    // 🔁 再次挑戰
    retryQuiz() {
        cc.sys.localStorage.setItem("mode", "quiz");
        cc.director.loadScene("CS_GameScene");
    }

    // 🧪 練習模式
    enterPracticeMode() {
        cc.sys.localStorage.setItem("mode", "practice");
        cc.director.loadScene("CS_GameScene");
    }

    // 🔙 回到模式選擇
    returnModeSelector() {
        cc.sys.localStorage.setItem("mode", "quiz");
        cc.director.loadScene("CS_ModeSelect");
    }

    // ⏪ 回主遊戲場景
    returntoMainGame() {
        cc.director.loadScene("GameScene");
    }

    // 📈 轉換成文字成績
    getLetterGrade(percent: number): string {
        if (percent >= 95) return "A+";
        if (percent >= 90) return "A";
        if (percent >= 85) return "A-";
        if (percent >= 80) return "B+";
        if (percent >= 75) return "B";
        if (percent >= 70) return "B-";
        if (percent >= 65) return "C+";
        if (percent >= 60) return "C";
        if (percent >= 50) return "C-";
        return "F";
    }
}
