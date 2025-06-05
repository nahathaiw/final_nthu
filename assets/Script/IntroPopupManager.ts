const { ccclass, property } = cc._decorator;

@ccclass
export default class IntroPopupManager extends cc.Component {
    @property(cc.Label)
    messageLabel: cc.Label = null;

    @property(cc.Button)
    nextButton: cc.Button = null;

    @property(cc.Button)
    yesButton: cc.Button = null;

    @property({ type: cc.AudioClip })
    clickSound: cc.AudioClip = null;

    @property({ type: cc.AudioClip })
    yesSound: cc.AudioClip = null;



    private messages: string[] = [
        "📬 Dear student,\n\nWe are pleased to inform you that you have been accepted into National Tsing Hua University.",
        "As a new student, you will face challenges, friendships, and unforgettable memories.",
        "But to graduate, you must complete the legendary campus quest.",
        "Are you ready to begin your journey?"
    ];

    private currentIndex: number = 0;

    onLoad() {
        this.messageLabel.string = this.messages[this.currentIndex];

        this.nextButton.node.on("click", this.showNextMessage, this);
        this.yesButton.node.on("click", () => {
            if (this.yesSound) {
                cc.audioEngine.playEffect(this.yesSound, false);
            }
        
            cc.director.loadScene("GameScene");
        });

        this.yesButton.node.active = false; // hide YES button at start
    }

    showNextMessage() {
     

        if (this.clickSound) {
            cc.audioEngine.playEffect(this.clickSound, false);
        }

        this.currentIndex++;
        if (this.currentIndex < this.messages.length - 1) {
            // Show next message
            this.messageLabel.string = this.messages[this.currentIndex];
        } else if (this.currentIndex === this.messages.length - 1) {
            // Show last message + switch buttons
            this.messageLabel.string = this.messages[this.currentIndex];

            this.nextButton.node.active = false;
            this.yesButton.node.active = true;
        }
    }
}
