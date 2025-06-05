const { ccclass, property } = cc._decorator;

@ccclass
export default class ModeSelector extends cc.Component {
    @property(cc.Toggle)
    quizModeToggle: cc.Toggle = null;

    @property(cc.Toggle)
    practiceModeToggle: cc.Toggle = null;

    @property(cc.Toggle)
    bit4Toggle: cc.Toggle = null;

    @property(cc.Toggle)
    bit5Toggle: cc.Toggle = null;

    @property(cc.Toggle)
    bit6Toggle: cc.Toggle = null;

    startGame() {
        const isQuiz = this.quizModeToggle.isChecked;
        const isPractice = this.practiceModeToggle.isChecked;

        const bitCount = this.bit4Toggle.isChecked ? 4 :
                         this.bit5Toggle.isChecked ? 5 : 6;

        cc.sys.localStorage.setItem("mode", isPractice ? "practice" : "quiz");
        cc.sys.localStorage.setItem("bitCount", bitCount.toString());

        cc.director.loadScene("CS_GameScene");
    }
}
