import { Layout } from "@/components/Layout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ShieldCheck } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { setAdminToken } from "@/lib/adminAuth";

const AdminLogin = () => {
  const nav = useNavigate();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); // ✅ stops page reload
    setError("");

    if (!username.trim() || !password.trim()) {
      setError("Enter username and password.");
      return;
    }

    try {
      setLoading(true);

      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: username.trim(),
          password,
        }),
      });

      const raw = await res.text();
      let data: any = null;
      try {
        data = raw ? JSON.parse(raw) : null;
      } catch {}

      if (!res.ok) {
        setError(data?.error || data?.message || raw || "Login failed.");
        return;
      }

      const token = data?.token;
      if (!token) {
        setError("Server did not return token.");
        return;
      }

      // ✅ persist login
      setAdminToken(token);

      // ✅ navigate to admin-only page
      nav("/", { replace: true });
      localStorage.setItem("adminToken", token);
    } catch (e: any) {
      setError(e?.message || "Network error.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 py-10 md:py-14">
        <div className="max-w-lg mx-auto">
          <header className="mb-6">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-lg bg-primary/10 border border-primary/20">
                <ShieldCheck className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h1 className="text-3xl md:text-4xl font-display font-black">
                  <span className="gradient-text">ADMIN</span>{" "}
                  <span className="text-foreground">LOGIN</span>
                </h1>
                <p className="text-muted-foreground text-sm">
                  Only admins can add players and matchups.
                </p>
              </div>
            </div>
          </header>

          <Card variant="glass" className="overflow-hidden">
            <CardContent className="p-6">
              <form onSubmit={onSubmit} className="space-y-4">
                <div className="space-y-2">
                  <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    Username
                  </label>
                  <Input
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="Admin username"
                    className="h-11"
                    autoComplete="username"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    Password
                  </label>
                  <Input
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Admin password"
                    type="password"
                    className="h-11"
                    autoComplete="current-password"
                  />
                </div>

                {error && (
                  <div className="rounded-xl border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive">
                    {error}
                  </div>
                )}

                <Button type="submit" className="h-11 w-full" disabled={loading}>
                  {loading ? "Logging in..." : "Login"}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
};

export default AdminLogin;
