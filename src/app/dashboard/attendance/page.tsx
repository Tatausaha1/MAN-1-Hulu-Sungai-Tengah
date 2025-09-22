
import { getClasses } from "@/lib/data";
import { QrScanner } from "./_components/qr-scanner";
import { Suspense } from "react";
import { createClient } from "@/lib/utils/supabase/server";
import { redirect } from "next/navigation";

export default async function AttendancePage() {
  const supabase = await createClient();
  const { data: { session }} = await supabase.auth.getSession();

  if (!session) {
    redirect("/login");
  }

  const classes = getClasses();

  return (
    <div className="container mx-auto p-4">
        <Suspense fallback={<div>Loading scanner...</div>}>
            <QrScanner availableClasses={classes} />
        </Suspense>
    </div>
  );
}
