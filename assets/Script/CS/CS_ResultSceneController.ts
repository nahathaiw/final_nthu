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
            this.resultLabel.string = `You got ${percent}%!`;
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
}
