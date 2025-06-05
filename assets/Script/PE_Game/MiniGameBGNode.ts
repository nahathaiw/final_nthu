const { ccclass, property } = cc._decorator;

@ccclass
export default class MiniGameAudio extends cc.Component {
    @property(cc.AudioSource)
    bgm: cc.AudioSource = null;

    onLoad() {
        const currentScene = cc.director.getScene().name;

        // ✅ Only play in PE_Game
        if (currentScene === "PE_Game") {
            if (this.bgm && !this.bgm.isPlaying) {
                this.bgm.loop = true;
                this.bgm.volume = 0.6;
                this.bgm.play();
            }
        } else {
            // 🔇 If not PE_Game, stop any audio on this node
            if (this.bgm && this.bgm.isPlaying) {
                this.bgm.stop();
            }
        }
    }

    onDestroy() {
        // Ensure BGM is stopped if node is destroyed when leaving scene
        if (this.bgm && this.bgm.isPlaying) {
            this.bgm.stop();
        }
    }
}
