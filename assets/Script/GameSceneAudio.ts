const { ccclass, property } = cc._decorator;

@ccclass
export default class GameSceneAudio extends cc.Component {
    @property(cc.AudioSource)
    bgm: cc.AudioSource = null;

    onLoad() {
        // Optional: make this node persist across scenes
        // cc.game.addPersistRootNode(this.node);

        if (this.bgm && !this.bgm.isPlaying) {
            this.bgm.loop = true;
            this.bgm.volume = 0.1;
            this.bgm.play();
        }
    }
}
