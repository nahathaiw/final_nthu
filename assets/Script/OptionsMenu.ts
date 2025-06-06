const { ccclass, property } = cc._decorator;

@ccclass
export default class OptionsMenu extends cc.Component {

    @property(cc.Slider)
    volumeSlider: cc.Slider = null;

    @property(cc.AudioSource)
    bgmAudio: cc.AudioSource = null;

    onLoad() {
        const savedVolume = Number(cc.sys.localStorage.getItem("volume"));
        if (!isNaN(savedVolume)) {
            this.volumeSlider.progress = savedVolume;
            this.updateVolume(savedVolume);
        }
    }

    start() {
        this.volumeSlider.node.on("slide", this.onSliderChanged, this);
    }

    onSliderChanged(slider: cc.Slider) {
        const volume = slider.progress;
        this.updateVolume(volume);
        cc.sys.localStorage.setItem("volume", volume);
    }

    updateVolume(volume: number) {
        if (this.bgmAudio) {
            this.bgmAudio.volume = volume;
        }
        cc.audioEngine.setMusicVolume(volume);
        cc.audioEngine.setEffectsVolume(volume);
    }

    onClickBack() {
        cc.director.loadScene("MainMenu"); // change to your main menu scene
    }
}
