"use client";

import { Suspense, createContext, useContext, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "@/components/providers";
import { Sidebar } from "@/components/sidebar";
import { IdeasoftModal } from "@/components/feature-modals";
import { GemLogo } from "@/components/icons";
import { getSidebarCollapsed, saveSidebarCollapsed } from "@/lib/session";

export const MobileMenuContext = createContext<() => void>(() => {});
export function useMobileMenu() {
  return useContext(MobileMenuContext);
}

export default function PanelLayout({ children }: { children: React.ReactNode }) {
  const { session, ready } = useSession();
  const router = useRouter();
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [ideasoftOpen, setIdeasoftOpen] = useState(false);

  useEffect(() => {
    setCollapsed(getSidebarCollapsed());
  }, []);

  useEffect(() => {
    if (ready && !session) router.replace("/login");
  }, [ready, session, router]);

  if (!ready || !session) {
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

  function toggleCollapsed() {
    setCollapsed((prev) => {
      const next = !prev;
      saveSidebarCollapsed(next);
      return next;
    });
  }

  return (
    <div className="flex min-h-screen">
      <Suspense fallback={null}>
        <Sidebar
          collapsed={collapsed}
          onToggleCollapsed={toggleCollapsed}
          mobileOpen={mobileOpen}
          onMobileClose={() => setMobileOpen(false)}
          onOpenIdeasoft={() => setIdeasoftOpen(true)}
        />
      </Suspense>
      <MobileMenuContext.Provider value={() => setMobileOpen(true)}>
        <main className="flex min-h-screen min-w-0 flex-1 flex-col">{children}</main>
      </MobileMenuContext.Provider>
      <IdeasoftModal open={ideasoftOpen} onClose={() => setIdeasoftOpen(false)} storeUrl={session.storeUrl} />
    </div>
  );
}
