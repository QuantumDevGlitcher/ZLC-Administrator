import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Building2,
  FileText,
  Ship,
  Headphones,
  Shield,
  LogOut,
  User,
  Package,
  BarChart3
} from "lucide-react";
import { apiClient } from "@/lib/api-client";

interface DashboardStats {
  totalUsers: number;
  totalDocuments: number;
  activeShipments: number;
  openTickets: number;
}

export default function Dashboard() {
  const navigate = useNavigate();
  const [user, setUser] = useState<any>(null);
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadUserData();
    loadStats();
  }, []);

  const loadUserData = () => {
    const userData = apiClient.getCurrentUser();
    if (!userData) {
      navigate("/");
      return;
    }
    setUser(userData);
  };

  const loadStats = async () => {
    try {
      // Get stats from different modules
      const [aduanaStats, calidadStats, logisticaStats, soporteStats] = await Promise.all([
        apiClient.getAduanaDashboard().catch(() => ({ estadisticas: { documentos: { total: 0 } } })),
        apiClient.getCalidadDashboard().catch(() => ({ stats: { inspeccionesHoy: 0 } })),
        apiClient.getLogisticaDashboard().catch(() => ({ stats: { enviosHoy: 0 } })),
        apiClient.getSoporteDashboard().catch(() => ({ stats: { ticketsAbiertos: 0 } }))
      ]);

      setStats({
        totalUsers: 25,
        totalDocuments: aduanaStats.estadisticas?.documentos?.total || 0,
        activeShipments: logisticaStats.stats?.enviosHoy || 0,
        openTickets: soporteStats.stats?.ticketsAbiertos || 0
      });
    } catch (error) {
      console.error("Error loading stats:", error);
      setStats({
        totalUsers: 0,
        totalDocuments: 0,
        activeShipments: 0,
        openTickets: 0
      });
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    await apiClient.logout();
    navigate("/");
  };

  const modules = [
    {
      name: "Aduana",
      description: "Gestión de documentos y órdenes aduaneras",
      icon: Building2,
      route: "/aduana",
      color: "bg-blue-500",
      stats: stats?.totalDocuments || 0,
      statsLabel: "documentos"
    },
    {
      name: "Calidad",
      description: "Control de calidad e inspecciones",
      icon: Shield,
      route: "/calidad",
      color: "bg-green-500",
      stats: "N/A",
      statsLabel: "inspecciones"
    },
    {
      name: "Logística",
      description: "Gestión de envíos y rutas",
      icon: Ship,
      route: "/logistica",
      color: "bg-purple-500",
      stats: stats?.activeShipments || 0,
      statsLabel: "envíos activos"
    },
    {
      name: "Soporte",
      description: "Tickets y atención al cliente",
      icon: Headphones,
      route: "/soporte",
      color: "bg-orange-500",
      stats: stats?.openTickets || 0,
      statsLabel: "tickets abiertos"
    },
    {
      name: "Veracidad",
      description: "Verificación documental",
      icon: FileText,
      route: "/veracidad",
      color: "bg-red-500",
      stats: "N/A",
      statsLabel: "verificaciones"
    }
  ];

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center">
                <Package className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">ZLC Administrator</h1>
                <p className="text-sm text-gray-600">Panel de Control</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-right">
                <p className="text-sm font-medium text-gray-900">
                  {user?.firstName} {user?.lastName}
                </p>
                <p className="text-xs text-gray-600">{user?.email}</p>
              </div>
              <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                {user?.role || 'admin'}
              </Badge>
              <Button variant="ghost" size="sm" onClick={handleLogout}>
                <LogOut className="w-4 h-4 mr-2" />
                Salir
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Bienvenido, {user?.firstName}
          </h2>
          <p className="text-gray-600">
            Selecciona un módulo para comenzar a trabajar
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Usuarios</CardTitle>
              <User className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats?.totalUsers || 0}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Documentos</CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats?.totalDocuments || 0}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Envíos Activos</CardTitle>
              <Ship className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats?.activeShipments || 0}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Tickets Abiertos</CardTitle>
              <Headphones className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats?.openTickets || 0}</div>
            </CardContent>
          </Card>
        </div>

        {/* Modules Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {modules.map((module) => {
            const IconComponent = module.icon;
            return (
              <Card
                key={module.name}
                className="hover:shadow-lg transition-all duration-200 cursor-pointer group"
                onClick={() => navigate(module.route)}
              >
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className={`w-12 h-12 ${module.color} rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-200`}>
                      <IconComponent className="w-6 h-6 text-white" />
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold text-gray-900">{module.stats}</p>
                      <p className="text-xs text-gray-600">{module.statsLabel}</p>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <CardTitle className="text-lg mb-2">{module.name}</CardTitle>
                  <CardDescription className="text-sm">
                    {module.description}
                  </CardDescription>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </div>
  );
}
