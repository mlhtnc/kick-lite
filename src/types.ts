import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import { HomeScreenName, LoginScreenName } from "./constants";
import { TextStyle } from "react-native";


export interface ColorsType {
  background: string;
  textPrimary: string;
  textSecondary: string;
  buttonPrimary: string;
  success: string;
  error: string;
  border: string;
}

export type RootStackParamList = {
  [LoginScreenName]: undefined;
  [HomeScreenName]: { tokens: Tokens; }
};

export type HomeScreenProps = NativeStackScreenProps<
  RootStackParamList,
  typeof HomeScreenName
>;


export type LoginScreenProps = NativeStackScreenProps<
  RootStackParamList,
  typeof LoginScreenName
>;

export interface ScreenHeaderProps {
  title: string;
  onTitleChanged?: (title: string) => void;
  editTitle?: boolean;
  titleTextStyle?: TextStyle;
  hideEditButton?: boolean;
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
