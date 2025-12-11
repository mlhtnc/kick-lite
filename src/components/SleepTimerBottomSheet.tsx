import { useState } from "react";
import { StyleSheet, View, Text } from "react-native";
import { BottomSheetView } from "@gorhom/bottom-sheet";

import BasicButton from "./buttons/BasicButton";


export default function SleepTimerBottomSheet() {

  const [ currMins, setCurrMins ] = useState<number>(0);
  const [ currHours, setCurrHours ] = useState<number>(0);

  const onTimeButtonPressed = (minutes: number) => {
    if(currMins + minutes >= 60) {
      setCurrHours((prevHours: number) => prevHours + 1);
      setCurrMins((prevMins: number) => (prevMins + minutes) - 60);
    } else {
      setCurrMins((prevMins: number) => currMins + minutes);
    }
  }

  const onStartPressed = () => {
  
  }

  const onResetPressed = () => {
    setCurrMins(0);
    setCurrHours(0);
  }


  const hourText = currHours > 0 ? `${currHours} hour${currHours > 1 ? "s" : ""} ` : "";
  const minText = `${currMins} min${currMins !== 1 ? "s" : ""}`;

  return (
    <BottomSheetView style={styles.contentContainer}>
      <Text style={styles.textStyle}>{hourText} {minText}</Text>

      <View style= {[ styles.buttonContainer, { marginBottom: 20 }]}>
        <BasicButton style={styles.timeButtons} text='+10 mins' onPress={() => onTimeButtonPressed(10)} />
        <BasicButton style={styles.timeButtons} text='+30 mins' onPress={() => onTimeButtonPressed(30)} />
        <BasicButton style={styles.timeButtons} text='+1 hours' onPress={() => onTimeButtonPressed(60)} />
      </View>
      <View style= {styles.buttonContainer}>
        <BasicButton style={styles.timeButtons} text='Reset' onPress={onResetPressed} />
        <BasicButton style={styles.timeButtons} text='Start' onPress={onStartPressed} />
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
    fontSize: 16,
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
