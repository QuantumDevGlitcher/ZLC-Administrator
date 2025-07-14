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
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

// Placeholder components for other roles

const LogisticaPlaceholder = () => (
  <div className="min-h-screen flex items-center justify-center bg-background">
    <div className="text-center">
      <h1 className="text-2xl font-bold text-zlc-darkblue mb-4">
        Panel de Logística
      </h1>
      <p className="text-muted-foreground">
        Bookings y embarques - En desarrollo
      </p>
    </div>
  </div>
);

const SoportePlaceholder = () => (
  <div className="min-h-screen flex items-center justify-center bg-background">
    <div className="text-center">
      <h1 className="text-2xl font-bold text-zlc-darkblue mb-4">
        Panel de Soporte
      </h1>
      <p className="text-muted-foreground">
        Tickets de incidencia - En desarrollo
      </p>
    </div>
  </div>
);

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/veracidad" element={<Veracidad />} />
          <Route path="/calidad" element={<Calidad />} />
          <Route path="/aduana" element={<Aduana />} />
          <Route path="/logistica" element={<LogisticaPlaceholder />} />
          <Route path="/soporte" element={<SoportePlaceholder />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

createRoot(document.getElementById("root")!).render(<App />);
