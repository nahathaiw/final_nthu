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
        // 💡 Create HP bar
        const hpNode = cc.instantiate(this.hpBarPrefab);
        hpNode.parent = this.node;
        hpNode.setPosition(0, 50);
        hpNode.setScale(0.25, 0.25);

        this.hpBar = hpNode.getComponent(HealthBar);
        this.hpBar.setHP(this.maxHP);

        this.currentHP = this.maxHP;
    }

    takeDamage(amount: number) {
        this.currentHP -= amount;

        if (this.hpBar) {
            this.hpBar.takeDamage(amount);
        }

        console.log(`😵 ${this.node.name} took ${amount} damage. HP left: ${this.currentHP}`);

        if (this.currentHP <= 0) {
            this.die();
        }
    }

    private die() {
        console.log(`💀 ${this.node.name} has been defeated!`);
        this.node.destroy();
    }
}
