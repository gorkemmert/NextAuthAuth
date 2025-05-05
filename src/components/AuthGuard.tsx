"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function AuthGuard({ children }: { children: React.ReactNode }) {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "loading") return; // Yüklenme sürecinde bekleyelim
    if (!session) router.push("/login"); // Kullanıcı giriş yapmamışsa login sayfasına yönlendir
  }, [session, status, router]);

  return <>{children}</>;
}
