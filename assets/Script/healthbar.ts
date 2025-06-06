const { ccclass, property } = cc._decorator;

@ccclass
export default class healthbar extends cc.Component {
    @property(cc.Sprite)
    hpFill: cc.Sprite = null; // ✅ Green bar

    @property(cc.Sprite)
    bloodTrail: cc.Sprite = null; // ✅ Red trail (static, shows past HP)

    private maxHP: number = 100;
    private currentHP: number = 100;

    setHP(hp: number) {
        this.maxHP = hp;
        this.currentHP = hp;

        // Set both bars to full
        this.hpFill.fillRange = 1;
        this.bloodTrail.fillRange = 1;
    }

    takeDamage(amount: number) {
        const newHP = Math.max(0, this.currentHP - amount);
        const newRatio = newHP / this.maxHP;
        this.currentHP = newHP;

        console.log(`🧪 fillRatio: ${newRatio}, GREEN shrinks, RED stays`);

        // ✅ Only shrink the green HP bar (hpFill)
        cc.tween(this.hpFill)
            .to(0.2, { fillRange: newRatio })
            .start();

        // ❌ Leave the red bar (bloodTrail) alone
        // ✅ It creates a trailing visual to show previous HP
    }
}
