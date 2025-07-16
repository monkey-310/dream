"use client";

export const BrowserSessionStore = {
  get: (key: string) => {
    try {
      return JSON.parse(window.sessionStorage.getItem(key) ?? "") ?? undefined;
    } catch (e) {
      //return window.sessionStorage.getItem(key) ?? undefined;
    }
  },
  set: (key: string, value: any) => {
    switch (typeof value) {
      case "undefined": {
        console.warn("Tried to store undefined value");
        return;
      }
      case "boolean":
      case "number":
      case "string":
      case "bigint":
        window.sessionStorage.setItem(key, value.toString());
        return;

      default: {
        try {
          const stringifiedValue = JSON.stringify(value);
          window?.sessionStorage.setItem(key, stringifiedValue);
        } catch (e) {
          console.warn(e);
          window?.sessionStorage.setItem(key, value.toString());
        }
      }
    }
  },
  remove: (key: string) => window.sessionStorage.removeItem(key),
  clear: () => window.sessionStorage.clear(),
};
