let timer: NodeJS.Timeout | null = null;
let endTime = 0;
let onExpire: (() => void) | null = null;


export const startTimer = (durationMs: number, callback: () => void) => {
  stopTimer();
  endTime = Date.now() + durationMs;
  onExpire = callback;

  timer = setInterval(() => {
    if (Date.now() >= endTime) {
      stopTimer();
      callback();
    }
  }, 1000);
}

export const stopTimer = () => {
  if (timer) {
    clearInterval(timer);
    timer = null;
  }
  onExpire = null;

  return Date.now() - endTime;
}

export const getRemainingTime = () => {
  return Math.max(0, endTime - Date.now());
}

export const isTimerRunning = () => {
  return timer === null ? false : true;
}
