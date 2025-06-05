const { ccclass, property } = cc._decorator;

@ccclass
export default class CannonController extends cc.Component {

    @property
    speed: number = 300;

    @property
    moveLimitX: number = 448; 

    @property(cc.Camera)
    mainCamera: cc.Camera = null!;

    @property(cc.Prefab)
    bulletPrefab: cc.Prefab = null!;

    @property(cc.Prefab)
    bullet2Prefab: cc.Prefab = null!;



    private moveDir: number = 0;
    private mousePos: cc.Vec2 = cc.v2();

    onLoad() {
        // 鍵盤監聽
        cc.systemEvent.on(cc.SystemEvent.EventType.KEY_DOWN, this.onKeyDown, this);
        cc.systemEvent.on(cc.SystemEvent.EventType.KEY_UP, this.onKeyUp, this);

        // 滑鼠移動監聽
        this.node.parent.on(cc.Node.EventType.MOUSE_MOVE, this.onMouseMove, this);

        cc.systemEvent.on(cc.SystemEvent.EventType.KEY_DOWN, this.onShootKey, this);
        this.node.parent.on(cc.Node.EventType.MOUSE_DOWN, this.onMouseClick, this);

    }

    onDestroy() {
        cc.systemEvent.off(cc.SystemEvent.EventType.KEY_DOWN, this.onKeyDown, this);
        cc.systemEvent.off(cc.SystemEvent.EventType.KEY_UP, this.onKeyUp, this);
        this.node.parent.off(cc.Node.EventType.MOUSE_MOVE, this.onMouseMove, this);
    }

    onKeyDown(event: cc.Event.EventKeyboard) {
        if (event.keyCode === cc.macro.KEY.left || event.keyCode === cc.macro.KEY.a) {
            this.moveDir = -1;
        } else if (event.keyCode === cc.macro.KEY.right || event.keyCode === cc.macro.KEY.d) {
            this.moveDir = 1;
        }
    }

    onKeyUp(event: cc.Event.EventKeyboard) {
        if (
            (event.keyCode === cc.macro.KEY.left && this.moveDir === -1) ||
            (event.keyCode === cc.macro.KEY.right && this.moveDir === 1) ||
            (event.keyCode === cc.macro.KEY.a && this.moveDir === -1) ||
            (event.keyCode === cc.macro.KEY.d && this.moveDir === 1)
        ) {
            this.moveDir = 0;
        }
    }

    onMouseMove(event: cc.Event.EventMouse) {
        this.mousePos = event.getLocation();
    }
    onShootKey(event: cc.Event.EventKeyboard) {
        if (event.keyCode === cc.macro.KEY.space) {
            this.shoot();
        }
    }

    onMouseClick(event: cc.Event.EventMouse) {
        if (event.getButton() === 0) {
            this.shoot(); // 左鍵射 Bullet
        } else if (event.getButton() === 2) {
            this.shootBullet2(); // 右鍵射 Bullet2
        }
    }



    update(dt: number) {
        this.handleMove(dt);
        this.lookAtMouse();
    }
    private shoot() {
        if (!this.bulletPrefab) return;

        const bullet = cc.instantiate(this.bulletPrefab);
        this.node.parent.addChild(bullet);

        // 設定起始位置在砲口前方（距離 50 為例）
        const angleRad = cc.misc.degreesToRadians(this.node.angle);
        const offset = cc.v2(Math.cos(angleRad), Math.sin(angleRad)).mul(50);
        const worldPos = this.node.convertToWorldSpaceAR(cc.v2(0, 0)).add(offset);
        const localPos = this.node.parent.convertToNodeSpaceAR(worldPos);
        bullet.setPosition(localPos);

        // 設定角度與方向
        bullet.angle = this.node.angle;
        const bulletScript = bullet.getComponent("Bullet") //as Bullet;
        bulletScript.init(cc.v2(Math.cos(angleRad), Math.sin(angleRad)));
    }

    private shootBullet2() {
        if (!this.bullet2Prefab) return;

        const bullet = cc.instantiate(this.bullet2Prefab);
        this.node.parent.addChild(bullet);

        const angleRad = cc.misc.degreesToRadians(this.node.angle);
        const offset = cc.v2(Math.cos(angleRad), Math.sin(angleRad)).mul(50);
        const worldPos = this.node.convertToWorldSpaceAR(cc.v2(0, 0)).add(offset);
        const localPos = this.node.parent.convertToNodeSpaceAR(worldPos);
        bullet.setPosition(localPos);

        bullet.angle = this.node.angle;

        const bulletScript = bullet.getComponent("Bullet2");
        bulletScript.init(cc.v2(Math.cos(angleRad), Math.sin(angleRad)));
    }


    private handleMove(dt: number) {
        if (this.moveDir !== 0) {
            let newX = this.node.x + this.moveDir * this.speed * dt;
            newX = Math.max(-this.moveLimitX, Math.min(this.moveLimitX, newX));
            this.node.x = newX;
        }
    }

    private lookAtMouse() {
        if (!this.mainCamera) return;

        const screenPos = new cc.Vec3(this.mousePos.x, this.mousePos.y, 0);
        const worldMousePos = this.mainCamera.getScreenToWorldPoint(screenPos);

        const cannonWorldPos = this.node.convertToWorldSpaceAR(cc.v2(0, 0));
        const dir = cc.v2(worldMousePos.x - cannonWorldPos.x, worldMousePos.y - cannonWorldPos.y);

        let targetAngle = cc.misc.radiansToDegrees(Math.atan2(dir.y, dir.x));
        if (targetAngle < 0) {
            targetAngle += 360;
        }

        if (targetAngle >= 0 && targetAngle <= 180) {
            const lerped = cc.misc.lerp(this.node.angle, targetAngle, 0.2);
            this.node.angle = lerped;
        }
    }


}
