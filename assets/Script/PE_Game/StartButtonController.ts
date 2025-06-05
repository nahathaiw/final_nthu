const { ccclass } = cc._decorator;

@ccclass
export default class StartButtonController extends cc.Component {
    onClickStart() {
        cc.director.loadScene("PE_Game"); // 🔁 Make sure scene name is exactly "PE_Game"
    }
}
