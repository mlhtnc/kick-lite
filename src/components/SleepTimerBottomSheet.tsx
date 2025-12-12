import { useEffect, useRef, useState } from "react";
import { StyleSheet, View, Text } from "react-native";
import { BottomSheetView } from "@gorhom/bottom-sheet";

import BasicButton from "./buttons/BasicButton";
import { useBackgroundServiceInfo } from "../stores/backgroundServiceStore";
import ForegroundService from "../modules/ForegroundService";
import { convertMillisecondsToTime } from "../helpers/helpers";


export default function SleepTimerBottomSheet({ isOpen }: { isOpen: boolean }) {

  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const [ currMins, setCurrMins ] = useState<number>(0);
  const [ currHours, setCurrHours ] = useState<number>(0);
  const [ remainingTime, setRemainingTime ] = useState<number>(0);

  const endTimeMs = useBackgroundServiceInfo(state => state.endTimeMs);
  const setEndTime = useBackgroundServiceInfo(state => state.setEndTime);
  

  useEffect(() => {
    if(endTimeMs < 0)
      return;

    if(isOpen) {
      intervalRef.current = setInterval(() => {
        setRemainingTime(endTimeMs - Date.now());
      }, 100);
    } 

    return () => {
      if(intervalRef.current) {

        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }

    }
  }, [isOpen]);

  const onTimeButtonPressed = (minutes: number) => {
    if(currMins + minutes >= 60) {
      setCurrHours((prevHours: number) => prevHours + 1);
      setCurrMins((prevMins: number) => (prevMins + minutes) - 60);
    } else {
      setCurrMins((prevMins: number) => prevMins + minutes);
    }
  }

  const onStartPressed = () => {
    const totalMs = (currHours * 60 * 60 * 1000) + (currMins * 60 * 1000);
    if(totalMs <= 0 || endTimeMs >= 0) {
      return;
    }

    const endTime = Date.now() + totalMs;
    setEndTime(endTime);
    setRemainingTime(totalMs);
    ForegroundService.updateTimer(totalMs);

    intervalRef.current = setInterval(() => {
      setRemainingTime(endTime - Date.now());
    }, 100);
  }

  const onResetPressed = () => {
    setCurrMins(0);
    setCurrHours(0);
    setEndTime(-1);
    setRemainingTime(0);
    ForegroundService.stopTimer();

    if(intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }

  const hourText = currHours > 0 ? `${currHours} hour${currHours > 1 ? "s" : ""} ` : "";
  const minText = `${currMins} min${currMins !== 1 ? "s" : ""}`;

  let text = "";
  if(isOpen === false) {
    text = "";
  } else if(endTimeMs > 0) {
    text = convertMillisecondsToTime(remainingTime);
  } else {
    text = `${hourText} ${minText}`;
  }

  return (
    <BottomSheetView style={styles.contentContainer}>
      <Text style={styles.textStyle}>{text}</Text>

      <View style= {[ styles.buttonContainer, { marginBottom: 20 }]}>
        <BasicButton style={styles.timeButtons} text='+10 mins' onPress={() => onTimeButtonPressed(10)} />
        <BasicButton style={styles.timeButtons} text='+30 mins' onPress={() => onTimeButtonPressed(30)} />
        <BasicButton style={styles.timeButtons} text='+1 hours' onPress={() => onTimeButtonPressed(60)} />
      </View>
      <View style= {styles.buttonContainer}>
        <BasicButton style={[styles.timeButtons, { backgroundColor: "#bb3333ff" }]} text='Reset' onPress={onResetPressed} />
        <BasicButton style={[styles.timeButtons, { backgroundColor: "#1e71beff" }]} text='Start' onPress={onStartPressed} />
      </View>

    </BottomSheetView>
  );
};

const styles = StyleSheet.create({
  contentContainer: {
    flex: 1,
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  textStyle: {
    color: '#999',
    fontSize: 18,
    marginBottom: 30
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    width: '100%',
    alignItems: 'flex-start',
  },
  timeButtons: {
    padding: 10,
    borderRadius: 8,
    marginHorizontal: 5
  }
});
