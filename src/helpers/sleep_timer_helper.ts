import ForegroundService from "../modules/ForegroundService";
import { saveSleepTime } from "../utils/save_utils";


export const onSleepTimerExpired = async () => {
  await saveSleepTime(null);
  ForegroundService.exitApp();
}