import Toast from "react-native-toast-message";


const showSuccess = (text1: string, text2: string) => {
  Toast.show({ type: "success", text1, text2 });
}

const showWarning = (text1: string, text2: string) => {
  Toast.show({ type: "warning", text1, text2 });
}

const showError = (text1: string, text2: string) => {
  Toast.show({ type: "error", text1, text2 });
}



// SUCCESS

export const showSuccessSendingMessage = () => {
  showSuccess(
    "Success",
    "Message sent.",
  );
}


// WARNING

export const showWarningChannelAlreadyAdded = () => {
  showWarning(
    "Warning",
    "Channel already added.",
  );
}



// ERROR

export const showErrorUserLoading = () => {
  showError(
    "Error",
    "An error occured while loading user info."
  );
}

export const showErrorChannelsLoading = (message: String) => {
  showError(
    "Error",
    "An error occured while loading channels. (" + message + ")"
  );
}

export const showErrorRefreshingAccessToken = () => {
  showError(
    "Error",
    "An error occured while refreshing access token.",
  );
}

export const showErrorValidatingAccessToken = () => {
  showError(
    "Error",
    "An error occured while validating access token.",
  );
}

export const showErrorRequestingAccessToken = () => {
  showError(
    "Error",
    "An error occured while requesting access token.",
  );
}

export const showErrorUnabletoStream = () => {
  showError(
    "Error",
    "An error occured. Unable to stream.",
  );
}

export const showErrorSendingMessage = () => {
  showError(
    "Error",
    "An error occured while sending message.",
  );
}


