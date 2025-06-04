const { ccclass, property } = cc._decorator;

@ccclass
export default class MiniGameCharacterController extends cc.Component {
    @property(cc.Animation)
    anim: cc.Animation = null;

    @property
    stepDistance: number = 1;  // move 1 pixel per tap

    @property
    stepDuration: number = 1.0; // takes 1 second to move

    private lastX: number = 0;

    onLoad() {
        // Enable physics
        cc.director.getPhysicsManager().enabled = true;

        // Disable gravity
        const rb = this.getComponent(cc.RigidBody);
        if (rb) {
            rb.gravityScale = 0;
            rb.linearVelocity = cc.Vec2.ZERO;
        }

        this.lastX = this.node.x;
    }

    update(dt: number) {
        if (this.node.x !== this.lastX) {
            this.playWalkAnim();
            this.lastX = this.node.x;
        }
    }

    public runStep() {
        const rb = this.getComponent(cc.RigidBody);
        if (!rb) return;

        // Disable velocity first to prevent sliding
        rb.linearVelocity = cc.Vec2.ZERO;

        // Use tween to move slightly to the right
        cc.tween(this.node)
            .to(this.stepDuration, { x: this.node.x + this.stepDistance })
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
