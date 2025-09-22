import { getClasses } from "@/lib/data";
import { QrScanner } from "./_components/qr-scanner";
import { Suspense } from "react";

export default function AttendancePage() {
  const classes = getClasses();

  return (
    <div className="container mx-auto p-4">
        <Suspense fallback={<div>Loading scanner...</div>}>
            <QrScanner availableClasses={classes} />
        </Suspense>
    </div>
  );
}
