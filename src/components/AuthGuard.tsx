"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function AuthGuard({ children }: { children: React.ReactNode }) {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "loading") return;
  
    if (status === "unauthenticated" || !session) {
      router.push("/login");
    }
  }, [session, status, router]);

  
  return <>{children}</>;
}
