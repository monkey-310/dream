"use client";

import { getUserAction } from "@/actions/user-actions";
import { useUserStore } from "@/stores/useUserStore";
import { usePathname, useRouter } from "next/navigation";
import { PropsWithChildren, useEffect } from "react";

export const AuthProvider = ({ children }: PropsWithChildren) => {
  const { setUser } = useUserStore();

  const router = useRouter();
  const pathName = usePathname();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const user = await getUserAction();

        if (user?.id) {
          setUser(user);
        }

        // If page is reloaded, redirect to the current page
        router.push(pathName);
      } catch (error) {
        console.error("Error fetching user", error);
      }
    };

    fetchUser();
  }, []);

  return <>{children}</>;
};
