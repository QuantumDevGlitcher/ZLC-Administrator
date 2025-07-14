import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import {
  LogOut,
  Search,
  Building2,
  FileText,
  CheckCircle,
  XCircle,
  Clock,
  AlertTriangle,
  Eye,
  Download,
  Filter,
  Mail,
  Calendar,
  MapPin,
  FileCheck,
  Building,
  Shield,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

interface Company {
  id: string;
  name: string;
  ruc: string;
  country: string;
  registrationDate: string;
  status: "pending" | "verified" | "rejected";
  documents: {
    zlcLicense: {
      uploaded: boolean;
      status?: "approved" | "rejected";
      comment?: string;
    };
    fiscalRegistry: {
      uploaded: boolean;
      status?: "approved" | "rejected";
      comment?: string;
    };
    certifications: {
      uploaded: boolean;
      status?: "approved" | "rejected";
      comment?: string;
    };
  };
  backgroundCheck: {
    legalExistence: boolean;
    representativeValid: boolean;
    comment?: string;
  };
}

export default function Veracidad() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [countryFilter, setCountryFilter] = useState("all");
  const [dateFilter, setDateFilter] = useState("all");
  const [selectedCompany, setSelectedCompany] = useState<Company | null>(null);
  const [showVerificationDialog, setShowVerificationDialog] = useState(false);
  const [verificationComments, setVerificationComments] = useState("");
  const [backgroundSearchTerm, setBackgroundSearchTerm] = useState("");
  const [legalExistenceChecked, setLegalExistenceChecked] = useState(false);
  const [representativeValidChecked, setRepresentativeValidChecked] =
    useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    navigate("/");
  };

  // Mock data for demonstration
  const [companies, setCompanies] = useState<Company[]>([
    {
      id: "COMP-001",
      name: "Importadora Global SAC",
      ruc: "20123456789",
      country: "Perú",
      registrationDate: "2024-01-15",
      status: "pending",
      documents: {
        zlcLicense: { uploaded: true },
        fiscalRegistry: { uploaded: true },
        certifications: { uploaded: false },
      },
      backgroundCheck: {
        legalExistence: false,
        representativeValid: false,
      },
    },
    {
      id: "COMP-002",
      name: "Comercial International Ltd",
      ruc: "900123456",
      country: "Colombia",
      registrationDate: "2024-01-12",
      status: "verified",
      documents: {
        zlcLicense: { uploaded: true, status: "approved" },
        fiscalRegistry: { uploaded: true, status: "approved" },
        certifications: { uploaded: true, status: "approved" },
      },
      backgroundCheck: {
        legalExistence: true,
        representativeValid: true,
      },
    },
    {
      id: "COMP-003",
      name: "Express Trade SRL",
      ruc: "RUC-789456123",
      country: "Ecuador",
      registrationDate: "2024-01-10",
      status: "rejected",
      documents: {
        zlcLicense: {
          uploaded: true,
          status: "rejected",
          comment: "Licencia vencida",
        },
        fiscalRegistry: { uploaded: true, status: "approved" },
        certifications: { uploaded: false },
      },
      backgroundCheck: {
        legalExistence: false,
        representativeValid: false,
        comment: "No se encontró registro en base de datos oficial",
      },
    },
  ]);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pending":
        return (
          <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">
            <Clock className="w-3 h-3 mr-1" />
            Pendiente
          </Badge>
        );
      case "verified":
        return (
          <Badge variant="secondary" className="bg-green-100 text-green-800">
            <CheckCircle className="w-3 h-3 mr-1" />
            Verificada
          </Badge>
        );
      case "rejected":
        return (
          <Badge variant="secondary" className="bg-red-100 text-red-800">
            <XCircle className="w-3 h-3 mr-1" />
            Rechazada
          </Badge>
        );
      default:
        return null;
    }
  };

  const getDocumentStatus = (document: {
    uploaded: boolean;
    status?: string;
  }) => {
    if (!document.uploaded) {
      return (
        <Badge variant="secondary" className="bg-gray-100 text-gray-800">
          No subido
        </Badge>
      );
    }
    if (document.status === "approved") {
      return (
        <Badge variant="secondary" className="bg-green-100 text-green-800">
          Aprobado
        </Badge>
      );
    }
    if (document.status === "rejected") {
      return (
        <Badge variant="secondary" className="bg-red-100 text-red-800">
          Rechazado
        </Badge>
      );
    }
    return (
      <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">
        Pendiente
      </Badge>
    );
  };

  const filteredCompanies = companies.filter((company) => {
    const matchesSearch =
      company.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      company.ruc.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus =
      statusFilter === "all" || company.status === statusFilter;
    const matchesCountry =
      countryFilter === "all" || company.country === countryFilter;

    let matchesDate = true;
    if (dateFilter !== "all") {
      const companyDate = new Date(company.registrationDate);
      const now = new Date();
      const daysDiff = Math.floor(
        (now.getTime() - companyDate.getTime()) / (1000 * 60 * 60 * 24),
      );

      switch (dateFilter) {
        case "today":
          matchesDate = daysDiff === 0;
          break;
        case "week":
          matchesDate = daysDiff <= 7;
          break;
        case "month":
          matchesDate = daysDiff <= 30;
          break;
      }
    }

    return matchesSearch && matchesStatus && matchesCountry && matchesDate;
  });

  const openCompanyDetails = (company: Company) => {
    setSelectedCompany(company);
    setLegalExistenceChecked(company.backgroundCheck.legalExistence);
    setRepresentativeValidChecked(company.backgroundCheck.representativeValid);
    setShowVerificationDialog(true);
  };

  const handleDocumentApproval = (
    docType: keyof Company["documents"],
    status: "approved" | "rejected",
  ) => {
    if (!selectedCompany) return;

    const comment = prompt(`Comentario para ${docType}:`);

    setSelectedCompany({
      ...selectedCompany,
      documents: {
        ...selectedCompany.documents,
        [docType]: {
          ...selectedCompany.documents[docType],
          status,
          comment: comment || "",
        },
      },
    });
  };

  const handleBackgroundValidation = () => {
    if (!selectedCompany) return;

    alert(`Consultando registros oficiales para: ${backgroundSearchTerm}`);
    // Mock search - in real implementation, this would call an API
    setLegalExistenceChecked(true);
    setRepresentativeValidChecked(true);
  };

  const handleVerifyCompany = () => {
    if (!selectedCompany) return;

    const updatedCompany = {
      ...selectedCompany,
      status: "verified" as const,
      backgroundCheck: {
        legalExistence: legalExistenceChecked,
        representativeValid: representativeValidChecked,
        comment: verificationComments,
      },
    };

    setCompanies(
      companies.map((c) => (c.id === selectedCompany.id ? updatedCompany : c)),
    );
    setShowVerificationDialog(false);

    // Mock notification
    alert(
      `Empresa verificada. Notificación enviada a ${selectedCompany.name}.`,
    );
  };

  const handleRejectCompany = () => {
    if (!selectedCompany) return;

    const updatedCompany = {
      ...selectedCompany,
      status: "rejected" as const,
      backgroundCheck: {
        legalExistence: legalExistenceChecked,
        representativeValid: representativeValidChecked,
        comment: verificationComments,
      },
    };

    setCompanies(
      companies.map((c) => (c.id === selectedCompany.id ? updatedCompany : c)),
    );
    setShowVerificationDialog(false);

    // Mock notification
    alert(
      `Solicitud rechazada. Notificación enviada a ${selectedCompany.name}.`,
    );
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-zlc-darkblue text-zlc-darkblue-foreground shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-4">
              <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center">
                <Building2 className="w-6 h-6 text-zlc-darkblue" />
              </div>
              <div>
                <h1 className="text-xl font-bold">Verificación de Empresas</h1>
                <p className="text-zlc-darkblue-foreground/80 text-sm">
                  Inspector de Veracidad
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
            Empresas Pendientes de Verificación
          </h2>
          <p className="text-muted-foreground">
            Revisa y valida los documentos y antecedentes de las empresas
            solicitantes
          </p>
        </div>

        {/* Filters and Search */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Filter className="w-5 h-5" />
              Filtros y Búsqueda
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div>
                <Label htmlFor="search">Buscar empresa</Label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                  <Input
                    id="search"
                    placeholder="Nombre o RUC..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>

              <div>
                <Label>Estado</Label>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="Todos los estados" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos</SelectItem>
                    <SelectItem value="pending">Pendiente</SelectItem>
                    <SelectItem value="verified">Verificada</SelectItem>
                    <SelectItem value="rejected">Rechazada</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label>País</Label>
                <Select value={countryFilter} onValueChange={setCountryFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="Todos los países" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos</SelectItem>
                    <SelectItem value="Perú">Perú</SelectItem>
                    <SelectItem value="Colombia">Colombia</SelectItem>
                    <SelectItem value="Ecuador">Ecuador</SelectItem>
                    <SelectItem value="Chile">Chile</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label>Fecha de registro</Label>
                <Select value={dateFilter} onValueChange={setDateFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="Todas las fechas" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todas</SelectItem>
                    <SelectItem value="today">Hoy</SelectItem>
                    <SelectItem value="week">Esta semana</SelectItem>
                    <SelectItem value="month">Este mes</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Empresas Pendientes
              </CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-zlc-darkblue">
                {companies.filter((c) => c.status === "pending").length}
              </div>
              <p className="text-xs text-muted-foreground">
                Requieren verificación
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Verificadas Este Mes
              </CardTitle>
              <CheckCircle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">
                {companies.filter((c) => c.status === "verified").length}
              </div>
              <p className="text-xs text-muted-foreground">
                +25% vs mes anterior
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Rechazadas</CardTitle>
              <XCircle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">
                {companies.filter((c) => c.status === "rejected").length}
              </div>
              <p className="text-xs text-muted-foreground">
                -10% vs mes anterior
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Companies Table */}
        <Card>
          <CardHeader>
            <CardTitle>Lista de Empresas</CardTitle>
            <CardDescription>
              Empresas registradas para verificación ({filteredCompanies.length}{" "}
              resultados)
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {filteredCompanies.map((company) => (
                <div
                  key={company.id}
                  className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                >
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-zlc-darkblue/10 rounded-lg flex items-center justify-center">
                      <Building2 className="w-6 h-6 text-zlc-darkblue" />
                    </div>
                    <div className="space-y-1">
                      <p className="font-medium">{company.name}</p>
                      <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                        <span className="flex items-center">
                          <Building className="w-3 h-3 mr-1" />
                          {company.ruc}
                        </span>
                        <span className="flex items-center">
                          <MapPin className="w-3 h-3 mr-1" />
                          {company.country}
                        </span>
                        <span className="flex items-center">
                          <Calendar className="w-3 h-3 mr-1" />
                          {company.registrationDate}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    {getStatusBadge(company.status)}
                    <Button
                      size="sm"
                      onClick={() => openCompanyDetails(company)}
                      className="bg-zlc-darkblue hover:bg-zlc-navy"
                    >
                      <Eye className="w-4 h-4 mr-1" />
                      Verificar
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </main>

      {/* Company Verification Dialog */}
      <Dialog
        open={showVerificationDialog}
        onOpenChange={setShowVerificationDialog}
      >
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Building2 className="w-5 h-5" />
              Verificación: {selectedCompany?.name}
            </DialogTitle>
            <DialogDescription>
              Revisa todos los documentos y antecedentes antes de tomar una
              decisión
            </DialogDescription>
          </DialogHeader>

          {selectedCompany && (
            <div className="space-y-6">
              {/* Company Info */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">
                    Información de la Empresa
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label className="text-sm font-medium">Nombre</Label>
                      <p className="text-sm">{selectedCompany.name}</p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium">RUC/NIT</Label>
                      <p className="text-sm">{selectedCompany.ruc}</p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium">País</Label>
                      <p className="text-sm">{selectedCompany.country}</p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium">
                        Fecha de registro
                      </Label>
                      <p className="text-sm">
                        {selectedCompany.registrationDate}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Document Verification */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <FileCheck className="w-5 h-5" />
                    Verificación Documental
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* ZLC License */}
                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center space-x-3">
                      <FileText className="w-5 h-5 text-zlc-darkblue" />
                      <div>
                        <p className="font-medium">Licencia ZLC</p>
                        <p className="text-sm text-muted-foreground">
                          {selectedCompany.documents.zlcLicense.comment}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      {getDocumentStatus(selectedCompany.documents.zlcLicense)}
                      {selectedCompany.documents.zlcLicense.uploaded && (
                        <>
                          <Button size="sm" variant="outline">
                            <Download className="w-3 h-3 mr-1" />
                            Ver
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            className="text-green-600 border-green-600"
                            onClick={() =>
                              handleDocumentApproval("zlcLicense", "approved")
                            }
                          >
                            <CheckCircle className="w-3 h-3 mr-1" />
                            Aprobar
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            className="text-red-600 border-red-600"
                            onClick={() =>
                              handleDocumentApproval("zlcLicense", "rejected")
                            }
                          >
                            <XCircle className="w-3 h-3 mr-1" />
                            Rechazar
                          </Button>
                        </>
                      )}
                    </div>
                  </div>

                  {/* Fiscal Registry */}
                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center space-x-3">
                      <FileText className="w-5 h-5 text-zlc-darkblue" />
                      <div>
                        <p className="font-medium">Registro Fiscal</p>
                        <p className="text-sm text-muted-foreground">
                          {selectedCompany.documents.fiscalRegistry.comment}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      {getDocumentStatus(
                        selectedCompany.documents.fiscalRegistry,
                      )}
                      {selectedCompany.documents.fiscalRegistry.uploaded && (
                        <>
                          <Button size="sm" variant="outline">
                            <Download className="w-3 h-3 mr-1" />
                            Ver
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            className="text-green-600 border-green-600"
                            onClick={() =>
                              handleDocumentApproval(
                                "fiscalRegistry",
                                "approved",
                              )
                            }
                          >
                            <CheckCircle className="w-3 h-3 mr-1" />
                            Aprobar
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            className="text-red-600 border-red-600"
                            onClick={() =>
                              handleDocumentApproval(
                                "fiscalRegistry",
                                "rejected",
                              )
                            }
                          >
                            <XCircle className="w-3 h-3 mr-1" />
                            Rechazar
                          </Button>
                        </>
                      )}
                    </div>
                  </div>

                  {/* Certifications */}
                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center space-x-3">
                      <FileText className="w-5 h-5 text-zlc-darkblue" />
                      <div>
                        <p className="font-medium">Certificaciones</p>
                        <p className="text-sm text-muted-foreground">
                          {selectedCompany.documents.certifications.comment}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      {getDocumentStatus(
                        selectedCompany.documents.certifications,
                      )}
                      {selectedCompany.documents.certifications.uploaded && (
                        <>
                          <Button size="sm" variant="outline">
                            <Download className="w-3 h-3 mr-1" />
                            Ver
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            className="text-green-600 border-green-600"
                            onClick={() =>
                              handleDocumentApproval(
                                "certifications",
                                "approved",
                              )
                            }
                          >
                            <CheckCircle className="w-3 h-3 mr-1" />
                            Aprobar
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            className="text-red-600 border-red-600"
                            onClick={() =>
                              handleDocumentApproval(
                                "certifications",
                                "rejected",
                              )
                            }
                          >
                            <XCircle className="w-3 h-3 mr-1" />
                            Rechazar
                          </Button>
                        </>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Background Validation */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Shield className="w-5 h-5" />
                    Validación de Antecedentes
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="background-search">
                      Consultar registros oficiales
                    </Label>
                    <div className="flex space-x-2">
                      <Input
                        id="background-search"
                        placeholder="Ingresa RUC/NIT para consultar..."
                        value={backgroundSearchTerm}
                        onChange={(e) =>
                          setBackgroundSearchTerm(e.target.value)
                        }
                      />
                      <Button
                        onClick={handleBackgroundValidation}
                        className="bg-zlc-darkblue hover:bg-zlc-navy"
                      >
                        <Search className="w-4 h-4 mr-1" />
                        Buscar
                      </Button>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="legal-existence"
                        checked={legalExistenceChecked}
                        onCheckedChange={(checked) =>
                          setLegalExistenceChecked(checked as boolean)
                        }
                      />
                      <Label htmlFor="legal-existence">
                        Confirmación de existencia legal de la empresa
                      </Label>
                    </div>

                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="representative-valid"
                        checked={representativeValidChecked}
                        onCheckedChange={(checked) =>
                          setRepresentativeValidChecked(checked as boolean)
                        }
                      />
                      <Label htmlFor="representative-valid">
                        Validez del representante legal
                      </Label>
                    </div>
                  </div>

                  {selectedCompany.backgroundCheck.comment && (
                    <div className="p-3 bg-muted rounded-lg">
                      <Label className="text-sm font-medium">
                        Comentario anterior:
                      </Label>
                      <p className="text-sm text-muted-foreground mt-1">
                        {selectedCompany.backgroundCheck.comment}
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Comments */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">
                    Comentarios de Verificación
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <Textarea
                    placeholder="Añade comentarios sobre la verificación..."
                    value={verificationComments}
                    onChange={(e) => setVerificationComments(e.target.value)}
                    className="min-h-[100px]"
                  />
                </CardContent>
              </Card>
            </div>
          )}

          <DialogFooter className="flex justify-between">
            <div className="flex space-x-2">
              <Button
                variant="outline"
                onClick={() => setShowVerificationDialog(false)}
              >
                Cancelar
              </Button>
            </div>
            <div className="flex space-x-2">
              <Button
                variant="destructive"
                onClick={handleRejectCompany}
                className="flex items-center gap-2"
              >
                <XCircle className="w-4 h-4" />
                Rechazar Solicitud
              </Button>
              <Button
                onClick={handleVerifyCompany}
                className="bg-green-600 hover:bg-green-700 flex items-center gap-2"
              >
                <CheckCircle className="w-4 h-4" />
                Verificar Empresa
              </Button>
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
