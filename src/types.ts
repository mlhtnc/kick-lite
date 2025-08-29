import type { NativeStackNavigationProp, NativeStackScreenProps } from "@react-navigation/native-stack";
import { Dispatch, SetStateAction } from "react";
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
  [Screens.Stream]: { tokens: Tokens; channel: Channel };
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
  tokens: Tokens;
  navigation: AnyNavigationProp;
  loading: boolean;
  onRefresh: () => void;
  onChannelDelete: (channel: Channel) => void;
}

export interface ChannelCardProps {
  channel: Channel;
  tokens: Tokens;
  navigation: AnyNavigationProp;
  onChannelDelete: (channel: Channel) => void;
}

export interface StreamPlayerProps {
  streamURL: string;
  paused: boolean;
  setLoadingVideo: (isLoading: boolean) => void;
}

export interface StreamOverlayProps {
  isStreamReady: boolean;
  isLoading: boolean;
  paused: boolean;
  isFullscreen: boolean;
  setPaused: (paused: boolean) => void;
  setIsFullscreen: Dispatch<SetStateAction<boolean>>;
}

export interface ChannelInfoProps {
  channel: Channel;
  tokens: Tokens;
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

export interface StreamOverlayHandles {
  toggleFullscreen: () => void;
}
