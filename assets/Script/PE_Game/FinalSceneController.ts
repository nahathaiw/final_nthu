import UserManager from "../Usermanagement";  // 根據實際位置調整

const { ccclass, property } = cc._decorator;

@ccclass
export default class FinalSceneController extends cc.Component {
    @property(cc.Label)
    finalScoreLabel: cc.Label = null;

    @property(cc.Label)
    gradeLabel: cc.Label = null;

    @property(cc.Button)
    returnButton: cc.Button = null;

    onLoad() {
        const scoreStr = cc.sys.localStorage.getItem('finalScore') || '0';
        const grade = cc.sys.localStorage.getItem('finalGrade') || 'E';

        const score = parseInt(scoreStr);
        this.finalScoreLabel.string = `Final Score: ${score}`;
        this.gradeLabel.string = `Your Grade: ${grade}`;

        // ✅ 紀錄成績至 Firebase，命名為 FinalGame 或其他部門名稱
        UserManager.updateScoreIfHigher("PE test", score);

        this.returnButton.node.on('click', this.onReturnClick, this);
    }

    onReturnClick() {
        cc.director.loadScene('GameScene'); // ✅ 返回主選單場景
    }
}
