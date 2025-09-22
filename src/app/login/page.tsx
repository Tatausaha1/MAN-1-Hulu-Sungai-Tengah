
"use client";

import { useTransition } from "react";
import { login } from "@/lib/actions/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { School } from "lucide-react";

export default function LoginPage() {
  const [isPending, startTransition] = useTransition();
  const { toast } = useToast();

  const handleSubmit = (formData: FormData) => {
    startTransition(async () => {
      const error = await login(formData);
      if (error) {
        toast({
          title: "Login Gagal",
          description: error,
          variant: "destructive",
        });
      }
    });
  };

  return (
    <main className="flex items-center justify-center min-h-screen bg-background">
      <Card className="w-full max-w-sm">
        <CardHeader className="text-center">
            <div className="flex justify-center mb-4">
                 <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary text-primary-foreground">
                    <School className="h-6 w-6" />
                </div>
            </div>
          <CardTitle className="text-2xl">MAN 1 Hulu Sungai Tengah</CardTitle>
          <CardDescription>Silakan masuk untuk melanjutkan</CardDescription>
        </CardHeader>
        <CardContent>
          <form action={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="guru@example.com"
                required
                defaultValue="guru@example.com"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input 
                id="password" 
                name="password" 
                type="password" 
                required 
                defaultValue="password123"
              />
            </div>
            <Button type="submit" className="w-full" disabled={isPending}>
              {isPending ? "Masuk..." : "Masuk"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </main>
  );
}
