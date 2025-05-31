const { ccclass, property } = cc._decorator;

@ccclass
export default class PlayerController extends cc.Component {
    @property(cc.Animation)
    anim: cc.Animation = null;

    @property
    moveSpeed: number = 100;

    private moveDir: cc.Vec2 = cc.Vec2.ZERO;
    private keyMap: { [key: number]: boolean } = {};

    onLoad() {
        cc.systemEvent.on(cc.SystemEvent.EventType.KEY_DOWN, this.onKeyDown, this);
        cc.systemEvent.on(cc.SystemEvent.EventType.KEY_UP, this.onKeyUp, this);
    }

    onDestroy() {
        cc.systemEvent.off(cc.SystemEvent.EventType.KEY_DOWN, this.onKeyDown, this);
        cc.systemEvent.off(cc.SystemEvent.EventType.KEY_UP, this.onKeyUp, this);
    }

    onKeyDown(event: cc.Event.EventKeyboard) {
        this.keyMap[event.keyCode] = true;
    }

    onKeyUp(event: cc.Event.EventKeyboard) {
        this.keyMap[event.keyCode] = false;
    }

    update(dt: number) {
        this.handleInput();

        const displacement = this.moveDir.mul(this.moveSpeed * dt);
        this.node.x += displacement.x;
        this.node.y += displacement.y;

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
                this.node.scaleX = 1;
            } else if (this.moveDir.x < 0) {
                this.playAnim("character_walkright");
                this.node.scaleX = -1;
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
