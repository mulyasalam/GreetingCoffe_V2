"use client";

import { createAuthClient } from "better-auth/react";
import { adminClient } from "better-auth/client/plugins";

const fallbackBaseURL =
  typeof window !== "undefined" ? window.location.origin : "http://localhost:3000";

export const authClient = createAuthClient({
  baseURL: process.env.NEXT_PUBLIC_APP_URL ?? fallbackBaseURL,
  plugins: [adminClient()],
});

export const {
  signIn,
  signOut,
  signUp,
  useSession,
} = authClient;
