import { useEffect, useState } from "react";
import { Dimensions } from "react-native";

import { usePlayerStore } from "../../stores/playerStore";

export default function useVideoSize() {

  const [ screenSize, setScreenSize ] = useState<{ width: number; height: number }>(Dimensions.get('screen'));
  const isFullscreen = usePlayerStore(s => s.isFullscreen);

  useEffect(() => {
    const dimensionSubscription = Dimensions.addEventListener('change', ({ screen }) => setScreenSize(screen));
    return () => dimensionSubscription?.remove();
  }, []);

  const videoWidth = screenSize.width;
  const videoHeight = isFullscreen() ? screenSize.height : (videoWidth * 9) / 16;

  return [ videoWidth, videoHeight ];

}