const { ccclass, property } = cc._decorator;

@ccclass
export default class MazeGenerator extends cc.Component {
    @property(cc.Prefab)
    wallPrefab: cc.Prefab = null;

    @property(cc.Prefab)
    groundPrefab: cc.Prefab = null;

    @property(cc.Prefab)
    treasurePrefab: cc.Prefab = null;

    @property(cc.Prefab)
    playerPrefab: cc.Prefab = null;

    @property
    tileSize: number = 32;

    @property
    width: number = 15;

    @property
    height: number = 15;
    @property(cc.Animation)
    playerAnim: cc.Animation = null;


    private map: number[][] = [];
    private playerNode: cc.Node = null;
    private playerPos: cc.Vec2 = null;
    private treasureNode: cc.Node = null;
    private isMoving: boolean = false;

    onLoad() {
        this.generateMaze();
        this.renderMaze();
        this.placeTreasure();
        this.spawnPlayer();
        this.setupInput();
    }

    generateMaze() {
        const W = this.width;
        const H = this.height;
        this.map = Array.from({ length: H }, () => Array(W).fill(1)); // 1 = wall, 0 = path

        const dfs = (x: number, y: number) => {
            const dirs = [
                [0, -2], [0, 2], [-2, 0], [2, 0]
            ].sort(() => Math.random() - 0.5);

            for (const [dx, dy] of dirs) {
                const nx = x + dx;
                const ny = y + dy;
                if (ny > 0 && ny < H && nx > 0 && nx < W && this.map[ny][nx] === 1) {
                    this.map[ny][nx] = 0;
                    this.map[y + dy / 2][x + dx / 2] = 0;
                    dfs(nx, ny);
                }
            }
        };

        this.map[1][1] = 0;
        dfs(1, 1);
    }

    renderMaze() {
        this.node.removeAllChildren();

        const centerOffsetX = (this.width - 1) * this.tileSize / 2;
        const centerOffsetY = (this.height - 1) * this.tileSize / 2;

        for (let y = 0; y < this.height; y++) {
            for (let x = 0; x < this.width; x++) {
                const prefab = this.map[y][x] === 1 ? this.wallPrefab : this.groundPrefab;
                const tile = cc.instantiate(prefab);

                const posX = x * this.tileSize - centerOffsetX;
                const posY = -y * this.tileSize + centerOffsetY;

                tile.setPosition(posX, posY);
                this.node.addChild(tile);
            }
        }
    }

    placeTreasure() {
        const paths: { x: number, y: number }[] = [];

        for (let y = 0; y < this.height; y++) {
            for (let x = 0; x < this.width; x++) {
                if (this.map[y][x] === 0) {
                    paths.push({ x, y });
                }
            }
        }

        const randomIndex = Math.floor(Math.random() * paths.length);
        const { x, y } = paths[randomIndex];

        const centerOffsetX = (this.width - 1) * this.tileSize / 2;
        const centerOffsetY = (this.height - 1) * this.tileSize / 2;

        const treasure = cc.instantiate(this.treasurePrefab);
        treasure.setPosition(
            x * this.tileSize - centerOffsetX,
            -y * this.tileSize + centerOffsetY
        );
        this.node.addChild(treasure);
        this.treasureNode = treasure;
    }

    spawnPlayer() {
        this.playerPos = cc.v2(1, 1);

        const centerOffsetX = (this.width - 1) * this.tileSize / 2;
        const centerOffsetY = (this.height - 1) * this.tileSize / 2;

        this.playerNode = cc.instantiate(this.playerPrefab);
        this.playerNode.setPosition(
            this.playerPos.x * this.tileSize - centerOffsetX,
            -this.playerPos.y * this.tileSize + centerOffsetY
        );

        // ✅ 抓取 Animation 元件（你 prefab 上已經綁定了）
        this.playerAnim = this.playerNode.getComponent(cc.Animation);

        // ✅ 建議預設 scaleX = 1
        this.playerNode.scaleX = 1;

        this.node.addChild(this.playerNode);
    }



    setupInput() {
        cc.systemEvent.on(cc.SystemEvent.EventType.KEY_DOWN, this.handleMove, this);
    }

    handleMove(event: cc.Event.EventKeyboard) {
        if (this.isMoving) return;

        let dx = 0, dy = 0;
        let animName = "";
        let flipX = 1;

        switch (event.keyCode) {
            case cc.macro.KEY.w:
                dy = -1;
                animName = "character_walkup";
                break;
            case cc.macro.KEY.s:
                dy = 1;
                animName = "character_walkdown";
                break;
            case cc.macro.KEY.a:
                dx = -1;
                animName = "character_walkright";
                flipX = -1;
                break;
            case cc.macro.KEY.d:
                dx = 1;
                animName = "character_walkright";
                flipX = 1;
                break;
            default:
                return;
        }

        const newX = this.playerPos.x + dx;
        const newY = this.playerPos.y + dy;

        if (
            newX < 0 || newX >= this.width ||
            newY < 0 || newY >= this.height ||
            this.map[newY][newX] !== 0
        ) {
            // 撞牆可選擇播放 idle
            return;
        }

        // ✅ 進入移動狀態
        this.isMoving = true;
        this.playerPos = cc.v2(newX, newY);

        const centerOffsetX = (this.width - 1) * this.tileSize / 2;
        const centerOffsetY = (this.height - 1) * this.tileSize / 2;

        const targetPos = cc.v3(
            newX * this.tileSize - centerOffsetX,
            -newY * this.tileSize + centerOffsetY
        );

        // ✅ 撥動畫（一次，只在進入移動時播）
        if (this.playerAnim && animName) {
            if (!this.playerAnim.getAnimationState(animName).isPlaying) {
                this.playerAnim.play(animName);
            }
        }

        // ✅ 鏡像處理
        this.playerNode.scaleX = flipX;

        // ✅ tween 運動 + 播 idle + 安全收尾
        cc.tween(this.playerNode)
            .to(0.2, { position: targetPos })
            .call(() => {
                this.playerNode.setPosition(targetPos); // 收尾
                this.isMoving = false;

                if (this.playerAnim) {
                    this.playerAnim.play("character_idle");
                }

                this.checkTreasureCollision();
            })
            .start();
    }





    checkTreasureCollision() {
        if (!this.treasureNode) return;

        const playerPos = this.playerNode.getPosition();
        const treasurePos = this.treasureNode.getPosition();

        if (playerPos.fuzzyEquals(treasurePos, 1)) {
            this.treasureNode.destroy();
            this.treasureNode = null;
            cc.log("🎉 撿到寶藏！");

            // ✅ 加一點延遲讓玩家看到反應，再跳轉
            this.scheduleOnce(() => {
                cc.director.loadScene("Mazeresult"); // ⚠️ 請確保場景名稱正確
            }, 0.5);
        }
    }

}
