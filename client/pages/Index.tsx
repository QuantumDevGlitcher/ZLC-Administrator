import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Package,
  FileText,
  CheckCircle,
  Truck,
  HelpCircle,
  Shield,
  User,
  LogOut,
} from "lucide-react";

export default function Index() {
  const { user, isAuthenticated, logout, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      navigate("/login");
    }
  }, [isAuthenticated, loading, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  const modules = [
    {
      name: "Aduana",
      description: "Gestión de procesos aduaneros",
      icon: FileText,
      route: "/aduana",
      color: "bg-blue-100 text-blue-600",
    },
    {
      name: "Calidad",
      description: "Control de calidad",
      icon: CheckCircle,
      route: "/calidad",
      color: "bg-green-100 text-green-600",
    },
    {
      name: "Logística",
      description: "Gestión logística",
      icon: Truck,
      route: "/logistica",
      color: "bg-purple-100 text-purple-600",
    },
    {
      name: "Soporte",
      description: "Sistema de soporte",
      icon: HelpCircle,
      route: "/soporte",
      color: "bg-orange-100 text-orange-600",
    },
    {
      name: "Veracidad",
      description: "Verificación de documentos",
      icon: Shield,
      route: "/veracidad",
      color: "bg-red-100 text-red-600",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="bg-blue-600 p-2 rounded-lg">
                <Package className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-semibold text-gray-900">
                  ZLC Administrator
                </h1>
                <p className="text-sm text-gray-500">Sistema de Gestión</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <User className="h-4 w-4 text-gray-500" />
                <span className="text-sm text-gray-700">
                  {user.firstName} {user.lastName}
                </span>
                <Badge variant={user.role === 'admin' ? 'default' : 'secondary'}>
                  {user.role}
                </Badge>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => navigate("/profile")}
              >
                Perfil
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleLogout}
              >
                <LogOut className="h-4 w-4 mr-2" />
                Salir
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Bienvenido, {user.firstName}
          </h2>
          <p className="text-gray-600">
            Seleccione un módulo para comenzar a trabajar
          </p>
        </div>

        {/* Modules Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {modules.map((module) => {
            const Icon = module.icon;
            return (
              <Card
                key={module.name}
                className="hover:shadow-lg transition-shadow cursor-pointer"
                onClick={() => navigate(module.route)}
              >
                <CardHeader className="flex flex-row items-center space-y-0 pb-4">
                  <div className={`p-2 rounded-lg ${module.color} mr-4`}>
                    <Icon className="h-6 w-6" />
                  </div>
                  <div>
                    <CardTitle className="text-lg">{module.name}</CardTitle>
                    <CardDescription>{module.description}</CardDescription>
                  </div>
                </CardHeader>
                <CardContent>
                  <Button variant="outline" className="w-full">
                    Acceder
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Status Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">
                Estado del Sistema
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span className="text-sm text-gray-700">Operativo</span>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">
                Conexión Backend
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span className="text-sm text-gray-700">Conectado</span>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">
                Sesión
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span className="text-sm text-gray-700">Activa</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
