import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Rankings from "./pages/Rankings";
import Matches from "./pages/Matches";
import Armies from "./pages/Armies";
import NotFound from "./pages/NotFound";
import AddMatchup from "./pages/AddMatchup";
import AddPlayer from "./pages/AddPlayer";
import { RequireAdmin } from "./auth/RequireAdmin";
import { AuthProvider } from "./auth/AuthContext";
import AdminLogin from "./pages/AdminLogin";
import { AdminRoute } from "./components/AdminRoute";

const queryClient = new QueryClient();

const App = () => (
    <AuthProvider>
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/rankings" element={<Rankings />} />
              <Route path="/matches" element={<Matches />} />
              <Route path="/armies" element={<Armies />} />
              <Route path="/add-matchup" element={
                <AdminRoute>
                  <AddMatchup />
                </AdminRoute>
              } />
              <Route path="/add-player" element={
                <AdminRoute>
                  <AddPlayer />
                </AdminRoute>
              } />
              <Route path="/admin-login" element={<AdminLogin />}/>
              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </QueryClientProvider>
    </AuthProvider>
);

export default App;
