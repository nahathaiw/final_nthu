import healthbar from "./healthbar";

const { ccclass, property } = cc._decorator;

@ccclass
export default class Player extends cc.Component {
    @property(cc.Prefab)
    hpBarPrefab: cc.Prefab = null;

    private hpBar: healthbar = null;
    private maxHP: number = 100;
    private currentHP: number = 100;

    onLoad() {
        const hpNode = cc.instantiate(this.hpBarPrefab);
        hpNode.parent = this.node;
        hpNode.setPosition(-70, -55);
        hpNode.setScale(0.3, 0.3);

        this.hpBar = hpNode.getComponent(healthbar);
        this.hpBar.setHP(this.maxHP);
    }

    takeDamage(amount: number) {
        this.currentHP = Math.max(0, this.currentHP - amount);
        console.log(`❤️ Player took ${amount} damage. HP left: ${this.currentHP}`);

        if (this.hpBar) {
            this.hpBar.takeDamage(amount);
        }

        if (this.currentHP <= 0) {
            this.die();
        }
    }

    die() {
        console.log("💀 Player has died! Reloading GameScene...");

        cc.director.loadScene("GameScene", () => {
            console.log("✅ GameScene loaded after player death");

            const canvas = cc.director.getScene().getChildByName("Canvas");
            const player = canvas?.getChildByName("Player");

            if (player) {
                player.setPosition(352.352, 1454.771);
                console.log("🚶 Player moved to (352.352, 1454.771)");
            } else {
                console.warn("❌ Player not found in GameScene!");
            }
        });
    }
}
