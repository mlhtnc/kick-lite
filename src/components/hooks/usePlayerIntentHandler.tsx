import { useEffect } from "react";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";

import { usePlayerIntent } from "../../stores/playerIntentStore";
import { RootStackParamList, Screens } from "../../types";
import { useCurrentStreamStore } from "../../stores/currentStreamStore";
import { usePlayerStore } from "../../stores/playerStore";
import { useBackgroundServiceInfo } from "../../stores/backgroundServiceStore";
import ForegroundService from "../../modules/ForegroundService";

export default function usePlayerIntentHandler() {

  const rootNavigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  const intent = usePlayerIntent(s => s.intent);
  const clearIntent = usePlayerIntent(s => s.clearIntent);

  const setSource = usePlayerStore(s => s.setSource);
  const setMode = usePlayerStore(s => s.setMode);
  const setStartTime = usePlayerStore(s => s.setStartTime);

  const currentChannel = useCurrentStreamStore(s => s.currentChannel);
  const setStreamUrls = useCurrentStreamStore(s => s.setStreamUrls);

  useEffect(() => {
    if (intent === "REQUEST_OPEN_STREAM" && currentChannel) {
      rootNavigation.navigate(Screens.Stream, { channel: currentChannel });
      clearIntent();
    } else if(intent === "REQUEST_CLOSE_STREAM") {
      setSource("");
      setMode("hidden");
      setStreamUrls(undefined);
      setStartTime("");
      clearIntent();

      const { isRunning, setIsRunning, setEndTime } = useBackgroundServiceInfo.getState();
      if(isRunning) {
        ForegroundService.stop();
        setIsRunning(false);
        setEndTime(-1);
      }
    }
  }, [intent]);
}
