import { Routes } from "@/routes/Routes";
import { updateSession } from "@/supabase/middleware";
import { createSupabaseServerClient } from "@/supabase/server";
import { NextResponse, type NextRequest } from "next/server";
import { Roles } from "@/constants/Roles";

// Replace jsonwebtoken with a function that works in Edge runtime
export function decodeJWT(token: string) {
  // Split the token into header, payload, and signature
  const [_header, payload, _signature] = token.split(".");

  // Decode the payload
  const decodedPayload = JSON.parse(
    Buffer.from(payload, "base64").toString("utf-8")
  );

  return decodedPayload;
}

export async function middleware(request: NextRequest) {
  const SupabaseServer = await createSupabaseServerClient();

  const { data, error } = await SupabaseServer.auth.getSession();

  if (!data?.session || error) {
    if (request.nextUrl.pathname.startsWith("/t")) {
      const url = request.nextUrl.clone();
      url.pathname = Routes.Login;
      return NextResponse.redirect(url);
    }
  }

  if (data?.session) {
    try {
      // Use the decode function instead of jwt.verify
      const decodedToken = decodeJWT(data.session?.access_token);
      const userRole = decodedToken.user_role;

      if (
        userRole !== Roles.TUTOR &&
        request.nextUrl.pathname.startsWith("/t")
      ) {
        const url = request.nextUrl.clone();
        url.pathname = Routes.Login;
        return NextResponse.redirect(url);
      }
    } catch (e) {
      console.error("Failed to decode JWT token:", e);
      const url = request.nextUrl.clone();
      url.pathname = Routes.Login;
      return NextResponse.redirect(url);
    }
  }

  return await updateSession(request);
}
export const config = {
  matcher: ["/t/:path*", "/f/:path*"],
};
