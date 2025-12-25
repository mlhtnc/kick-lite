import { useEffect, useRef, useState } from 'react';
import { ActivityIndicator, KeyboardAvoidingView, StyleSheet, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import WebView from 'react-native-webview';
import { ShouldStartLoadRequest } from 'react-native-webview/lib/WebViewTypes';

import BasicButton from '../components/buttons/BasicButton';
import { Colors, KickRedirectUri, KickScopeString } from '../constants';
import { LoginScreenProps, PKCE, Screens } from '../types';
import { loadClient, loadTokens, saveClient, saveTokens } from '../utils/save_utils';
import { createAuthUrl, generatePKCE } from '../utils/auth_utils';
import { getToken, isAccessTokenValid, refreshAccessToken } from '../services/kick_service';
import { showErrorRefreshingAccessToken, showErrorRequestingAccessToken, showErrorValidatingAccessToken } from '../alerts/alerts';
import { GlobalKAVBehaviour } from '../helpers/helpers';
import { useTokens } from '../stores/tokensStore';


export default function LoginScreen({ navigation }: LoginScreenProps) {

  const isTokenHandledRef = useRef<boolean>(false);

  const [ clientId, setClientId ] = useState<string>('');
  const [ clientSecret, setClientSecret ] = useState<string>('');
  const [ authUrl, setAuthUrl ] = useState<string | null>(null);
  const [ pkce, setPkce ] = useState<PKCE>();
  const [ loading, setLoading ] = useState<boolean>(true);

  const { setTokens, setExpiresAt } = useTokens();


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

    isAccessTokenValid(tokens.accessToken).then(async ({isValid, expiresAt}) => {
      if(isValid) {
        setTokens(tokens);
        setExpiresAt(expiresAt * 1000);
        navigation.reset({ index: 0, routes: [{ name: Screens.MainTabs }]});
        return;
      }

      refreshAccessToken(
        client.clientId,
        client.clientSecret,
        tokens.refreshToken
      ).then(async (tokenResponse) => handleTokenResponse(tokenResponse)
      ).catch(() => {
        showErrorRefreshingAccessToken();
        setLoading(false);
        return;
      });

    }).catch(() => {
      showErrorValidatingAccessToken();
      setLoading(false);
      return;
    });
  }

  const onLoginButtonClicked = async () => {
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
    const expireAt = Date.now() + tokenResponse.expires_in * 1000;

    setTokens(tokens);
    setExpiresAt(expireAt);
    await saveTokens(tokens);
    navigation.reset({ index: 0, routes: [{ name: Screens.MainTabs }]});
  }

  const handleRequest = (request: ShouldStartLoadRequest) => {
    const url = request.url;

    if(url.includes(KickRedirectUri)) {
      parseTokens(url);
      return false;
    }

    return true;
  }

  const parseTokens = async (url: string) => {
    if(isTokenHandledRef.current) {
      return false;
    }

    isTokenHandledRef.current = true;

    const codeParam = url.split('code=')[1];
    const code = codeParam ? codeParam.split('&')[0] : null;

    const { clientId, clientSecret } = await loadClient();

    try {

      const tokenResponse = await getToken(
        clientId,
        clientSecret,
        code as string,
        KickRedirectUri,
        pkce?.code_verifier || '',
      );

      await handleTokenResponse(tokenResponse);

    } catch(err) {
      showErrorRequestingAccessToken();
    } finally {
      setAuthUrl(null);
    }
  }


  if (!authUrl) {
    return (
      <SafeAreaView style={styles.safeAreaContainer}>
        <KeyboardAvoidingView style={styles.kav} behavior={GlobalKAVBehaviour} >
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
          onShouldStartLoadWithRequest={handleRequest}
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
  kav: {
    flex: 1
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