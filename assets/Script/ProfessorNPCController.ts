const { ccclass, property } = cc._decorator;

@ccclass
export default class ProfessorNPC extends cc.Component {
    @property(cc.Animation)
    anim: cc.Animation = null;

    @property
    walkSpeed: number = 30;

    private direction: cc.Vec2 = cc.Vec2.ZERO;
    private changeDirTimer: number = 0;
    private lastAnimName: string = "";

    onLoad() {
        cc.director.getPhysicsManager().enabled = true;
        this.randomizeDirection();
    }

    update(dt: number) {
        // Move NPC
        const offset = this.direction.mul(this.walkSpeed * dt);
        const newPos = this.node.position.add(new cc.Vec3(offset.x, offset.y, 0));
        this.node.setPosition(newPos);


        // Timer to change direction
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
        this.changeDirTimer = Math.random() * 2 + 1; // change every 1~3 seconds
    }

    private updateAnimation() {
        let animName = "";

        if (this.direction.equals(cc.Vec2.ZERO)) {
            animName = "Prof_idle";
        } else if (this.direction.x > 0) {
            animName = "Prof_go_right";
            this.node.scaleX = 1;
        } else if (this.direction.x < 0) {
            animName = "Prof_go_right"; // Reuse right, flip for left
            this.node.scaleX = -1;
        } else if (this.direction.y > 0) {
            animName = "Prof_walk_up";
            this.node.scaleX = 1;
        } else if (this.direction.y < 0) {
            animName = "Prof_walk_down";
            this.node.scaleX = 1;
        }

        if (this.lastAnimName !== animName) {
            this.anim.play(animName);
            this.lastAnimName = animName;
        }
    }
}
