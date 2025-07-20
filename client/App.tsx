import "./global.css";

import { createRoot } from "react-dom/client";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/hooks/use-auth";
import Login from "./pages/Login";
import Index from "./pages/Index";
import Veracidad from "./pages/Veracidad";
import Calidad from "./pages/Calidad";
import Aduana from "./pages/Aduana";
import Logistica from "./pages/Logistica";
import Soporte from "./pages/Soporte";
import Profile from "./pages/Profile";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/" element={<Index />} />
            <Route path="/veracidad" element={<Veracidad />} />
            <Route path="/calidad" element={<Calidad />} />
            <Route path="/aduana" element={<Aduana />} />
            <Route path="/logistica" element={<Logistica />} />
            <Route path="/soporte" element={<Soporte />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

createRoot(document.getElementById("root")!).render(<App />);
