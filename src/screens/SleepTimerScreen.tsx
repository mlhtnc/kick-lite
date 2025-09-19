import { useEffect, useRef, useState } from 'react';
import { StyleSheet, Text, TextInput, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import BasicButton from '../components/buttons/BasicButton';
import { Colors } from '../constants';
import { loadSleepTime, saveSleepTime } from '../utils/save_utils';
import { getRemainingTime, isTimerRunning, startTimer, stopTimer } from '../managers/timer_manager';
import { convertMillisecondsToTime } from '../helpers/helpers';
import { onSleepTimerExpired } from '../helpers/sleep_timer_helper';


export default function SleepTimerScreen() {

  const intervalRef = useRef<NodeJS.Timeout>(null);
  const sleepTimeRef = useRef<number | null>(null);

  const [ hours, setHours ] = useState<string>("00");
  const [ minutes, setMinutes ] = useState<string>("30");
  const [ remainingTime, setRemainingTime ] = useState<string>("--:--:--");


  const insets = useSafeAreaInsets();


  useEffect(() => {
    initSleepTime();

    return () => clearInterval(intervalRef.current || undefined);
  }, []);

  const initSleepTime = async () => {
    sleepTimeRef.current = await loadSleepTime();
    if(sleepTimeRef.current === null) {
      return;
    }

    if(!isTimerRunning()) { 
      return;
    }

    setRemainingTime(convertMillisecondsToTime(getRemainingTime()));
    intervalRef.current = setInterval(() => {
      setRemainingTime(convertMillisecondsToTime(getRemainingTime()));
    }, 100);
  }

  const handleHourTextChange = (text: string) => {
    if(text === "") {
      setHours(text);
      return;
    }

    if (/^[0-9]{0,2}$/.test(text) === false) {
      return;
    }

    const hour = parseInt(text);
    if(hour >= 0 && hour <= 24) {
      setHours(text);
    }
  }

  const handleMinutesTextChange = (text: string) => {
    if(text === "") {
      setMinutes(text);
      return;
    }

    if (/^[0-9]{0,2}$/.test(text) === false) {
      return;
    }

    const minute = parseInt(text);
    if(minute >= 0 && minute <= 60) {
      setMinutes(text);
    }
  }

  const onStartButtonPressed = async () => {
    const hour = parseInt(hours || "0");
    const minute = parseInt(minutes || "0");
    const milliseconds = (hour * 60 * 60 + minute * 60) * 1000;

    if(milliseconds === 0) {
      return;
    }

    stopTimer();
    startTimer(milliseconds, onSleepTimerExpired);

    setRemainingTime(convertMillisecondsToTime(getRemainingTime()));
    clearInterval(intervalRef.current || undefined);

    intervalRef.current = setInterval(() => {
      setRemainingTime(convertMillisecondsToTime(getRemainingTime()));
    }, 100);

    await saveSleepTime(milliseconds);
  }

  const onResetButtonPressed = async () => {
    clearInterval(intervalRef.current || undefined);
    stopTimer();

    setRemainingTime("--:--:--")
    
    await saveSleepTime(null);
  }


  return (
    <View style={[styles.container, { paddingTop: insets.top, paddingBottom: insets.bottom }]}>

      <Text style={styles.remainingTimeText}>{"Remaining Time\n" + remainingTime}</Text>

      <View style={styles.flexRowContainer}>
        <TextInput
          style={styles.input}
          value={hours}
          onChangeText={handleHourTextChange}
          keyboardType='number-pad'
          placeholder='00'
        />
        <Text style={styles.colonText}>:</Text>
        <TextInput
          style={styles.input}
          value={minutes}
          onChangeText={handleMinutesTextChange}
          keyboardType='number-pad'
          placeholder='00'
        />
      </View>

      <View style={styles.flexRowContainer}>
        <BasicButton
          style={styles.button}
          textStyle={styles.buttonText}
          text='Reset Timer'
          onPress={onResetButtonPressed}
        />
        <BasicButton
          style={styles.button}
          textStyle={styles.buttonText}
          text='Start Timer'
          onPress={onStartButtonPressed}
        />
      </View>

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
		backgroundColor: Colors.background,
		justifyContent: 'center',
    alignItems: 'center'
  },
  flexRowContainer: {
    flexDirection: "row",
  },
  remainingTimeText: {
    color: Colors.textSecondary,
    fontSize: 16,
    marginBottom: 20,
    textAlign: 'center'
  },
  input: {
    backgroundColor: Colors.background,
    paddingHorizontal: 10,
    padding: 0,
    fontSize: 72,
    color: Colors.textSecondary,
    borderColor: Colors.border,
  },
  colonText: {
    color: "#fff",
    fontSize: 72
  },
  button: {
    backgroundColor: Colors.buttonPrimary,
    padding: 10,
    marginTop: 20,
    marginHorizontal: 5
  },
  buttonText: {
    color: Colors.background
  }
});