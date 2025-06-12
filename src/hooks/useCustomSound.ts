import useSound from "use-sound";
import AudioSprite from "../assets/audio-sprite.mp3";

const useCustomSound = () => {
  const [basePlay] = useSound(AudioSprite, {
    sprite: {
      click: [0, 114],
      hover: [304, 129],
      swipe: [549, 155],
    },
  });
  const play = (args: any) => {
    try {
      const uiSoundEnabled = localStorage.getItem("tabn-ui-sound");
      if (uiSoundEnabled !== "false") {
        return basePlay(args);
      }
    } catch (error) {
      console.warn("Failed to read ui-sound from localStorage:", error);
    }
  };
  return [play];
};

export default useCustomSound;
