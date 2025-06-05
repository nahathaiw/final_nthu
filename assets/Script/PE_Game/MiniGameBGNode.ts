const { ccclass, property } = cc._decorator;

@ccclass
export default class MiniGameAudio extends cc.Component {
    @property(cc.AudioSource)
    bgm: cc.AudioSource = null;

    private bgmStarted: boolean = false;
    private keyListenerAttached: boolean = false;

    onLoad() {
        const currentScene = cc.director.getScene().name;

        if (currentScene === "PE_Game") {
            cc.systemEvent.on(cc.SystemEvent.EventType.KEY_DOWN, this.onKeyDown, this);
            this.keyListenerAttached = true;
        } else {
            this.stopBGM();
        }
    }

    onKeyDown(event: cc.Event.EventKeyboard) {
        if (!this.bgmStarted && this.bgm) {
            if (
                event.keyCode === cc.macro.KEY.left ||
                event.keyCode === cc.macro.KEY.right
            ) {
                this.bgm.loop = true;
                this.bgm.volume = 0.6;
                this.bgm.play();
                this.bgmStarted = true;
            }
        }
    }

        stopBGM() {
    if (!this.bgm || !cc.isValid(this.bgm, true)) return;

    try {
        if (this.bgm.isPlaying) {
            this.bgm.stop();
        }
    } catch (e) {
        console.warn("⚠️ BGM already destroyed or invalid:", e);
    }
}


    onDestroy() {
        this.stopBGM();
        if (this.keyListenerAttached) {
            cc.systemEvent.off(cc.SystemEvent.EventType.KEY_DOWN, this.onKeyDown, this);
            this.keyListenerAttached = false;
        }
    }
}
