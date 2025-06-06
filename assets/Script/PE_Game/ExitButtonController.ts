const { ccclass } = cc._decorator;

@ccclass
export default class ExitButtonController extends cc.Component {
    onLoad() {
        // Optionally log
        console.log("ExitButtonController loaded");
    }

    onClickExit() {
        // ✅ Save return position before scene change
        cc.sys.localStorage.setItem("returnX", "884.348");
        cc.sys.localStorage.setItem("returnY", "3260.652");

        cc.director.loadScene("GameScene"); // Make sure "GameScene" exists in your project
    }
}
