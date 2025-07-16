"use client";

import { useApplicationStore } from "@/stores/useApplicationStore";
import { Turnstile } from "@marsidev/react-turnstile";
import { useRouter } from "next/navigation";
import WelcomeScreen from "../diagnostic/welcome-screen";

export const CaptchaPage = () => {
  const { captchaToken, setCaptchaToken } = useApplicationStore();
  const router = useRouter();

  if (!captchaToken) {
    return (
      <div
        style={{
          minHeight: "100svh",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Turnstile
          siteKey={process.env.NEXT_PUBLIC_SITE_KEY!}
          onSuccess={(token: string) => {
            setCaptchaToken(token);
          }}
          onError={() => router.push("/error")}
          options={{
            theme: "light",
          }}
          scriptOptions={{
            appendTo: "body",
          }}
        />
      </div>
    );
  }

  return <WelcomeScreen />;
};
