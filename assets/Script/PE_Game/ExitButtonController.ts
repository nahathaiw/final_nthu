const { ccclass } = cc._decorator;

@ccclass
export default class ExitButtonController extends cc.Component {
    onLoad() {
        // Optionally log
        console.log("ExitButtonController loaded");
    }

    onClickExit() {
        cc.director.loadScene("GameScene"); // Make sure "GameScene" exists in your project
    }
}
