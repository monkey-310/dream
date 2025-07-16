import { BrowserSessionStore } from "./BrowserSessionStore";
import { create } from "zustand";
import { SessionKeys } from "../constants/SessionKeys";
import { Constants } from "@/constants/Constants";
import { useEffect } from "react";

type TimeStoreState = {
  timer: number;
  timerIsRunning: boolean;
  isInitialized: boolean;
};

type TimeStoreAction = {
  updateTimer: (arg: number) => void;
  resetTimerStore: () => void;
  setTimer: (arg: number) => void;
  startTimer: () => void;
  stopTimer: () => void;
  initializeFromStorage: () => void;
};

type TimeStore = TimeStoreState & TimeStoreAction;

// Create the store with default values first (for SSR)
export const useTimerStore = create<TimeStore>((set) => ({
  // Start with default values for SSR
  timerIsRunning: false,
  timer: Constants.MOCK_DEFAULT_TIME_IN_MS,
  isInitialized: false,

  // Initialize from storage (only called client-side)
  initializeFromStorage: () => {
    const storedTimer = BrowserSessionStore.get(SessionKeys.TIME_REMAINING);
    const storedTimerRunning = BrowserSessionStore.get(
      SessionKeys.TIMER_RUNNING
    );

    set({
      timer: storedTimer ?? Constants.MOCK_DEFAULT_TIME_IN_MS,
      timerIsRunning: storedTimerRunning ?? false,
      isInitialized: true,
    });
  },

  startTimer: () => {
    BrowserSessionStore.set(SessionKeys.TIMER_RUNNING, true);
    set({ timerIsRunning: true });
  },

  stopTimer: () => {
    BrowserSessionStore.set(SessionKeys.TIMER_RUNNING, false);
    set({ timerIsRunning: false });
  },

  updateTimer: (time: number) => {
    BrowserSessionStore.set(SessionKeys.TIME_REMAINING, time);
    set({ timer: time });
  },

  setTimer: (initialTime: number) => set({ timer: initialTime }),

  resetTimerStore: () => {
    BrowserSessionStore.remove(SessionKeys.TIME_REMAINING);
    BrowserSessionStore.remove(SessionKeys.TIMER_RUNNING);
    set({ timer: Constants.MOCK_DEFAULT_TIME_IN_MS, timerIsRunning: false });
  },
}));

// Custom hook to safely use the timer store with client-side initialization
export function useTimerStoreWithInitialization() {
  const store = useTimerStore();

  useEffect(() => {
    if (!store.isInitialized) {
      store.initializeFromStorage();
    }
  }, [store.isInitialized]);

  return store;
}
