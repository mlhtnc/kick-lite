import { useEffect, useState } from 'react';
import { ColorValue, KeyboardAvoidingView, Platform, StyleSheet, Text, TextInput, View } from 'react-native';

import BasicButton from '../components/buttons/BasicButton';
import { Colors, HomeScreenName } from '../constants';
import { LoginScreenProps } from '../types';


export default function LoginScreen({ navigation }: LoginScreenProps) {

  // const [ password, setPassword ] = useState<string>('');
  // const [ confirmPassword, setConfirmPassword ] = useState<string>('');
  // const [ passwordExist, setPasswordExist ] = useState<boolean>(true);
  // const [ passHash, setPassHash ] = useState<string>('');
  // const [ confirmPasswordInputColor, setConfirmPasswordInputColor ] = useState<ColorValue>(Colors.success);
  // const [ passwordInputBorderWidth, setPasswordInputBorderWidth ] = useState<number>(0);
  // const [ confirmPasswordInputBorderWidth, setConfirmPasswordInputBorderWidth ] = useState<number>(0);


  // useEffect(() => {
  //   initPassHash();
  // }, []);


  // const initPassHash = async () => {
  //   const storedPassHash = await loadPassHash();
  //   if(storedPassHash) {
  //     setPassHash(await loadPassHash());
  //   } else {
  //     setPasswordExist(false);
  //   }
  // }

  // const onPassInputChanged = async (changedText: string) => {
  //   setPassword(changedText);
    
  //   if(passwordExist) {
  //     return;
  //   }

  //   if(changedText.length >= 8) {
  //     setPasswordInputBorderWidth(1);
  //   } else {
  //     setPasswordInputBorderWidth(0);
  //   }

  //   if(changedText.length >= 8) {
  //     if(changedText === confirmPassword) {
  //       setConfirmPasswordInputColor(Colors.success);
  //     } else {
  //       setConfirmPasswordInputColor(Colors.error);
  //     }
  //   }
  // }

  // const onConfirmPassInputChanged = async (changedText: string) => {
  //   setConfirmPassword(changedText);

  //   if(changedText.length > 0) {
  //     setConfirmPasswordInputBorderWidth(1);
  //   } else {
  //     setConfirmPasswordInputBorderWidth(0);
  //   }

  //   if(password === changedText) {
  //     setConfirmPasswordInputColor(Colors.success);
  //   } else {
  //     setConfirmPasswordInputColor(Colors.error);
  //   }
  // }


  // const onCreateButtonClicked = async () => {
  //   if(password.length === 0) {
  //     return;
  //   }

  //   if(password === confirmPassword) {
  //     savePassHash(await sha512(password));

  //     navigation.reset({ index: 0, routes: [{ name: HomeScreenName, params: { masterPassword: password } }] });
  //   }
  // }

  // const onConfirmButtonClicked = async () => {
  //   if(password.length === 0) {
  //     return;
  //   }

  //   const textHash = await sha512(password);
  //   if(passHash && textHash === passHash) {
  //     navigation.reset({ index: 0, routes: [{ name: HomeScreenName, params: { masterPassword: password } }] });
  //   }
  // }


  return (
    <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === "ios" ? "padding" : "height"} keyboardVerticalOffset={ -100 }>
      <View style={styles.container}>

        <Text style={styles.titleText}>Kick Lite</Text>

        {/* <Text style={styles.passwordText}>Master Password</Text>
        <TextInput
          style={[styles.passInput, { borderWidth: passwordInputBorderWidth }]}
          value={password}
          onChangeText={onPassInputChanged}
          secureTextEntry={true}
        />

        { !passwordExist ? null :

          <BasicButton
            style={styles.button}
            text={"Confirm"}
            textStyle={styles.buttonText}
            onPress={onConfirmButtonClicked}
          />
        }

        { passwordExist ? null :

          <View>
            <Text style={styles.passwordText}>Confirm Password</Text>
            <TextInput
              style={[styles.passInput, { borderColor: confirmPasswordInputColor, borderWidth: confirmPasswordInputBorderWidth }]}
              value={confirmPassword}
              onChangeText={onConfirmPassInputChanged}
              secureTextEntry={true}
            />
          

            <BasicButton
              style={styles.button}
              text={"Create"}
              textStyle={styles.buttonText}
              onPress={onCreateButtonClicked}
            />
          </View>

        } */}

      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
    padding: 10,
    justifyContent: 'center'
  },
  passInput: {
    height: 40,
    alignSelf: 'stretch',
    backgroundColor: '#aaa2',
    borderRadius: 20,
    marginHorizontal: 30,
    paddingHorizontal: 10,
    color: '#fffa',
    marginBottom: 10,
    borderColor: Colors.success
  },
  titleText: {
    textAlign: 'center',
    color: Colors.textPrimary,
    marginBottom: 50,
    fontSize: 20,
    fontWeight: 'bold'
  },
  passwordText: {
    marginHorizontal: 30,
    marginBottom: 4,
    color: "#586572ff",
    fontSize: 12,
    fontWeight: 'bold'
  },
  button: {
    width: 150,
    height: 40,
    backgroundColor: '#46538dff',
    marginTop: 20,
    alignSelf: 'center'
  },
  buttonText: {
    fontSize: 16,
  }
});