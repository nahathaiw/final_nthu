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
    } else {
        this.resultLabel.string = "Score not found.";
    }
}


    retryQuiz() {
        cc.sys.localStorage.setItem("mode", "quiz");
        cc.director.loadScene("CS_GameScene");
    }

    enterPracticeMode() {
        cc.sys.localStorage.setItem("mode", "practice");
        cc.director.loadScene("CS_GameScene");
    }

    returnModeSelector(){
        cc.sys.localStorage.setItem("mode", "quiz");
        cc.director.loadScene("CS_ModeSelect");
    }

    returntoMainGame(){
        cc.director.loadScene("GameScene");
    }

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
