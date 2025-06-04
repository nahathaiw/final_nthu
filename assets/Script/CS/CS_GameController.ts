const { ccclass, property } = cc._decorator;

@ccclass
export default class GameController extends cc.Component {
    @property(cc.Label)
    decimalLabel: cc.Label = null;

    @property([cc.Button])
    binaryButtons: cc.Button[] = [];

    @property(cc.Label)
    scoreLabel: cc.Label = null;

    @property(cc.Label)
    timerLabel: cc.Label = null;

    @property(cc.Label)
    resultLabel: cc.Label = null;

    @property
    totalQuestions: number = 10;

    @property
    timeLimit: number = 60; // seconds

    @property(cc.AudioClip)
    correctSfx: cc.AudioClip = null;

    @property(cc.AudioClip)
    wrongSfx: cc.AudioClip = null;

    private currentDecimal: number = 0;
    private currentQuestion: number = 0;
    private correctAnswers: number = 0;
    private timer: number = 0;
    private gameActive: boolean = true;
    private bitCount: number = 4; // default

    onLoad() {
        const mode = cc.sys.localStorage.getItem("mode");
        const bitCountStr = cc.sys.localStorage.getItem("bitCount");

        if (bitCountStr) {
            this.bitCount = parseInt(bitCountStr);
        }

        if (mode === "practice") {
            this.totalQuestions = Number.MAX_SAFE_INTEGER;
            this.timeLimit = 999999;
        
            const quitButton = this.node.getChildByName("QuitButton");
        if (quitButton) quitButton.active = true;
        }

        this.resetGame();
    }

    resetGame() {
        this.currentQuestion = 0;
        this.correctAnswers = 0;
        this.timer = this.timeLimit;
        this.gameActive = true;

        if (this.resultLabel) this.resultLabel.string = "";
        if (this.scoreLabel) this.scoreLabel.string = `Score: 0`;
        if (this.timerLabel) this.timerLabel.string = `Time: ${this.timer}`;

        this.schedule(this.updateTimer, 1);
        this.generateQuestion();
    }

    updateTimer() {
        if (!this.gameActive) return;

        this.timer--;
        if (this.timerLabel) this.timerLabel.string = `Time: ${this.timer}`;

        if (this.timer <= 0) {
            this.endGame();
        }
    }

    generateQuestion() {
        this.currentDecimal = Math.floor(Math.random() * Math.pow(2, this.bitCount));
        this.decimalLabel.string = this.currentDecimal.toString();

        const correctBinary = this.currentDecimal.toString(2).padStart(this.bitCount, '0');
        const options = new Set([correctBinary]);

        while (options.size < this.binaryButtons.length) {
            const wrongDecimal = Math.floor(Math.random() * Math.pow(2, this.bitCount));
            const wrongBinary = wrongDecimal.toString(2).padStart(this.bitCount, '0');
            options.add(wrongBinary);
        }

        const shuffledOptions = Array.from(options).sort(() => Math.random() - 0.5);

        for (let i = 0; i < this.binaryButtons.length; i++) {
            const label = this.binaryButtons[i].getComponentInChildren(cc.Label);
            label.string = shuffledOptions[i];

            this.binaryButtons[i].clickEvents[0].customEventData = shuffledOptions[i];
            this.binaryButtons[i].interactable = true;
        }
    }

    onOptionClicked(event: cc.Event, customData: string) {
        if (!this.gameActive) return;

        const isCorrect = parseInt(customData, 2) === this.currentDecimal;

        if (isCorrect) {
            this.correctAnswers++;
            if (this.scoreLabel) this.scoreLabel.string = `Score: ${this.correctAnswers}`;
            if (this.correctSfx) cc.audioEngine.playEffect(this.correctSfx, false);
        } else {
            if (this.wrongSfx) cc.audioEngine.playEffect(this.wrongSfx, false);
        }

        this.currentQuestion++;

        if (this.currentQuestion >= this.totalQuestions) {
            this.endGame();
        } else {
            this.generateQuestion();
        }
    }

    endGame() {
        this.gameActive = false;
        this.unschedule(this.updateTimer);

        this.binaryButtons.forEach(btn => btn.interactable = false);

        const percentage = Math.round((this.correctAnswers / this.totalQuestions) * 100);

        cc.sys.localStorage.setItem("finalScorePercent", percentage.toString());

        cc.director.loadScene("CS_ResultScene");
    }

    QuitButton(){
        cc.director.loadScene("CS_ModeSelect");
    }
}
