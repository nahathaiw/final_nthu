const { ccclass, property } = cc._decorator;

@ccclass
export default class FlagScroll extends cc.Component {
    @property(cc.Node)
    button1: cc.Node = null;

    @property(cc.Node)
    button2: cc.Node = null;

    @property(cc.Node)
    button3: cc.Node = null;

    @property(cc.Node)
    button4: cc.Node = null;

    @property
    speed: number = 200;

    @property
    loopX: number = 0; // when button is off screen left

    @property
    resetOffset: number = 240; // spacing between buttons

    private buttons: cc.Node[] = [];

    onLoad() {
        this.buttons = [this.button1, this.button2, this.button3, this.button4];
    }

    update(dt: number) {
        for (let btn of this.buttons) {
            btn.x -= this.speed * dt;

            if (btn.x < this.loopX) {
                const maxX = Math.max(...this.buttons.map(b => b.x));
                btn.x = maxX + this.resetOffset;
            }
        }
    }
}
