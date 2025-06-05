const { ccclass, property } = cc._decorator;

@ccclass
export default class FlagQuizGame extends cc.Component {
    @property(cc.Label)
    questionLabel: cc.Label = null;

    @property([cc.Button])
    flagButtons: cc.Button[] = [];

    @property(cc.Label)
    scoreLabel: cc.Label = null;

    @property(cc.Label)
    resultLabel: cc.Label = null;

    @property(cc.AudioClip)
    correctSfx: cc.AudioClip = null;

    @property(cc.AudioClip)
    wrongSfx: cc.AudioClip = null;

    private score: number = 0;
    private currentQuestionIndex: number = 0;
    private gameActive: boolean = true;

    private questions = [
        { //1
            question: "Where is Mount Fuji located?",
            correct: "Japan",
            options: ["Japan", "South Korea", "China", "Thailand"]
        },
        {//2
            question: "Which country speaks Thai?",
            correct: "Thailand",
            options: ["Taiwan", "Thailand", "Laos", "Malaysia"]
        },
        {//3
            question: "Where is the Eiffel Tower?",
            correct: "France",
            options: ["France", "Germany", "Belgium", "Switzerland"]
        },
        {//4
            question: "What country is this flag <🇩🇪>?",
            correct: "Germany",
            options: ["Myanmar", "Germany", "Turkey", "Brazil"]
        },
        {//5
            question: "Where is Mona Lisa?",
            correct: "France",
            options: ["France", "USA", "England", "Italy"]
        },
        {//6
            question: "Where is the Great Pyramid of Giza located?",
            correct: "Egypt",
            options: ["Egypt", "Greece", "Mexico", "India"]
        },
        {//7
            question: "Which country is famous for maple syrup?",
            correct: "Canada",
            options: ["Canada", "USA", "Russia", "Norway"]
        },
        {//8
            question: "Where is the Taj Mahal?",
            correct: "India",
            options: ["India", "Pakistan", "Bangladesh", "Nepal"]
        },
        {//9
            question: "Where would you find the Colosseum?",
            correct: "Italy",
            options: ["Italy", "France", "Spain", "Portugal"]
        },
        {//10
            question: "Where are kangaroos native to?",
            correct: "Australia",
            options: ["Australia", "New Zealand", "South Africa", "USA"]
        },
        // Add more questions...
    ];

    onLoad() {
        this.resetGame();
    }

    resetGame() {
        this.score = 0;
        this.currentQuestionIndex = 0;
        this.gameActive = true;

        this.scoreLabel.string = "Score: 0";
        this.resultLabel.string = "";
        this.showNextQuestion();
    }

    showNextQuestion() {
        if (this.currentQuestionIndex >= this.questions.length) {
            this.endGame();
            return;
        }

        const current = this.questions[this.currentQuestionIndex];
        this.questionLabel.string = current.question;

        const shuffled = current.options.sort(() => Math.random() - 0.5);
        for (let i = 0; i < this.flagButtons.length; i++) {
            const btn = this.flagButtons[i];

            // Set flag sprite (you must manually assign them via Editor)
            btn.clickEvents[0].customEventData = shuffled[i];

            const label = btn.getComponentInChildren(cc.Label);
            label.string = shuffled[i]; // Or use `label.string = ""` if using only images
        }
    }

    onFlagClicked(event: cc.Event, customData: string) {
        if (!this.gameActive) return;

        const current = this.questions[this.currentQuestionIndex];

        if (customData === current.correct) {
            this.score++;
            this.scoreLabel.string = `Score: ${this.score}`;
            if (this.correctSfx) cc.audioEngine.playEffect(this.correctSfx, false);
        } else {
            if (this.wrongSfx) cc.audioEngine.playEffect(this.wrongSfx, false);
        }

        this.currentQuestionIndex++;
        this.showNextQuestion();
    }
    onQuitClicked() {
        cc.director.loadScene("GameScene"); // or your main menu scene name
    }
    
    endGame() {
        const percentage = Math.round((this.score / this.questions.length) * 100);
        cc.sys.localStorage.setItem("finalScorePercent", percentage.toString());
        cc.director.loadScene("FlagQuiz_End");

    }
}
