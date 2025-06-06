const { ccclass, property } = cc._decorator;

@ccclass
export default class NuclearStartManager extends cc.Component {
    
    @property(cc.Button)
    startButton: cc.Button = null!;

    @property(cc.Button)
    exitButton: cc.Button = null!;

    onLoad() {
        this.startButton.node.on('click', this.onStartClick, this);
        this.exitButton.node.on('click', this.onExitClick, this);
    }

    onStartClick() {
        cc.director.loadScene("Nuclearshooting");
    }

    onExitClick() {
        // ✅ Save the coordinates before switching to GameScene
        cc.sys.localStorage.setItem("returnX", "112.117");
        cc.sys.localStorage.setItem("returnY", "3244.631");

        cc.director.loadScene("GameScene", () => {
            // ✅ Once GameScene is loaded, move the player
            const canvas = cc.director.getScene().getChildByName("Canvas");
            if (canvas) {
                const player = canvas.getChildByName("Player");
                if (player) {
                    player.setPosition(112.117, 3244.631);
                    console.log("✅ Player moved to (112.117, 3244.631)");
                } else {
                    console.warn("⚠️ Player node not found in Canvas.");
                }
            } else {
                console.warn("⚠️ Canvas not found in new scene.");
            }
        });
    }
}
