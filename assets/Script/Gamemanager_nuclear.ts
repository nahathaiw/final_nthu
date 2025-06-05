const { ccclass, property } = cc._decorator;

@ccclass
export default class GameManager extends cc.Component {

    @property(cc.Prefab)
    targetPrefab: cc.Prefab = null!;

    @property(cc.Node)
    targetParent: cc.Node = null!;

    @property
    spawnInterval: number = 1.5;

    @property(cc.Label)
    scoreLabel: cc.Label = null!;  // 拖進剛剛的 Label

    @property
    spawnRangeX: number = 800;

    @property
    spawnRangeY: number = 300;

    @property
    gameDuration: number = 30;

    private elapsedTime: number = 0;
    private isGameOver: boolean = false;
    
    private score: number = 0;  // ✅ 這行是關鍵
    public targets: cc.Node[] = [];

    onLoad() {
        this.schedule(this.spawnTarget, this.spawnInterval);
        this.updateScore(0);  // 初始化分數顯示
    }

    update(dt: number) {
        if (this.isGameOver) return;

        this.elapsedTime += dt;
        if (this.elapsedTime >= this.gameDuration) {
            this.endGame();
        }

        this.checkBulletHits();
        
    }

    spawnTarget() {
        const target = cc.instantiate(this.targetPrefab);
        this.targetParent.addChild(target);

        const randX = (Math.random() - 0.5) * this.spawnRangeX;
        const randY = (Math.random() - 0.5) * (this.spawnRangeY / 2) + (this.spawnRangeY / 2);

        target.setPosition(randX, randY);

        this.targets.push(target);
    }

    checkBulletHits() {
        const bullets = cc.find("Canvas").getComponentsInChildren("Bullet");

        for (let i = bullets.length - 1; i >= 0; i--) {
            const bulletNode = bullets[i].node;

            for (let j = this.targets.length - 1; j >= 0; j--) {
                const targetNode = this.targets[j];

                if (!bulletNode.isValid || !targetNode.isValid) continue;

                const dist = bulletNode.position.sub(targetNode.position).mag();
                if (dist < 40) {
                    const targetScript = targetNode.getComponent("Target");
                    if (targetScript) targetScript.onHit();

                    bulletNode.destroy();
                    this.targets.splice(j, 1);
                    this.addScore(100); // 擊中加分
                    break; // 一顆子彈只打一次
                }
            }
        }
    }
    addScore(amount: number) {
        this.score += amount;
        this.updateScore(this.score);
    }

    updateScore(value: number) {
        if (this.scoreLabel) {
            this.scoreLabel.string = `Score: ${value}`;
        }
    }
    endGame() {
        this.isGameOver = true;
        cc.director.loadScene("NuclearResult", () => {
            const scene = cc.director.getScene();
            const resultScript = scene.getComponentInChildren("nuclearresult");
            if (resultScript) {
                resultScript.setFinalScore(this.score);
            }
        });
    }
}
