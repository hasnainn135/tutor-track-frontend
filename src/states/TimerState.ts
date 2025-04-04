import { create } from "zustand";

type TimerState = {
  time: string;
  isRunning: boolean;
  isPaused: boolean;
  intervalId: NodeJS.Timeout | null;
  initTime: number;
  elapsedBeforePause: number;
  sessionId: string | null;
  setTime: (time: string) => void;
  startTimer: () => void;
  stopTimer: () => void;
  resetTimer: () => void;
  pauseTimer: () => void;
  resumeTimer: () => void;
  showTimer: (ms: number) => void;
  syncTimer: (actualStartTime: string) => void;
  setSessionId: (id: string) => void;
  startTimerFromElapsed: (seconds: number) => void;
  startSessionInFirestore: (sessionId: string) => void;
  endSessionInFirestore: (sessionId: string) => void;
};

function convertToMilliseconds(timeString: string) {
  const [hours, minutes, seconds] = timeString.split(":").map(Number);
  return hours * 3600000 + minutes * 60000 + seconds * 1000;
}

const useTimerState = create<TimerState>((set, get) => ({
  time: "00 : 00 : 00",
  isRunning: false,
  isPaused: false,
  intervalId: null,
  initTime: 0,
  elapsedBeforePause: 0,
  sessionId: null,

  setTime: (time) => set(() => ({ time })),

  setSessionId: (id) => set({ sessionId: id }),

  startTimerFromElapsed: (seconds) =>
    set({ isRunning: true, elapsedBeforePause: seconds }),

  startTimer: () => {
    const now = Date.now();
    const elapsed = get().elapsedBeforePause;

    set(() => ({
      isRunning: true,
      isPaused: false,
      initTime: now - elapsed, // resume from paused time
    }));

    const id = setInterval(() => {
      const elapsedTime = Date.now() - get().initTime;
      get().showTimer(elapsedTime);
    }, 1000);

    set({ intervalId: id });
  },

  stopTimer: () => {
    const id = get().intervalId;
    if (id) {
      clearInterval(id);
    }
    set({
      isRunning: false,
      isPaused: false,
      intervalId: null,
      elapsedBeforePause: 0,
    });
  },

  resetTimer: () => {
    const id = get().intervalId;
    if (id) {
      clearInterval(id);
    }
    set({
      time: "00 : 00 : 00",
      isRunning: false,
      isPaused: false,
      intervalId: null,
      initTime: 0,
      elapsedBeforePause: 0,
    });
  },

  pauseTimer: () => {
    const id = get().intervalId;
    if (id) {
      clearInterval(id);
    }
    const elapsed = Date.now() - get().initTime;
    set({
      isPaused: true,
      isRunning: true, // still considered running session
      intervalId: null,
      elapsedBeforePause: elapsed,
    });
  },

  resumeTimer: () => {
    const now = Date.now();
    const elapsed = get().elapsedBeforePause;

    set(() => ({
      isPaused: false,
      isRunning: true,
      initTime: now - elapsed, // resume from paused time
    }));

    const id = setInterval(() => {
      const elapsedTime = Date.now() - get().initTime;
      get().showTimer(elapsedTime);
    }, 1000);

    set({ intervalId: id });
  },

  showTimer: (ms: number) => {
    const second = Math.floor((ms / 1000) % 60)
      .toString()
      .padStart(2, "0");
    const minute = Math.floor((ms / 1000 / 60) % 60)
      .toString()
      .padStart(2, "0");
    const hour = Math.floor(ms / 1000 / 60 / 60)
      .toString()
      .padStart(2, "0");

    set(() => ({ time: `${hour} : ${minute} : ${second}` }));
  },

  // Sync the timer if the user joins late
  syncTimer: (actualStartTime) => {
    const startTime = new Date(actualStartTime).getTime();
    const now = Date.now();
    const elapsedTime = Math.floor((now - startTime) / 1000); // Calculate elapsed time in seconds

    set(() => ({
      initTime: now - elapsedTime * 1000, // Sync initTime with elapsed time
      elapsedBeforePause: elapsedTime * 1000, // Track elapsed time
      isRunning: true,
      isPaused: false,
    }));

    const id = setInterval(() => {
      const elapsedTimeNow = Date.now() - get().initTime;
      get().showTimer(elapsedTimeNow);
    }, 1000);

    set({ intervalId: id });
  },

  startSessionInFirestore: async (sessionId: string) => {
    // Implement Firestore session start logic
    console.log("Starting session in Firestore with session ID: ", sessionId);
  },

  endSessionInFirestore: async (sessionId: string) => {
    // Implement Firestore session end logic
    console.log("Ending session in Firestore with session ID: ", sessionId);
  },
}));

export default useTimerState;
