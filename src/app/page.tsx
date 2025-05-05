"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function HomePage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "loading") return;
    if (session) {
      router.push("/collections");
    } else {
      router.push("/login");
    }
  }, [session, status, router]);

  return <p>Yönlendiriliyor...</p>;
}
