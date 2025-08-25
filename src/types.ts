import type { NativeStackNavigationProp, NativeStackScreenProps } from "@react-navigation/native-stack";
import { ColorValue, GestureResponderEvent, TextStyle, ViewStyle } from "react-native";


export interface ColorsType {
  background: string;
  textPrimary: string;
  textSecondary: string;
  textAccent: string;
  buttonPrimary: string;
  card: string;
  success: string;
  error: string;
  border: string;
  toastText: string;
}

export enum Screens {
	Login = "LoginScreen",
	Home = "HomeScreen",
	Stream = "StreamScreen",
  Search = "SearchScreen",
}

export type RootStackParamList = {
  [Screens.Login]: undefined;
  [Screens.Home]: { tokens: Tokens; };
  [Screens.Stream]: { channel: Channel };
  [Screens.Search]: { tokens: Tokens; onChannelAdded: () => void };
};

export type HomeScreenProps = NativeStackScreenProps<RootStackParamList, Screens.Home>;
export type LoginScreenProps = NativeStackScreenProps<RootStackParamList, Screens.Login>;
export type StreamScreenProps = NativeStackScreenProps<RootStackParamList, Screens.Stream>;
export type SearchScreenProps = NativeStackScreenProps<RootStackParamList, Screens.Search>;
type AnyNavigationProp = NativeStackNavigationProp<RootStackParamList>;


export interface ScreenHeaderProps {
  title: string;
  titleTextStyle?: TextStyle;
  onSearchButtonPressed?: () => void;
}

export interface ChannelListProps {
	channels: Channel[];
  navigation: AnyNavigationProp;
}

export interface ChannelCardProps {
  channel: Channel;
  navigation: AnyNavigationProp;
}

export interface BasicCircleButtonProps {
  style?: ViewStyle;
  onPress: (event: GestureResponderEvent) => void;
  disabled?: boolean;
  iconName: string;
  iconSize: number;
  iconColor?: ColorValue;
}

export interface ClientInfo {
  clientId: string;
  clientSecret: string;
}

export interface Tokens {
  accessToken: string;
  refreshToken: string;
}

export interface PKCE {
  code_verifier: string;
  code_challenge: string;
}

export interface Channel {
  id: string;
  name: string;
  slug: string;
  isLive: boolean;
  viewerCount: number;
  streamTitle: string;
}

export interface User {
  id: string;
  name: string;
}
