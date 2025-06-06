const { ccclass, property } = cc._decorator;

@ccclass
export default class GameSceneController extends cc.Component {
    @property(cc.AudioClip)
    bgm: cc.AudioClip = null;

    @property(cc.Node)
    pausePanel: cc.Node = null;

    private bgmId: number = -1;

    onLoad() {
        if (!this.pausePanel) {
            cc.warn("⚠️ pausePanel 尚未綁定！");
        } else {
            this.pausePanel.active = false;
        }

        if (this.bgm) {
            this.bgmId = cc.audioEngine.playMusic(this.bgm, true);
        } else {
            cc.warn("⚠️ bgm 尚未綁定！");
        }
}


    // 🔘 按下暫停按鈕
    onPauseClick() {
        this.pausePanel.active = true;
        cc.audioEngine.pauseMusic();
        cc.director.pause(); // 暫停遊戲邏輯（非必要，看需求）
    }

    // 🔘 暫停面板中的繼續按鈕
    onResumeClick() {
        this.pausePanel.active = false;
        cc.audioEngine.resumeMusic();
        cc.director.resume();
    }
}
