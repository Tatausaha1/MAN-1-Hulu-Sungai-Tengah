"use client";

import { useEffect } from "react";
import { createClient } from "@/lib/utils/supabase/client";
import { useRouter } from "next/navigation";

export function useSupabaseAuth() {
  const router = useRouter();

  useEffect(() => {
    const supabase = createClient();

    const { data: listener } = supabase.auth.onAuthStateChange(
      (event, session) => {
        console.log("Auth state changed:", event, session ? "has session" : "no session");

        if (event === "TOKEN_REFRESHED") {
          console.log("🔄 Token refreshed automatically");
        } else if (event === "SIGNED_OUT") {
          console.log("🚪 User signed out, redirecting to login.");
          router.refresh(); // Refresh the page to trigger middleware redirect
        } else if (event === "SIGNED_IN") {
          console.log("✅ User signed in.");
          router.refresh();
        }
      }
    );

    return () => {
      listener?.subscription.unsubscribe();
    };
  }, [router]);
}
