import { create } from "zustand";

type ApplicationStoreState = {
  captchaToken: string;
};

type ApplicationStoreActions = {
  setCaptchaToken: (token: string) => void;
};

type ApplicationStore = ApplicationStoreState & ApplicationStoreActions;

export const useApplicationStore = create<ApplicationStore>((set, get) => {
  return {
    captchaToken: "",
    setCaptchaToken: (token: string) => {
      set(() => ({
        captchaToken: token,
      }));
    },
  };
});
