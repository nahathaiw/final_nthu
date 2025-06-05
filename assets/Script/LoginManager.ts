//declare var firebase: any;

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

        this.loginButton.node.on('click', this.onLoginClick, this);
        this.signUpButton.node.on('click', this.onSignUpClick, this);

    }

    // 🔓 登入按鈕處理邏輯
    // 🔓 登入按鈕處理邏輯
    onLoginClick() {
        console.log("🚀 登入按鈕被觸發");
        const email = this.emailInput.string.trim();
        const password = this.passwordInput.string;

        console.log("📧 Email:", email);
        console.log("🔑 Password:", password);

        if (!email || !password) {
            this.messageLabel.string = "請輸入帳號和密碼";
            return;
        }

        const safeKey = this.encodeEmail(email);
        const userRef = firebase.database().ref("users/" + safeKey);

        userRef.once("value")
            .then((snapshot) => {
                if (!snapshot.exists()) {
                    this.messageLabel.string = "❌ 帳號不存在，請先註冊";
                    return;
                }

                return firebase.auth().signInWithEmailAndPassword(email, password)
                    .then((userCredential) => {
                        console.log("✅ 登入成功：", userCredential.user.email);
                        this.messageLabel.string = "✅ 登入成功：" + userCredential.user.email;

                        // ✅ 1 秒後跳轉場景
                        this.scheduleOnce(() => {
                            cc.director.loadScene("MainMenu");
                        }, 1.0);
                    })
                    .catch((error) => {
                        console.error("❌ 登入失敗：", error);
                        this.messageLabel.string = "❌ 登入失敗：" + error.message;
                    });
            })
            .catch((err) => {
                console.error("❌ Firebase DB 讀取失敗：", err);
                this.messageLabel.string = "❌ 無法存取 Firebase 資料庫";
            });
    }


    // 📝 註冊按鈕處理邏輯
    onSignUpClick() {
        const email = this.emailInput.string.trim();
        const password = this.passwordInput.string;

        if (!email || !password) {
            this.messageLabel.string = "請輸入帳號和密碼";
            return;
        }

        const safeKey = this.encodeEmail(email);
        const userRef = firebase.database().ref("users/" + safeKey);

        userRef.once("value", (snapshot) => {
            if (snapshot.exists()) {
                this.messageLabel.string = "❌ 帳號已存在，請直接登入";
                return;
            }

            firebase.auth().createUserWithEmailAndPassword(email, password)
                .then((userCredential) => {
                    firebase.database().ref("users/" + safeKey).set({
                        email: userCredential.user.email,
                        createdAt: Date.now()
                    });
                    this.messageLabel.string = "✅ 註冊成功：" + userCredential.user.email;
                })
                .catch((error) => {
                    this.messageLabel.string = "❌ 註冊失敗：" + error.message;
                });
        });
    }

    // 將 email 編碼成 Firebase 安全 key
    encodeEmail(email: string): string {
        return email.replace(/\./g, "_").replace(/@/g, "_");
    }
}
