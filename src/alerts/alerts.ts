import Toast from "react-native-toast-message";


const showError = (type: string, text1: string, text2: string) => {
  Toast.show({ type, text1, text2 });
}



// SUCCESS


// FIXME: 
export const showSuccessSendingMessage = () => {
  showError(
    "success",
    "Success",
    "Message sent.",
  );
}



// ERROR

export const showErrorUserLoading = () => {
  showError(
    "error",
    "Error",
    "An error occured while loading user info."
  );
}

export const showErrorChannelsLoading = () => {
  showError(
    "error",
    "Error",
    "An error occured while loading channels."
  );
}

export const showErrorRefreshingAccessToken = () => {
  showError(
    "error",
    "Error",
    "An error occured while refreshing access token.",
  );
}

export const showErrorValidatingAccessToken = () => {
  showError(
    "error",
    "Error",
    "An error occured while validating access token.",
  );
}

export const showErrorRequestingAccessToken = () => {
  showError(
    "error",
    "Error",
    "An error occured while requesting access token.",
  );
}

export const showErrorUnabletoStream = () => {
  showError(
    "error",
    "Error",
    "An error occured. Unable to stream.",
  );
}

export const showErrorSendingMessage = () => {
  showError(
    "error",
    "Error",
    "An error occured while sending message.",
  );
}


