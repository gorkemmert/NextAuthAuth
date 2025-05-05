"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { SessionProvider } from "next-auth/react";
import AuthGuard from "@/components/AuthGuard";
import Sidebar from "@/components/Sidebar";
import AppBar from "@/components/AppBar";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false);

  const handleDrawerOpen = () => setOpen(true);
  const handleDrawerClose = () => setOpen(false);

  return (
    <html lang="tr">
      <body>
        <SessionProvider>
          <AuthGuard>
            <LayoutContent open={open} handleDrawerOpen={handleDrawerOpen} handleDrawerClose={handleDrawerClose}>
              {children}
            </LayoutContent>
          </AuthGuard>
        </SessionProvider>
      </body>
    </html>
  );
}


function LayoutContent({ children, open, handleDrawerOpen, handleDrawerClose }: any) {
  const { data: session, status } = useSession();

  if (status === "loading") return <p>Yükleniyor...</p>;

  if (!session) {
    return <>{children}</>;
  }

  return (
    <>
      <AppBar open={open} handleDrawerOpen={handleDrawerOpen} />
      <Sidebar open={open} handleDrawerClose={handleDrawerClose} />
      {children}
    </>
  );
}
