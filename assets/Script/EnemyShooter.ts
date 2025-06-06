const { ccclass, property } = cc._decorator;

@ccclass
export default class EnemyShooter extends cc.Component {
    @property([cc.Prefab])
    projectilePrefabs: cc.Prefab[] = []; // 🔫 fireball, laser, dog

    @property(cc.Node)
    firePoint: cc.Node = null;

    @property(cc.Node)
    target: cc.Node = null; // the player

    @property
    fireInterval: number = 2.5;

    private timer: number = 0;

    update(dt: number) {
        if (!this.projectilePrefabs.length || !this.firePoint || !this.target) return;

        this.timer += dt;
        if (this.timer >= this.fireInterval) {
            this.timer = 0;
            this.fireRandomProjectile();
        }
    }

    fireRandomProjectile() {
        const index = Math.floor(Math.random() * this.projectilePrefabs.length);
        const prefab = this.projectilePrefabs[index];

        const proj = cc.instantiate(prefab);
        proj.parent = this.node.parent;

        // Position at enemy's firePoint
        const worldPos = this.firePoint.convertToWorldSpaceAR(cc.v2(0, 0));
        proj.setPosition(worldPos);

        // 🔄 Aim toward player
        const dir = this.target.getPosition().sub(proj.getPosition()).normalize();
        proj.angle = -cc.misc.radiansToDegrees(Math.atan2(dir.y, dir.x)); // Optional rotation

        // Move manually in projectile script if needed
        const script = proj.getComponent(proj.name);
        if (script && script.speed !== undefined && script.direction === undefined) {
            // If projectile doesn't support directional targeting, give it velocity override
            script.direction = dir;
        }

        console.log(`👿 Enemy fired ${prefab.name}`);
    }
}
