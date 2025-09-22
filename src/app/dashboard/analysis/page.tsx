
import { Suspense } from "react";
import { AnalysisClient } from "./_components/analysis-client";
import { createClient } from "@/lib/utils/supabase/server";
import { redirect } from "next/navigation";


export default async function AnalysisPage() {
  const supabase = await createClient();
  const { data: { session }} = await supabase.auth.getSession();

  if (!session) {
    redirect("/login");
  }
  
  return (
    <Suspense fallback={<div>Loading analysis tool...</div>}>
      <AnalysisClient />
    </Suspense>
  );
}
