const { ccclass, property } = cc._decorator;

@ccclass
export default class FinalSceneController extends cc.Component {
    @property(cc.Label)
    finalScoreLabel: cc.Label = null;

    @property(cc.Label)
    gradeLabel: cc.Label = null;

    @property(cc.Button)
    returnButton: cc.Button = null; // This is your "Return" button

    onLoad() {
        const score = cc.sys.localStorage.getItem('finalScore') || '0';
        const grade = cc.sys.localStorage.getItem('finalGrade') || 'E';

        this.finalScoreLabel.string = `Final Score: ${score}`;
        this.gradeLabel.string = `Your Grade: ${grade}`;

        this.returnButton.node.on('click', this.onReturnClick, this);
    }

    onReturnClick() {
        cc.director.loadScene('GameScene'); // ✅ Your actual game scene name
    }
}
