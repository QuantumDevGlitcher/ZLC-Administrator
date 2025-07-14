import "./global.css";

import { createRoot } from "react-dom/client";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Veracidad from "./pages/Veracidad";
import Calidad from "./pages/Calidad";
import Aduana from "./pages/Aduana";
import Logistica from "./pages/Logistica";
import Soporte from "./pages/Soporte";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

// Placeholder components for other roles

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/veracidad" element={<Veracidad />} />
          <Route path="/calidad" element={<Calidad />} />
          <Route path="/aduana" element={<Aduana />} />
          <Route path="/logistica" element={<Logistica />} />
          <Route path="/soporte" element={<SoportePlaceholder />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

createRoot(document.getElementById("root")!).render(<App />);
