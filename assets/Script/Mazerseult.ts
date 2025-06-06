const { ccclass, property } = cc._decorator;

@ccclass
export default class Mazeresult extends cc.Component {

    @property(cc.VideoPlayer)
    videoPlayer: cc.VideoPlayer = null;

    @property(cc.Button)
    backButton: cc.Button = null;

    onLoad() {
        cc.resources.load("video/easteregg", cc.Asset, (err, asset) => {
            if (err) {
                cc.error("❌ 載入失敗", err);
                return;
            }

            const clip = asset as cc.VideoClip; // ✅ 正確轉型為 VideoClip

            this.videoPlayer.resourceType = cc.VideoPlayer.ResourceType.LOCAL;
            this.videoPlayer.clip = clip;
            //this.videoPlayer.mute = true;
            this.videoPlayer.play();

            this.videoPlayer.node.on("meta-loaded", () => {
                cc.log("✅ Meta 資訊載入完成");
            });

            this.videoPlayer.node.on("playing", () => {
                cc.log("▶️ 播放中");
            });

            this.videoPlayer.node.on("completed", () => {
                cc.log("🎉 播放完成");
            });
        });

        if (this.backButton) {
            this.backButton.node.on("click", this.onBackToGame, this);
        } else {
            cc.warn("⚠️ 返回按鈕未綁定！");
        }
    }

    // 🔘 回到主場景
    onBackToGame() {
        // ✅ Save return coordinates
        cc.sys.localStorage.setItem("returnX", "359.821");
        cc.sys.localStorage.setItem("returnY", "2342.023");

        cc.log("🔙 返回 GameScene");
        cc.director.loadScene("GameScene");
    }
}
