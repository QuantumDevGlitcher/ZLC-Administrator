import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  LogOut,
  Search,
  FileText,
  CheckCircle,
  Clock,
  AlertTriangle,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function Veracidad() {
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();

  const handleLogout = () => {
    navigate("/");
  };

  // Mock data for demonstration
  const documents = [
    {
      id: "DOC-001",
      type: "Factura Comercial",
      client: "Importadora ABC",
      status: "pending",
      date: "2024-01-15",
    },
    {
      id: "DOC-002",
      type: "Packing List",
      client: "Comercial XYZ",
      status: "approved",
      date: "2024-01-14",
    },
    {
      id: "DOC-003",
      type: "Certificado Origen",
      client: "Empresa 123",
      status: "rejected",
      date: "2024-01-13",
    },
  ];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pending":
        return (
          <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">
            <Clock className="w-3 h-3 mr-1" />
            Pendiente
          </Badge>
        );
      case "approved":
        return (
          <Badge variant="secondary" className="bg-green-100 text-green-800">
            <CheckCircle className="w-3 h-3 mr-1" />
            Aprobado
          </Badge>
        );
      case "rejected":
        return (
          <Badge variant="secondary" className="bg-red-100 text-red-800">
            <AlertTriangle className="w-3 h-3 mr-1" />
            Rechazado
          </Badge>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-zlc-darkblue text-zlc-darkblue-foreground shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-4">
              <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center">
                <FileText className="w-6 h-6 text-zlc-darkblue" />
              </div>
              <div>
                <h1 className="text-xl font-bold">Panel de Veracidad</h1>
                <p className="text-zlc-darkblue-foreground/80 text-sm">
                  Verificación Documental
                </p>
              </div>
            </div>
            <Button
              variant="ghost"
              onClick={handleLogout}
              className="text-zlc-darkblue-foreground hover:bg-zlc-navy"
            >
              <LogOut className="w-4 h-4 mr-2" />
              Cerrar Sesión
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-zlc-darkblue mb-2">
            Documentos Pendientes de Verificación
          </h2>
          <p className="text-muted-foreground">
            Revisa y valida los documentos comerciales de importación
          </p>
        </div>

        {/* Search Bar */}
        <Card className="mb-6">
          <CardContent className="pt-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input
                placeholder="Buscar por ID, cliente o tipo de documento..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </CardContent>
        </Card>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Pendientes Hoy
              </CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-zlc-darkblue">12</div>
              <p className="text-xs text-muted-foreground">+3 desde ayer</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Aprobados Esta Semana
              </CardTitle>
              <CheckCircle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">45</div>
              <p className="text-xs text-muted-foreground">
                +12% vs semana anterior
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Rechazados</CardTitle>
              <AlertTriangle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">3</div>
              <p className="text-xs text-muted-foreground">
                -2 vs semana anterior
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Documents Table */}
        <Card>
          <CardHeader>
            <CardTitle>Documentos Recientes</CardTitle>
            <CardDescription>
              Lista de documentos para verificación
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {documents.map((doc) => (
                <div
                  key={doc.id}
                  className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                >
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-zlc-darkblue/10 rounded-lg flex items-center justify-center">
                      <FileText className="w-6 h-6 text-zlc-darkblue" />
                    </div>
                    <div>
                      <p className="font-medium">{doc.id}</p>
                      <p className="text-sm text-muted-foreground">
                        {doc.type} - {doc.client}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {doc.date}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    {getStatusBadge(doc.status)}
                    <Button
                      size="sm"
                      className="bg-zlc-darkblue hover:bg-zlc-navy"
                    >
                      Revisar
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
