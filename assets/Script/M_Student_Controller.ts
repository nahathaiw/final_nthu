const { ccclass, property } = cc._decorator;

@ccclass
export default class M_Student_NPC extends cc.Component {
    @property(cc.Animation)
    anim: cc.Animation = null;

    @property
    walkSpeed: number = 30;

    private direction: cc.Vec2 = cc.Vec2.ZERO;
    private changeDirTimer: number = 0;
    private lastAnimName: string = "";

    onLoad() {
        const rb = this.getComponent(cc.RigidBody);
        rb.gravityScale = 0;
        rb.fixedRotation = true;
        rb.type = cc.RigidBodyType.Dynamic;
        rb.bullet = true;

        this.randomizeDirection();
    }

    update(dt: number) {
        const rb = this.getComponent(cc.RigidBody);
        rb.linearVelocity = this.direction.mul(this.walkSpeed);

        this.changeDirTimer -= dt;
        if (this.changeDirTimer <= 0) {
            this.randomizeDirection();
        }

        this.updateAnimation();
    }

    private randomizeDirection() {
        const dirs = [
            cc.v2(0, 0),     // idle
            cc.v2(1, 0),     // right
            cc.v2(-1, 0),    // left
            cc.v2(0, 1),     // up
            cc.v2(0, -1),    // down
        ];
        this.direction = dirs[Math.floor(Math.random() * dirs.length)];
        this.changeDirTimer = Math.random() * 2 + 1;
    }

    private updateAnimation() {
        let animName = "";

        if (this.direction.equals(cc.Vec2.ZERO)) {
            animName = "studentIdle";
        } else if (this.direction.x > 0) {
            animName = "student_walkright";
            this.node.scaleX = 1;
        } else if (this.direction.x < 0) {
            animName = "student_walkright";
            this.node.scaleX = -1;
        } else if (this.direction.y > 0) {
            animName = "student_walkup";
            this.node.scaleX = 1;
        } else if (this.direction.y < 0) {
            animName = "student_walkdown";
            this.node.scaleX = 1;
        }

        if (this.lastAnimName !== animName) {
            this.anim.play(animName);
            this.lastAnimName = animName;
        }
    }
}
