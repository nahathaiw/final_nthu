const { ccclass, property } = cc._decorator;

@ccclass
export default class HealthBar extends cc.Component {
    @property(cc.Sprite)
    hpFill: cc.Sprite = null; // ✅ Green bar

    @property(cc.Sprite)
    bloodTrail: cc.Sprite = null; // ✅ Red trailing bar

    private currentHP: number = 100;
    private maxHP: number = 100;

    setHP(hp: number) {
        this.maxHP = hp;
        this.currentHP = hp;
        this.hpFill.fillRange = 1;
        this.bloodTrail.fillRange = 1;
    }

    takeDamage(amount: number) {
        const newHP = Math.max(0, this.currentHP - amount);
        const newRatio = newHP / this.maxHP;
        this.currentHP = newHP;

        // 🧪 Debug to confirm the red trail is assigned and working
        console.log(`🧪 fillRatio: ${newRatio}, hpFill assigned: ${!!this.hpFill}, bloodTrail assigned: ${!!this.bloodTrail}`);

        // ✅ Animate green HP bar (immediate)
        cc.tween(this.hpFill)
            .to(0.2, { fillRange: newRatio })
            .start();

        // ✅ Animate red trail (delayed)
        cc.tween(this.bloodTrail)
            .delay(0.2)
            .to(0.4, { fillRange: newRatio })
            .start();
    }
}
