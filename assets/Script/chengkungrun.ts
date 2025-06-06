const { ccclass, property } = cc._decorator;

@ccclass
export default class RunButton extends cc.Component {
    onRunClick() {
        // Save the position to return to (Point A)
        cc.sys.localStorage.setItem("returnX", "352");
        cc.sys.localStorage.setItem("returnY", "252");

        // Flag for WomanNPC to reset
        cc.sys.localStorage.setItem("resetWoman", "true");

        // Load the original game scene
        cc.director.loadScene("GameScene"); // Replace with your scene name if different
    }
}
