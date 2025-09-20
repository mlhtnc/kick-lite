import { BottomTabScreenProps } from "@react-navigation/bottom-tabs";
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
  MainTabs = "MainTabs",
  MainStack = "MainStack",
	Login = "LoginScreen",
	Home = "HomeScreen",
	Stream = "StreamScreen",
  Search = "SearchScreen",
  SleepTimer = "SleepTimerScreen"
}

export type RootStackParamList = {
  [Screens.MainTabs]: undefined;
  [Screens.Stream]: { channel: Channel };
};

export type StreamScreenProps = NativeStackScreenProps<RootStackParamList, Screens.Stream>;


export type MainStackParamList = {
  [Screens.Login]: undefined;
  [Screens.Home]: undefined;
};

export type LoginScreenProps = NativeStackScreenProps<MainStackParamList, Screens.Login>;
// Example for future usage
// type AnyNavigationProp = HomeScreenProps | LoginScreenProps; 


export type RootTabParamList = {
  [Screens.MainStack]: undefined;
  [Screens.Search]: undefined;
  [Screens.SleepTimer]: undefined;
};

export type SearchScreenProps = BottomTabScreenProps<RootTabParamList, Screens.Search>;


export interface ScreenHeaderProps {
  title: string;
  titleTextStyle?: TextStyle;
}

export interface ChannelListProps {
	channels: Channel[];
  loading: boolean;
  onRefresh: () => void;
}

export interface ChannelCardProps {
  channel: Channel;
}

export interface PlayerProps {
  streamURLs: StreamURL[] | undefined;
  startTime: string;
  selectedQuality: StreamURL | undefined;
  isFullscreen: boolean;
  isStreamReady: boolean;
  setIsFullscreen: (fullscreen: boolean) => void;
  setSelectedQuality: Dispatch<SetStateAction<StreamURL | undefined>>;
}

export interface OverlayProps {
  actions: OverlayActions;
  streamURLs: StreamURL[] | undefined;
  startTime: string;
  isStreamReady: boolean;
  isLoading: boolean;
  paused: boolean;
  isFullscreen: boolean;
}

export interface OverlayActions {
  play: () => void;
  pause: () => void;
  enterFullscreen: () => void;
  exitFullscreen: () => void;
  onQualityChanged: (quality: StreamURL) => void;
}

export interface StreamInfoProps {
  channel: Channel;
}

export interface ChatInputProps {
  channel: Channel;
}

export interface BasicCircleButtonProps {
  style?: ViewStyle;
  onPress?: (event: GestureResponderEvent) => void;
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
  startTime: string;
  thumbnail: string;
}

export interface User {
  id: string;
  name: string;
}

export interface StreamURL {
  url: string;
  height: number;
}