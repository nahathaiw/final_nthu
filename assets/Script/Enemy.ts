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
        // Create and attach HP bar
        const hpNode = cc.instantiate(this.hpBarPrefab);
        hpNode.parent = this.node;
        hpNode.setPosition(-70, -50);
        hpNode.setScale(0.25, 0.25);

        this.hpBar = hpNode.getComponent(HealthBar);
        this.hpBar.setHP(this.maxHP);

        this.currentHP = this.maxHP;

        console.log("✅ Enemy initialized with HP bar");
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

    die() {
        console.log(`💀 ${this.node.name} has died.`);

        // 🛑 Stop and destroy BGM node
        const bgmNode = cc.find("Canvas/BGMNode"); // Adjust path if your BGM node is elsewhere
        if (bgmNode) {
            const bgmAudio = bgmNode.getComponent(cc.AudioSource);
            if (bgmAudio) {
                bgmAudio.stop();
            }
            bgmNode.destroy();
            console.log("🛑 BGM stopped and destroyed");
        } else {
            console.warn("⚠️ BGMNode not found");
        }

        // ✅ Load GameScene
        cc.director.loadScene("GameScene", () => {
            console.log("✅ GameScene loaded!");

            const canvas = cc.director.getScene().getChildByName("Canvas");
            const player = canvas?.getChildByName("Player");

            if (player) {
                player.setPosition(352.352, 1454.771);
                console.log("🚶 Player moved to (352.352, 1454.771)");
            } else {
                console.warn("❌ Player not found in GameScene!");
            }
        });

        this.node.destroy(); // Destroy this enemy node
    }
}
