const { ccclass, property } = cc._decorator;

@ccclass
export default class MainMenu extends cc.Component {
    onClickStart() {
        cc.director.loadScene("FlagQuiz"); // your main quiz scene
    }
}
