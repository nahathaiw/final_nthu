const { ccclass, property } = cc._decorator;

@ccclass
export default class PlayerController extends cc.Component {
    @property(cc.Animation)
    anim: cc.Animation = null;

    @property
    moveSpeed: number = 100;

    @property
    dashMultiplier: number = 2; // 🔼 衝刺倍數

    @property
    dashDuration: number = 0.3; // 🔼 衝刺持續秒數

    @property
    dashCooldown: number = 1.0; // 🔼 衝刺冷卻秒數
    
    @property
    jumpForce: number = 300;

    private moveDir: cc.Vec2 = cc.Vec2.ZERO;
        private keyMap: { [key: number]: boolean } = {};

        onLoad() {
        cc.systemEvent.on(cc.SystemEvent.EventType.KEY_DOWN, this.onKeyDown, this);
        cc.systemEvent.on(cc.SystemEvent.EventType.KEY_UP, this.onKeyUp, this);

        // ✅ Make sure physics is enabled (keep this line only if not done in editor)
        cc.director.getPhysicsManager().enabled = true;

        // ✅ Disable gravity for top-down movement
        this.getComponent(cc.RigidBody).gravityScale = 0;
    }
    private isDashing: boolean = false;            // 是否正在衝刺
    private dashTimer: number = 0;                 // 衝刺剩餘時間
    private dashCooldownTimer: number = 0;         // 衝刺冷卻計時



    onDestroy() {
        cc.systemEvent.off(cc.SystemEvent.EventType.KEY_DOWN, this.onKeyDown, this);
        cc.systemEvent.off(cc.SystemEvent.EventType.KEY_UP, this.onKeyUp, this);
    }

    onKeyDown(event: cc.Event.EventKeyboard) {
        this.keyMap[event.keyCode] = true;
        // 🔼 按下 Shift 並有方向、且不在冷卻中才可觸發 dash
        if (event.keyCode === cc.macro.KEY.shift && !this.isDashing && this.dashCooldownTimer <= 0 && !this.moveDir.equals(cc.Vec2.ZERO)) {
            this.isDashing = true;
            this.dashTimer = this.dashDuration;
            this.dashCooldownTimer = this.dashCooldown;
        }
    }

    onKeyUp(event: cc.Event.EventKeyboard) {
        this.keyMap[event.keyCode] = false;
    }

    update(dt: number) {
        this.handleInput();

        this.getComponent(cc.RigidBody).linearVelocity = this.moveDir.mul(this.moveSpeed);


        // Play animation based on direction
        if (this.moveDir.equals(cc.Vec2.ZERO)) {
            this.playAnim("character_idle");
        } else {
            if (this.moveDir.y > 0) {
                this.playAnim("character_walkup");
                this.node.scaleX = 1;
            } else if (this.moveDir.y < 0) {
                this.playAnim("character_walkdown");
                this.node.scaleX = 1;
            } else if (this.moveDir.x > 0) {
                this.playAnim("character_walkright");
                this.node.scaleX = Math.abs(this.node.scaleX); // face right
            } else if (this.moveDir.x < 0) {
                this.playAnim("character_walkright");
                this.node.scaleX = -Math.abs(this.node.scaleX); // face left
            }

        }
    }

    handleInput() {
        const dir = cc.Vec2.ZERO;

        if (this.keyMap[cc.macro.KEY.left]) {
            dir.x = -1;
        } else if (this.keyMap[cc.macro.KEY.right]) {
            dir.x = 1;
        } else if (this.keyMap[cc.macro.KEY.up]) {
            dir.y = 1;
        } else if (this.keyMap[cc.macro.KEY.down]) {
            dir.y = -1;
        }

        this.moveDir = dir.normalize();
    }

    private lastAnim: string = "";

    playAnim(name: string) {
        if (this.lastAnim !== name) {
            this.anim.play(name);
            this.lastAnim = name;
        }
    }
}
