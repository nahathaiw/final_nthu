// declare var firebase: any;
const { ccclass, property } = cc._decorator;

@ccclass
export default class LoginController extends cc.Component {
    @property(cc.EditBox)
    emailInput: cc.EditBox = null;

    @property(cc.EditBox)
    passwordInput: cc.EditBox = null;

    @property(cc.Label)
    messageLabel: cc.Label = null;

    @property(cc.Button)
    loginButton: cc.Button = null;

    @property(cc.Button)
    signUpButton: cc.Button = null;

    onLoad() {
        console.log("✅ LoginController onLoad called!");

        // 每次進入登入畫面，強制登出前一個帳號
        firebase.auth().signOut().then(() => {
            console.log("🧹 已登出前一帳號");
        });

        this.loginButton.node.on('click', this.onLoginClick, this);
        this.signUpButton.node.on('click', this.onSignUpClick, this);
    }

    // 🔓 登入邏輯
    onLoginClick() {
        const email = this.emailInput.string.trim();
        const password = this.passwordInput.string;

        if (!email || !password) {
            this.messageLabel.string = "請輸入帳號和密碼";
            return;
        }

        firebase.auth().signInWithEmailAndPassword(email, password)
            .then((userCredential) => {
                const user = userCredential.user;
                const safeKey = this.encodeEmail(user.email);
                const userRef = firebase.database().ref("users/" + safeKey);

                // 檢查是否需要補上缺失欄位（email / createdAt / scores）
                userRef.once("value").then(snapshot => {
                    const data = snapshot.val();
                    const updates: any = {};
                    if (!data || !data.email) updates.email = user.email;
                    if (!data || !data.createdAt) updates.createdAt = Date.now();
                    if (!data || !data.scores) updates.scores = {};

                    if (Object.keys(updates).length > 0) {
                        userRef.update(updates);
                        console.log("🛠️ 補齊缺失欄位", updates);
                    }
                });

                this.messageLabel.string = "✅ 登入成功：" + user.email;

                // 延遲進入主選單
                this.scheduleOnce(() => {
                    cc.director.loadScene("MainMenu");
                }, 1.0);
            })
            .catch((error) => {
                console.error("❌ 登入失敗", error);
                this.messageLabel.string = "❌ 登入失敗：" + error.message;
            });
    }

    // 📝 註冊邏輯
    onSignUpClick() {
        const email = this.emailInput.string.trim();
        const password = this.passwordInput.string;

        if (!email || !password) {
            this.messageLabel.string = "請輸入帳號和密碼";
            return;
        }

        if (password.length < 6) {
            this.messageLabel.string = "❗ 密碼請至少輸入 6 個字元";
            return;
        }

        const safeKey = this.encodeEmail(email);
        const userRef = firebase.database().ref("users/" + safeKey);

        firebase.auth().createUserWithEmailAndPassword(email, password)
            .then((userCredential) => {
                const user = userCredential.user;

                userRef.set({
                    email: user.email,
                    createdAt: Date.now(),
                    scores: {}
                });

                this.messageLabel.string = "✅ 註冊成功：" + user.email;

                // 可選：自動跳轉
                this.scheduleOnce(() => {
                    cc.director.loadScene("MainMenu");
                }, 1.0);
            })
            .catch((error) => {
                console.error("❌ 註冊失敗", error);
                this.messageLabel.string = "❌ 註冊失敗：" + error.message;
            });
    }

    // 將 email 編碼成 Firebase 安全 key
    encodeEmail(email: string): string {
        return email.replace(/\./g, "_").replace(/@/g, "_");
    }
}
