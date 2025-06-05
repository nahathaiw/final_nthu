const { ccclass, property } = cc._decorator;

@ccclass
export default class MiniGameController extends cc.Component {
    @property(cc.Animation)
    anim: cc.Animation = null;

    @property
    stepDistance: number = 100; // 1 pixel movement

    @property
    stepDuration: number = 0.2; // Takes 1 second to move 1 pixel

    private lastX: number = 0;

    onLoad() {
        this.lastX = this.node.x;
    }

    update(dt: number) {
        if (this.node.x !== this.lastX) {
            this.playWalkAnim();
            this.lastX = this.node.x;
        }
    }

    public runStep() {
        const targetX = this.node.x + this.stepDistance;

        cc.tween(this.node)
            .to(this.stepDuration, { x: targetX }) // Move slowly
            .start();
    }

    private playWalkAnim() {
        if (this.anim && !this.anim.getAnimationState("character_walkright").isPlaying) {
            this.anim.play("character_walkright");

            this.scheduleOnce(() => {
                this.anim.play("character_idle");
            }, 0.2);
        }
    }
}
