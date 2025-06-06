const { ccclass, property } = cc._decorator;

@ccclass
export default class MainMenuController extends cc.Component {

    @property(cc.Button)
    recordButton: cc.Button = null;

    @property(cc.Button)
    newGameButton: cc.Button = null;

    @property(cc.Button)
    logoutButton: cc.Button = null;

    onLoad() {
        this.setupButtons();
    }

    setupButtons() {
        const user = firebase.auth().currentUser;
        if (!user) {
            cc.warn("❌ 尚未登入，返回登入頁");
            cc.director.loadScene("LoginScene");
            return;
        }

        const uid = this.encodeEmail(user.email);
        const userScoresRef = firebase.database().ref("users/" + uid + "/scores");

        // ⛔ 預設 record 鍵不可用
        this.recordButton.interactable = false;

        // ✅ 查詢是否有分數紀錄
        userScoresRef.once("value").then(snapshot => {
            const scores = snapshot.val();
            const hasAnyScore = scores && Object.keys(scores).length > 0;
            this.recordButton.interactable = hasAnyScore;
        });

        // 🎮 使用舊紀錄
        this.recordButton.node.on("click", () => {
            cc.director.loadScene("GameScene");
        });

        // 🧹 開新遊戲並清除舊分數
        this.newGameButton.node.on("click", () => {
            firebase.database().ref("users/" + uid + "/scores").remove()
                .then(() => {
                    cc.log("🧹 分數已清除，開始新遊戲");
                    cc.director.loadScene("GameScene");
                })
                .catch(err => {
                    cc.error("❌ 清除失敗", err);
                });
        });

        // 🚪 登出
        this.logoutButton.node.on("click", () => {
            firebase.auth().signOut()
                .then(() => {
                    cc.log("✅ 成功登出");
                    cc.director.loadScene("Login");
                })
                .catch(err => {
                    cc.error("❌ 登出失敗", err);
                });
        });
    }

    // 用來轉換 email 為 firebase 安全 key
    encodeEmail(email: string): string {
        return email.replace(/\./g, "_").replace(/@/g, "_");
    }
}
