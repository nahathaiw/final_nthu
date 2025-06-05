const { ccclass, property } = cc._decorator;
import MiniGameController from './MiniGameController';

@ccclass
export default class ScoreController extends cc.Component {
    @property(cc.Label)
    scoreLabel: cc.Label = null;

    @property(cc.Button)
    leftButton: cc.Button = null;

    @property(cc.Button)
    rightButton: cc.Button = null;

    @property(cc.Label)
    timerLabel: cc.Label = null;

    @property(MiniGameController)
    character: MiniGameController = null; // ✅ Fixed name here

    @property(cc.Node)
    audioNode: cc.Node = null; // 🎧 MiniGameAudio node reference

    private score: number = 0;
    private timeLeft: number = 60;
    private gameActive: boolean = true;

    onLoad() {
        // Handle button clicks
        this.leftButton.node.on('click', this.onLeftClick, this);
        this.rightButton.node.on('click', this.onRightClick, this);

        // Handle keyboard input
        cc.systemEvent.on(cc.SystemEvent.EventType.KEY_DOWN, this.onKeyDown, this);

        this.startTimer();
        this.updateTimer();
        this.updateScore();
    }

    onDestroy() {
        cc.systemEvent.off(cc.SystemEvent.EventType.KEY_DOWN, this.onKeyDown, this);
    }

    onKeyDown(event: cc.Event.EventKeyboard) {
        if (!this.gameActive) return;

        switch (event.keyCode) {
            case cc.macro.KEY.left:
                this.simulatePress(this.leftButton);
                this.onLeftClick();
                break;
            case cc.macro.KEY.right:
                this.simulatePress(this.rightButton);
                this.onRightClick();
                break;
        }
    }

    onLeftClick() {
        if (!this.gameActive) return;

        this.score++;
        this.updateScore();
        this.character.runStep(); // ✅ Move character
    }

    onRightClick() {
        if (!this.gameActive) return;

        this.score++;
        this.updateScore();
        this.character.runStep(); // ✅ Move character
    }

    updateScore() {
        this.scoreLabel.string = `Score: ${this.score}`;
    }

    startTimer() {
        this.schedule(this.countDown, 1);
    }

    countDown() {
        this.timeLeft--;
        this.updateTimer();

        if (this.timeLeft <= 0) {
            this.endGame();
        }
    }

    updateTimer() {
        this.timerLabel.string = `Time: ${this.timeLeft}s`;
    }

    endGame() {
        this.gameActive = false;
        this.unschedule(this.countDown);

        this.leftButton.interactable = false;
        this.rightButton.interactable = false;

        const grade = this.calculateGrade();

        cc.sys.localStorage.setItem('finalScore', this.score.toString());
        cc.sys.localStorage.setItem('finalGrade', grade);

        console.log(`Game Over! Final Score: ${this.score}, Grade: ${grade}`);

        // 🎧 Stop audio before switching scenes
        if (this.audioNode && this.audioNode.isValid) {
            const audio = this.audioNode.getComponent('MiniGameAudio');
            if (audio) {
                audio.onDestroy();
            }
        }

        this.scheduleOnce(() => {
            cc.director.loadScene('PE_Game_Final'); }, 0.1);

    }

    simulatePress(button: cc.Button) {
        const target = button.target;
        if (!target) return;

        const sprite = target.getComponent(cc.Sprite);
        if (!sprite || !button.pressedSprite || !button.normalSprite) return;

        sprite.spriteFrame = button.pressedSprite;

        this.scheduleOnce(() => {
            sprite.spriteFrame = button.normalSprite;
        }, 0.1);
    }

    calculateGrade(): string {
        if (this.score >= 600) return 'A';
        if (this.score >= 400) return 'B';
        if (this.score >= 300) return 'C';
        if (this.score >= 200) return 'D';
        return 'E';
    }
}
