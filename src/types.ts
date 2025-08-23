import type { NativeStackNavigationProp, NativeStackScreenProps } from "@react-navigation/native-stack";
import { TextStyle } from "react-native";


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
}

export enum Screens {
	Login = "LoginScreen",
	Home = "HomeScreen",
	Stream = "StreamScreen",
}

export type RootStackParamList = {
  [Screens.Login]: undefined;
  [Screens.Home]: { tokens: Tokens; };
  [Screens.Stream]: { channel: Channel };
};

export type HomeScreenProps = NativeStackScreenProps<RootStackParamList, Screens.Home>;
export type LoginScreenProps = NativeStackScreenProps<RootStackParamList, Screens.Login>;
export type StreamScreenProps = NativeStackScreenProps<RootStackParamList, Screens.Stream>;
type AnyNavigationProp = NativeStackNavigationProp<RootStackParamList>;


export interface ScreenHeaderProps {
  title: string;
  onTitleChanged?: (title: string) => void;
  editTitle?: boolean;
  titleTextStyle?: TextStyle;
  hideEditButton?: boolean;
}

export interface ChannelListProps {
	channels: Channel[];
  navigation: AnyNavigationProp;
}

export interface ChannelCardProps {
  channel: Channel;
  navigation: AnyNavigationProp;
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
