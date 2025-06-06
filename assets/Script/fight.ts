const { ccclass, property } = cc._decorator;

@ccclass
export default class RunButton extends cc.Component {
    onClickRun() {
        cc.director.loadScene("chengkungbattlefinal");
    }
}
