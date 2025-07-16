import { create } from "zustand";

type UserStoreState = {
  userId: string;
  email: string;
  profileUrl?: string;
  displayName?: string;
  userRole?: string;
};

type UserStoreActions = {
  setUserId: (arg: string) => void;
  setEmail: (arg: string) => void;
  setUser: (user: any | null) => void;
  clearStore: () => void;
};

type UserStore = UserStoreState & UserStoreActions;

export const useUserStore = create<UserStore>((set) => ({
  userId: "",
  email: "",
  userRole: "",
  setUser: (user) => {
    if (!user) return;

    const displayName = `${user?.user_metadata?.first_name} ${user?.user_metadata?.last_name}`;

    set(() => ({
      userId: user.id,
      email: user.email,
      profileUrl: user?.user_metadata?.avatar_url ?? "",
      displayName: displayName ?? "",
      userRole: user?.userRole,
    }));
  },
  setUserId: (id: string) =>
    set((state) => ({
      ...state,
      userId: id,
    })),
  setEmail: (email: string) =>
    set((state) => ({
      ...state,
      email,
    })),
  clearStore: () => set({ userId: "", email: "" }),
}));
