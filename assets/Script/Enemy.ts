import HealthBar from "./healthbar";

const { ccclass, property } = cc._decorator;

@ccclass
export default class Enemy extends cc.Component {
    @property(cc.Prefab)
    hpBarPrefab: cc.Prefab = null;

    private hpBar: HealthBar = null;
    private maxHP: number = 100;
    private currentHP: number = 100;

    onLoad() {
        // 💡 Create HP bar and attach to this enemy
        const hpNode = cc.instantiate(this.hpBarPrefab);
        hpNode.parent = this.node;
        hpNode.setPosition(-5, 25); // Adjust as needed
        hpNode.setScale(0.25, 0.25); // Adjust based on size

        this.hpBar = hpNode.getComponent(HealthBar);
        this.hpBar.setHP(this.maxHP);

        this.currentHP = this.maxHP;

        console.log("✅ Enemy initialized with HP bar");
    }

    takeDamage(amount: number) {
        this.currentHP -= amount;

        if (this.hpBar) {
            this.hpBar.takeDamage(amount); // ✅ Update visual bar
        }

        console.log(`😵 ${this.node.name} took ${amount} damage. HP left: ${this.currentHP}`);

        if (this.currentHP <= 0) {
            this.die();
        }
    }

    die() {
        console.log(`💀 ${this.node.name} has died.`);
        // Add death animation or effect here if desired
        this.node.destroy();
    }
}
