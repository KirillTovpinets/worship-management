"use client";

import { SessionProvider } from "next-auth/react";
import { NotificationProvider } from "./ui";

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <NotificationProvider>{children}</NotificationProvider>
    </SessionProvider>
  );
}
