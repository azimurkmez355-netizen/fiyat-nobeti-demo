"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "@/components/providers";
import { GemLogo } from "@/components/icons";

export default function RootPage() {
  const { session, ready } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (!ready) return;
    router.replace(session ? "/panel" : "/login");
  }, [ready, session, router]);

  return (
    <div className="flex min-h-screen items-center justify-center">
      <div
        className="wg-pulse flex h-14 w-14 items-center justify-center rounded-[16px] text-white"
        style={{ background: "linear-gradient(135deg,var(--brand-1),var(--brand-2))" }}
      >
        <GemLogo className="h-7 w-7" />
      </div>
    </div>
  );
}
