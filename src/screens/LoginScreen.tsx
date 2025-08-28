import { useEffect, useState } from 'react';
import { ActivityIndicator, KeyboardAvoidingView, Platform, StyleSheet, Text, TextInput, View } from 'react-native';
import WebView, { WebViewNavigation } from 'react-native-webview';

import BasicButton from '../components/buttons/BasicButton';
import { Colors, KickRedirectUri, KickScopeString } from '../constants';
import { LoginScreenProps, PKCE, Screens } from '../types';
import { loadClient, loadTokens, saveClient, saveTokens } from '../utils/save_utils';
import { createAuthUrl, generatePKCE } from '../utils/auth_utils';
import { getToken, isAccessTokenValid, refreshAccessToken } from '../services/kick_service';
import { showErrorRefreshingAccessToken, showErrorRequestingAccessToken, showErrorValidatingAccessToken } from '../alerts/alerts';
import { SafeAreaView } from 'react-native-safe-area-context';


export default function LoginScreen({ navigation }: LoginScreenProps) {

  const [ clientId, setClientId ] = useState<string>('');
  const [ clientSecret, setClientSecret ] = useState<string>('');
  const [ authUrl, setAuthUrl ] = useState<string | null>(null);
  const [ pkce, setPkce ] = useState<PKCE>();
  const [ loading, setLoading ] = useState<boolean>(true);
  

  useEffect(() => {
    auth();
  }, []);


  const auth = async () => {
    const tokens = await loadTokens();
    const client = await loadClient();

    if(!tokens) {
      if(client) {
        await requestTokens(client.clientId);
      } else {
        // Show login screen
        setLoading(false);
      }

      return;
    }

    isAccessTokenValid(tokens.accessToken).then(async (isValid) => {
      if(isValid) {
        navigation.reset({ index: 0, routes: [{ name: Screens.Home, params: { tokens: tokens }}]});
        return;
      }

      refreshAccessToken(
        client.clientId,
        client.clientSecret,
        tokens.refreshToken
      ).then(async (tokenResponse) => handleTokenResponse(tokenResponse)
      ).catch(() => {
        showErrorRefreshingAccessToken();
      });

    }).catch(() => {
      showErrorValidatingAccessToken();
    });
  }

  const onLoginButtonClicked = async () => {
    // FIXME: Validate client info properly
    if (clientId === "" || clientSecret === "") {
      return;
    }

    await saveClient({ clientId, clientSecret });
    await requestTokens(clientId);
  }

  const requestTokens = async (clientId: string) => {
    const pkce = await generatePKCE() as PKCE;
    setPkce(pkce);

    const authUrl = createAuthUrl(
      clientId,
      KickRedirectUri,
      KickScopeString,
      pkce.code_challenge
    );

    setAuthUrl(authUrl);
  }

  const handleTokenResponse = async (tokenResponse: any) => {
    const tokens = { accessToken: tokenResponse.access_token, refreshToken: tokenResponse.refresh_token };
        
    await saveTokens(tokens);
    navigation.reset({ index: 0, routes: [{ name: Screens.Home, params: { tokens: tokens }}]});
  }

  const handleNavigationChange = async (navState: WebViewNavigation) => {
    const url = navState.url;
  
    if(url.includes(KickRedirectUri)) {
      const codeParam = url.split('code=')[1];
      const code = codeParam ? codeParam.split('&')[0] : null;

      const { clientId, clientSecret } = await loadClient();

      getToken(
        clientId,
        clientSecret,
        code as string,
        KickRedirectUri,
        pkce?.code_verifier || '',
      ).then(async (tokenResponse) => {
        await handleTokenResponse(tokenResponse);
      }).catch(() => {
        showErrorRequestingAccessToken();
      });

      setAuthUrl(null);
    }
  }


  if (!authUrl) {
    return (
      <SafeAreaView style={styles.safeAreaContainer}>
        <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === "ios" ? "padding" : "height"} >
          <View style={styles.container}>

          { loading ? null :
            <View style={styles.content} >
              <Text style={styles.titleText}>Client Id</Text>
              <TextInput
                style={styles.input}
                value={clientId}
                onChangeText={setClientId}
              />

              <Text style={styles.titleText}>Client Secret</Text>
              <TextInput
                style={styles.input}
                value={clientSecret}
                onChangeText={setClientSecret}
              />
            
              <BasicButton
                style={styles.button}
                text={"LOGIN"}
                textStyle={styles.buttonText}
                onPress={onLoginButtonClicked}
              />
            </View>
          }

          </View>
        </KeyboardAvoidingView>
      </SafeAreaView>
    );
  } else {
    return (
      <SafeAreaView style={styles.safeAreaContainer}>
        <WebView
          source={{ uri: authUrl }}
          onNavigationStateChange={handleNavigationChange}
          startInLoadingState={true}
          renderLoading={() => <ActivityIndicator size="large" />}
        />
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  safeAreaContainer: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  container: {
    flex: 1,
    backgroundColor: Colors.background,
    padding: 10,
    justifyContent: 'center'
  },
  content: {
    flex: 1,
    backgroundColor: Colors.background,
    justifyContent: 'center'
  },
  input: {
    height: 40,
    alignSelf: 'stretch',
    backgroundColor: '#aaa2',
    borderRadius: 20,
    marginHorizontal: 30,
    paddingHorizontal: 10,
    color: '#fffa',
    marginBottom: 10,
  },
  titleText: {
    marginHorizontal: 30,
    marginBottom: 4,
    color: "#586572ff",
    fontSize: 12,
    fontWeight: 'bold'
  },
  button: {
    width: 150,
    height: 40,
    marginTop: 20,
    alignSelf: 'center'
  },
  buttonText: {
    fontSize: 16,
  }
});