const { ccclass, property } = cc._decorator;

@ccclass
export default class DogScript extends cc.Component {
    private anim: cc.Animation = null;

    onLoad() {
        this.anim = this.getComponent(cc.Animation);

        if (this.anim) {
            console.log("[DogScript] 🐶 Playing dog animation...");
            this.anim.play("dog");  // Match the clip name exactly
        } else {
            console.warn("[DogScript] ❌ No Animation component found on Dog node.");
        }
    }
}
