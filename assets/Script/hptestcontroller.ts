import healthbar from "./healthbar";  // lowercase to match your file name

const { ccclass, property } = cc._decorator;

@ccclass
export default class HpTestController extends cc.Component {
    @property(cc.Prefab)
    hpBarPrefab: cc.Prefab = null;

    private hpBarNode: cc.Node = null;
    private hpBar: healthbar = null;

    private maxHP: number = 100;
    private currentHP: number = 100;

    onLoad() {
        // Instantiate HP bar
        this.hpBarNode = cc.instantiate(this.hpBarPrefab);
        this.hpBarNode.parent = this.node;
        this.hpBarNode.setPosition(0, 0);
        this.hpBarNode.setScale(0.5, 0.5);

        // Get healthbar component from prefab
        this.hpBar = this.hpBarNode.getComponent(healthbar);
        if (!this.hpBar) {
            console.error("❌ HealthBar script not found on prefab root node!");
            return;
        }

        this.hpBar.setHP(this.maxHP);
    }

    onEnable() {
        cc.systemEvent.on(cc.SystemEvent.EventType.KEY_DOWN, this.onKeyDown, this);
    }

    onDisable() {
        cc.systemEvent.off(cc.SystemEvent.EventType.KEY_DOWN, this.onKeyDown, this);
    }

    onKeyDown(event: cc.Event.EventKeyboard) {
        if (event.keyCode === cc.macro.KEY.space) {
            this.takeDamage(20);
        }
    }

    takeDamage(amount: number) {
        this.currentHP = Math.max(0, this.currentHP - amount);
        console.log(`💥 Took damage: ${amount}, current HP: ${this.currentHP}`);

        if (this.hpBar) {
            this.hpBar.takeDamage(amount);
        }
    }
}
