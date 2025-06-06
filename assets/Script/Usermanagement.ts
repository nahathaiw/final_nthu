// assets/Script/UserManager.ts

export default class UserManager {
    // 取得目前登入使用者
    static getCurrentUser(): firebase.User | null {
        return firebase.auth().currentUser;
    }

    // 將 email 轉成 Firebase 可用的安全 key
    static getSafeKey(): string | null {
        const user = this.getCurrentUser();
        if (!user || !user.email) return null;
        return user.email.replace(/\./g, "_").replace(/@/g, "_");
    }

    // ✅ 寫入分數
    static updateScore(game: string, score: number) {
        const safeKey = this.getSafeKey();
        if (!safeKey) {
            console.warn("⚠️ 尚未登入，無法寫入分數");
            return;
        }

        const ref = firebase.database().ref(`users/${safeKey}/scores/${game}`);
        ref.set(score)
            .then(() => console.log(`✅ 已記錄 ${game} 分數：${score}`))
            .catch((err) => console.error("❌ 分數寫入失敗", err));
    }

    // ✅ 若比原本高才更新
    static updateScoreIfHigher(game: string, score: number) {
        const safeKey = this.getSafeKey();
        if (!safeKey) {
            console.warn("⚠️ 尚未登入，無法寫入分數");
            return;
        }

        const ref = firebase.database().ref(`users/${safeKey}/scores/${game}`);
        ref.once("value")
            .then(snapshot => {
                const currentScore = snapshot.val();
                if (currentScore === null || score > currentScore) {
                    return ref.set(score);
                }
            })
            .then(() => console.log(`📈 分數更新完成（如果更高）: ${score}`))
            .catch(err => console.error("❌ 分數比對寫入失敗", err));
    }

    // ✅ 讀取分數
    static getScore(game: string, callback: (score: number | null) => void) {
        const safeKey = this.getSafeKey();
        if (!safeKey) {
            console.warn("⚠️ 尚未登入，無法讀取分數");
            callback(null);
            return;
        }

        const ref = firebase.database().ref(`users/${safeKey}/scores/${game}`);
        ref.once("value")
            .then(snapshot => callback(snapshot.val()))
            .catch(err => {
                console.error("❌ 分數讀取失敗", err);
                callback(null);
            });
    }
}
