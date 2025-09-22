
"use client";

import { useState, useTransition } from "react";
import { runSQL } from "@/lib/actions/sql";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { Loader2, AlertTriangle } from "lucide-react";

export default function SQLEditorPage() {
  const [query, setQuery] = useState("SELECT * FROM students LIMIT 5;");
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const handleRun = () => {
    startTransition(async () => {
      setError(null);
      setResult(null);
      const res = await runSQL(query);
      if (res.error) {
        setError(res.error);
      } else {
        setResult(res.data);
      }
    });
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>SQL Editor</CardTitle>
          <CardDescription>
            Jalankan query SQL secara langsung ke database. Gunakan dengan hati-hati.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Textarea
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            rows={8}
            className="w-full font-mono text-sm"
            placeholder="SELECT * FROM students;"
          />
          <Button onClick={handleRun} disabled={isPending}>
            {isPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Menjalankan...
              </>
            ) : (
              "Jalankan Query"
            )}
          </Button>
        </CardContent>
      </Card>

      {error && (
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>Query Gagal</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {result && (
        <Card>
            <CardHeader>
                <CardTitle>Hasil</CardTitle>
            </CardHeader>
            <CardContent>
                <pre className="bg-muted p-4 rounded-md overflow-x-auto text-sm">
                    {JSON.stringify(result, null, 2)}
                </pre>
            </CardContent>
        </Card>
      )}
    </div>
  );
}

