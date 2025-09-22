import { Suspense } from "react";
import { AnalysisClient } from "./_components/analysis-client";

export default function AnalysisPage() {
  return (
    <Suspense fallback={<div>Loading analysis tool...</div>}>
      <AnalysisClient />
    </Suspense>
  );
}
