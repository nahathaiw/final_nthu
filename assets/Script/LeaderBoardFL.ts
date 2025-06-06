const { ccclass, property } = cc._decorator;

@ccclass
export default class LeaderboardManager extends cc.Component {

    @property(cc.Label)
    leaderboardLabel: cc.Label = null;

    @property({ tooltip: "要顯示哪一個遊戲的排行榜，例如 NuclearGame / CSQuiz / FlagQuiz / PE test" })
    gameKey: string = "FlagQuiz";

    @property({ tooltip: "最多顯示幾名玩家" })
    maxEntries: number = 5;

    onLoad() {
        this.fetchLeaderboard();
    }

    fetchLeaderboard() {
        const usersRef = firebase.database().ref("users");

        usersRef.once("value")
            .then(snapshot => {
                const users = snapshot.val();
                if (!users) {
                    this.leaderboardLabel.string = "無排行榜資料";
                    return;
                }

                const entries: { name: string, score: number }[] = [];

                for (const key in users) {
                    const user = users[key];
                    const score = user.scores?.[this.gameKey];

                    if (score !== undefined && typeof score === "number") {
                        const username = user.email?.split("@")[0] || "unknown";
                        entries.push({ name: username, score });
                    }
                }

                entries.sort((a, b) => b.score - a.score);
                const top = entries.slice(0, this.maxEntries);

                const nameWidth = 12;
                const scoreWidth = 5;

                let displayText = ` Ranking\n\n`;

                displayText += top.map((e, i) => {
                    const rank = `${i + 1}.`.padEnd(3);
                    const name = e.name.padEnd(nameWidth, " ");
                    const score = e.score.toString().padStart(scoreWidth, " ");
                    return `${rank} ${name} ${score}`;
                }).join("\n");

                this.leaderboardLabel.string = displayText;
            })
            .catch(err => {
                console.error("❌ 讀取排行榜失敗：", err);
                this.leaderboardLabel.string = "讀取錯誤";
            });
    }
}
