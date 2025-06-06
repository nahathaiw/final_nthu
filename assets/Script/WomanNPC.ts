const { ccclass, property } = cc._decorator;

@ccclass
export default class WomanNPC extends cc.Component {
    @property(cc.Node)
    player: cc.Node = null;

    @property(cc.Animation)
    anim: cc.Animation = null;

    @property(cc.Node)
    fadeNode: cc.Node = null;

    @property
    detectionRange: number = 200;

    @property
    walkSpeed: number = 50;

    @property
    chaseSpeed: number = 100;

    private isChasing: boolean = false;
    private isFoundAnimationPlayed: boolean = false;
    private currentDir: cc.Vec2 = cc.v2(0, 0);
    private lastPlayedAnim: string = "";
    private hasCollided: boolean = false;

    start() {
        // ✅ Enable physics contact and visual debug
        cc.director.getPhysicsManager().enabled = true;
       // cc.director.getPhysicsManager().debugDrawFlags = 
         //   cc.PhysicsManager.DrawBits.e_aabbBit |
           // cc.PhysicsManager.DrawBits.e_jointBit |
            //cc.PhysicsManager.DrawBits.e_shapeBit;

        const body = this.getComponent(cc.RigidBody);
        if (body) {
            body.gravityScale = 0;
            body.fixedRotation = true;
        }

        this.pickRandomDirection();
        this.schedule(this.pickRandomDirection, 2 + Math.random() * 2);
    }

    update(dt: number) {
        const body = this.getComponent(cc.RigidBody);
        if (!body) return;

        if (this.isChasing) {
            this.walkTowardPlayer(body);
        } else if (!this.isFoundAnimationPlayed) {
            const velocity = this.currentDir.mul(this.walkSpeed);
            body.linearVelocity = velocity;
            this.checkPlayerDistance();
        }
    }

    pickRandomDirection() {
        if (this.isChasing || this.isFoundAnimationPlayed) return;

        const dirs = [
            cc.v2(1, 0), cc.v2(-1, 0),
            cc.v2(0, 1), cc.v2(0, -1),
            cc.v2(0, 0),
        ];
        this.currentDir = dirs[Math.floor(Math.random() * dirs.length)];
        this.playDirectionalAnim(this.currentDir);
    }

    checkPlayerDistance() {
        const dx = this.player.x - this.node.x;
        const dy = this.player.y - this.node.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < this.detectionRange) this.startChase();
    }

    startChase() {
        if (this.isFoundAnimationPlayed) return;

        this.isFoundAnimationPlayed = true;
        this.unscheduleAllCallbacks();

        const body = this.getComponent(cc.RigidBody);
        if (body) body.linearVelocity = cc.v2(0, 0); // stop during animation

        this.anim.play("woman_found");

        this.scheduleOnce(() => {
            this.isChasing = true;
        }, 3);
    }

    walkTowardPlayer(body: cc.RigidBody) {
        const dir = cc.v2(
            this.player.x - this.node.x,
            this.player.y - this.node.y
        ).normalize();

        body.linearVelocity = dir.mul(this.chaseSpeed);
        this.playDirectionalAnim(dir);
    }

    playDirectionalAnim(dir: cc.Vec2) {
        if (dir.equals(cc.v2(0, 0))) {
            if (this.lastPlayedAnim !== "woman_down") {
                this.anim.play("woman_down");
                this.lastPlayedAnim = "woman_down";
            }
            return;
        }

        if (Math.abs(dir.x) > Math.abs(dir.y)) {
            this.node.scaleX = dir.x >= 0 ? 1 : -1;
            if (this.lastPlayedAnim !== "woman_right") {
                this.anim.play("woman_right");
                this.lastPlayedAnim = "woman_right";
            }
        } else {
            const newAnim = dir.y > 0 ? "woman_up" : "woman_down";
            if (this.lastPlayedAnim !== newAnim) {
                this.anim.play(newAnim);
                this.lastPlayedAnim = newAnim;
            }
        }
    }

    // ✅ This works with PhysicsBoxCollider2D
    onBeginContact(contact: cc.PhysicsContact, self: cc.Collider, other: cc.Collider) {
        console.log("[WomanNPC] ✅ Physics contact with:", other.node.name);

        if (this.hasCollided) return;

        if (other.node.name === "Player") {
            this.hasCollided = true;

            const body = this.getComponent(cc.RigidBody);
            if (body) body.linearVelocity = cc.v2(0, 0);

            if (this.fadeNode) {
                this.fadeNode.active = true;
                this.fadeNode.opacity = 0;
                cc.tween(this.fadeNode)
                    .to(1, { opacity: 255 }, { easing: "sineInOut" })
                    .call(() => {
                        cc.director.loadScene("chengkungfight");
                    })
                    .start();
            } else {
                cc.director.loadScene("chengkungfight");
            }
        }
    }
}
