const { ccclass, property } = cc._decorator;

interface PlaceEntry {
    name: string;
    xMin: number;
    xMax: number;
    yMin: number;
    yMax: number;
}

@ccclass
export default class PlaceNameTrigger extends cc.Component {
    @property(cc.Node)
    player: cc.Node = null;

    @property(cc.Label)
    placeLabel: cc.Label = null;

    @property(cc.Node)
    camera: cc.Node = null;

    private places: PlaceEntry[] = [
        {
            name: "Chengkung Lake",
            xMin: -275.373,
            xMax: -175.373,
            yMin: 1398.013,
            yMax: 1498.013
        },
        {
            name: "Chemistry Building",
            xMin: 1013.401,
            xMax: 1113.401,
            yMin: 418.545,
            yMax: 518.545
        },
        {
            name: "XCB",
            xMin: 309.38,
            xMax: 409.38,
            yMin: 2273.416,
            yMax: 2373.416
        },
        {
            name: "Gen2",
            xMin: 508.045,
            xMax: 608.045,
            yMin: 2273.416,
            yMax: 2373.416
        },
        {
            name: "Nuclear Building",
            xMin: 270,
            xMax: 330,
            yMin: 3220,
            yMax: 3300
        },

        {
            name: "Gym",
            xMin: 677.873,
            xMax: 777.873,
            yMin: 3211.937,
            yMax: 3311.937
        },
        {
            name: "CS Building",
            xMin: 1245.455,
            xMax: 1345.455,
            yMin: 3211.937,
            yMax: 3311.937
        },
        {
            name: "Foreign Language Building",
            xMin: 1775.229,
            xMax: 1875.229,
            yMin: 3209.075,
            yMax: 3309.075
        }
    ];

    onLoad() {
        if (!this.placeLabel) {
            console.warn("❌ placeLabel not assigned.");
            return;
        }

        if (!this.camera) {
            console.warn("❌ camera node not assigned.");
            return;
        }

        this.placeLabel.node.active = true;
        this.placeLabel.node.opacity = 0; // start invisible
    }

    update(dt: number) {
        if (!this.player || !this.placeLabel || !this.camera) return;

        // 📍 Make label follow the camera
        const cameraPos = this.camera.getPosition();
        const labelOffset = cc.v2(-110, 315); // adjust as needed
        const labelPos = cameraPos.add(labelOffset);
        this.placeLabel.node.setPosition(labelPos);

        // 🧭 Check if player is inside any known place
        const playerPos = this.player.position;
        let insidePlace = false;

        for (const place of this.places) {
            if (
                playerPos.x >= place.xMin && playerPos.x <= place.xMax &&
                playerPos.y >= place.yMin && playerPos.y <= place.yMax
            ) {
                insidePlace = true;

                if (this.placeLabel.string !== place.name) {
                    console.log(`📍 Entered: ${place.name}`);
                    this.placeLabel.string = place.name;

                    // 🔁 Restart fade animation
                    this.fadeInAndOutLabel();
                }

                break;
            }
        }
    }

    private fadeInAndOutLabel() {
        const labelNode = this.placeLabel.node;

        cc.Tween.stopAllByTarget(labelNode); // Stop existing tweens

        labelNode.opacity = 0;
        labelNode.active = true;

        cc.tween(labelNode)
            .to(0.3, { opacity: 255 }) // fade in
            .delay(2.0)                // stay visible
            .to(0.5, { opacity: 0 })   // fade out
            .start();
    }
}
