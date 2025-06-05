const { ccclass, property } = cc._decorator;

@ccclass
export default class BinaryGuide extends cc.Component {
    // Used when going from ModeSelect to the Guide
    onGuideClicked() {
        cc.director.loadScene("CS_BinaryGuide");
    }

    // Used on the Guide scene to return to ModeSelect (Lobby)
    onBackToLobbyClicked() {
        cc.director.loadScene("CS_ModeSelect");
    }
}
