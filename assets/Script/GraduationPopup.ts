const { ccclass, property } = cc._decorator;

@ccclass
export default class GraduationPopup extends cc.Component {
    @property(cc.Label)
    storyLabel: cc.Label = null;

    @property(cc.Button)
    finishButton: cc.Button = null;

    @property({ type: cc.AudioSource })
    bgmAudio: cc.AudioSource = null;


    
    private fullText: string = 
        "🎓 You’ve finally reached the end...\n\n" +
        "You’ve laughed, cried, rushed deadlines, and survived finals.\n\n" +
        "But university wasn’t just about classes.\n" +
        "It was about friendship. Growth. Finding who you are.\n\n" +
        "Now you’re ready to walk forward —\n" +
        "not because the world is easy,\n" +
        "but because you’ve learned how to face it.\n\n" +
        "Thank you for playing.\nCongratulations, Graduate.";

    private typingSpeed: number = 0.08; // seconds per character

    onLoad() {

        if (this.bgmAudio && !this.bgmAudio.isPlaying) {
            this.bgmAudio.play();
        }
        this.storyLabel.string = "";
        this.finishButton.node.active = false;
        this.startTypingEffect();
        this.finishButton.node.on("click", () => {
            cc.director.loadScene("MainMenu");
        });
    }
    onBackToMenuClick() {
        cc.director.loadScene("MainMenu");
    }
    
    startTypingEffect() {
        let index = 0;
        this.schedule(() => {
            this.storyLabel.string += this.fullText[index];
            index++;

            if (index >= this.fullText.length) {
                this.unscheduleAllCallbacks();
                this.finishButton.node.active = true;
            }
        }, this.typingSpeed);
    }
}
