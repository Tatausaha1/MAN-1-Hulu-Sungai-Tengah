"use client";

import { useState, useTransition } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Loader2, Lightbulb, TrendingUp, AlertTriangle } from "lucide-react";
import { runAttendanceAnalysis } from "@/lib/actions/analysis";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import type { AttendanceTrendAnalysisOutput } from "@/ai/flows/attendance-trend-analysis";

export function AnalysisClient() {
  const [isPending, startTransition] = useTransition();
  const [analysisResult, setAnalysisResult] = useState<AttendanceTrendAnalysisOutput | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleAnalyze = () => {
    startTransition(async () => {
      setError(null);
      setAnalysisResult(null);
      const result = await runAttendanceAnalysis();
      if (result.success) {
        setAnalysisResult(result.data);
      } else {
        setError(result.error);
      }
    });
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Analisis Tren Kehadiran</CardTitle>
          <CardDescription>
            Gunakan alat bertenaga AI kami untuk menganalisis data kehadiran historis. Identifikasi tren, prediksi potensi absensi, dan dapatkan wawasan yang dapat ditindaklanjuti.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button onClick={handleAnalyze} disabled={isPending}>
            {isPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Menganalisis...
              </>
            ) : (
              "Jalankan Analisis"
            )}
          </Button>
        </CardContent>
      </Card>

      {error && (
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>Analisis Gagal</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {analysisResult && (
        <div className="grid gap-6 md:grid-cols-1 lg:grid-cols-3">
          <Card>
            <CardHeader className="flex flex-row items-center gap-4 space-y-0">
                <div className="p-3 rounded-full bg-primary/10 text-primary">
                    <TrendingUp className="h-6 w-6" />
                </div>
                <CardTitle>Tren yang Teridentifikasi</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground whitespace-pre-wrap">{analysisResult.trends}</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center gap-4 space-y-0">
                <div className="p-3 rounded-full bg-destructive/10 text-destructive">
                    <AlertTriangle className="h-6 w-6" />
                </div>
                <CardTitle>Prediksi Absensi</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground whitespace-pre-wrap">{analysisResult.predictions}</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center gap-4 space-y-0">
                <div className="p-3 rounded-full bg-accent/10 text-accent-foreground">
                    <Lightbulb className="h-6 w-6" />
                </div>
                <CardTitle>Wawasan Proaktif</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground whitespace-pre-wrap">{analysisResult.insights}</p>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
