"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { signIn } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Coffee, Eye, EyeOff, Lock } from "lucide-react";
import { toast } from "sonner";

export default function CashierLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("kasir@greeting.co");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      toast.error("Email dan password wajib diisi.");
      return;
    }

    setIsLoading(true);
    const { data, error } = await signIn.email({
      email,
      password,
      callbackURL: "/cashier",
    });

    if (error) {
      toast.error("Email atau password salah.", {
        description: "Pastikan akun kasir sudah terdaftar.",
      });
      setIsLoading(false);
      return;
    }

    // Verify the user has admin role
    if ((data?.user as { role?: string })?.role !== "admin") {
      toast.error("Akses ditolak.", {
        description: "Akun ini tidak memiliki hak akses kasir.",
      });
      setIsLoading(false);
      return;
    }

    toast.success("Login berhasil! Selamat datang.");
    router.push("/cashier");
    router.refresh();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/10 via-background to-accent/10 flex items-center justify-center p-4">
      <div className="w-full max-w-sm">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-primary text-primary-foreground mb-4">
            <Coffee className="h-8 w-8" />
          </div>
          <h1 className="text-2xl font-bold text-foreground">Greeting.co</h1>
          <p className="text-muted-foreground text-sm">Portal Kasir</p>
        </div>

        <Card className="shadow-lg">
          <CardHeader className="pb-4">
            <CardTitle className="text-lg flex items-center gap-2">
              <Lock className="h-5 w-5" />
              Login Kasir
            </CardTitle>
            <CardDescription>
              Masukkan kredensial akun kasirmu untuk mengakses dashboard.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-1.5">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="kasir@greeting.co"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  autoComplete="email"
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    autoComplete="current-password"
                    className="pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((v) => !v)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                </div>
              </div>

              <div className="bg-secondary/60 rounded-lg p-3 text-xs text-muted-foreground space-y-1">
                <p className="font-semibold">Kredensial default:</p>
                <p>
                  Email: <code className="font-mono">kasir@greeting.co</code>
                </p>
                <p>
                  Password: <code className="font-mono">Kasir123!</code>
                </p>
                <p className="text-amber-600 font-medium pt-1">
                  ⚠️ Jalankan <code>POST /api/setup</code> terlebih dahulu untuk
                  membuat akun ini.
                </p>
              </div>

              <Button
                type="submit"
                className="w-full h-10"
                disabled={isLoading}
              >
                {isLoading ? "Memverifikasi..." : "Masuk ke Dashboard"}
              </Button>
            </form>
          </CardContent>
        </Card>

        <p className="text-center text-xs text-muted-foreground mt-6">
          Hanya untuk staf kasir Greeting.co yang berwenang.
        </p>
      </div>
    </div>
  );
}
