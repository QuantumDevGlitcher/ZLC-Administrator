import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
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
  FileText,
  CheckCircle,
  XCircle,
  Clock,
  AlertTriangle,
  Eye,
  Download,
  Filter,
  Calendar,
  Building,
  Ship,
  Upload,
  Edit,
  Save,
  FileSpreadsheet,
  ScrollText,
  Gavel,
  Plus,
  Trash2,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { apiClient } from "@/lib/api-client";
import { useToast } from "@/hooks/use-toast";

interface ProformaOrder {
  id: string;
  poNumber: string;
  supplier: string;
  date: string;
  documentStatus: "pending" | "partial" | "complete" | "rejected";
  documents: {
    commercialInvoice: {
      uploaded: boolean;
      status?: "approved" | "rejected" | "pending";
      comment?: string;
      url?: string;
    };
    packingList: {
      uploaded: boolean;
      status?: "approved" | "rejected" | "pending";
      comment?: string;
      url?: string;
    };
    billOfLading: {
      uploaded: boolean;
      status?: "approved" | "rejected" | "pending";
      comment?: string;
      url?: string;
    };
    certificateOfOrigin: {
      uploaded: boolean;
      status?: "approved" | "rejected" | "pending";
      comment?: string;
      url?: string;
    };
  };
}

interface Template {
  id: string;
  name: string;
  type: "instruction_letter" | "packing_list";
  uploadDate: string;
  url: string;
}

export default function Aduana() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedOrder, setSelectedOrder] = useState<ProformaOrder | null>(
    null,
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();
  const [showOrderDialog, setShowOrderDialog] = useState(false);
  const [showLegalUpdatesDialog, setShowLegalUpdatesDialog] = useState(false);
  const [showTemplateUploadDialog, setShowTemplateUploadDialog] =
    useState(false);
  const [rejectionComment, setRejectionComment] = useState("");
  const [selectedDocument, setSelectedDocument] = useState<string>("");
  const [zlcCustomsContent, setZlcCustomsContent] = useState(
    "Regulaciones aduaneras vigentes para ZLC Express. Todos los documentos deben cumplir con las normativas internacionales de comercio exterior...",
  );
  const [isEditingCustoms, setIsEditingCustoms] = useState(false);
  const [newTemplateName, setNewTemplateName] = useState("");
  const [newTemplateType, setNewTemplateType] = useState<
    "instruction_letter" | "packing_list"
  >("instruction_letter");
  const navigate = useNavigate();

  const handleLogout = () => {
    navigate("/");
  };

  // Estados para datos del backend
  const [orders, setOrders] = useState<ProformaOrder[]>([]);

  // Cargar datos del backend al montar el componente
  useEffect(() => {
    loadAduanaData();
  }, []);

  const loadAduanaData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Cargar órdenes (usando documentos del backend como base)
      const documentosResponse = await apiClient.getAduanaDocumentos();
      console.log('Respuesta documentos aduana:', documentosResponse);
      
      let documentosData = [];
      if (documentosResponse && documentosResponse.data && documentosResponse.data.documentos) {
        documentosData = documentosResponse.data.documentos;
      } else if (Array.isArray(documentosResponse)) {
        documentosData = documentosResponse;
      }

      if (documentosData.length > 0) {
        // Mapear los documentos del backend a órdenes proforma
        const mappedOrders: ProformaOrder[] = documentosData.map((documento: any) => ({
          id: documento.id,
          poNumber: documento.numeroDocumento,
          supplier: documento.importador?.nombre || documento.exportador?.nombre || 'Proveedor',
          date: new Date(documento.fechaCreacion).toISOString().split('T')[0],
          documentStatus: mapDocumentStatusToOrderStatus(documento.estado),
          documents: {
            commercialInvoice: {
              uploaded: documento.documentosAdjuntos?.some((doc: any) => doc.tipo === 'FACTURA') || false,
              status: documento.estado === 'APROBADO' ? 'approved' : documento.estado === 'RECHAZADO' ? 'rejected' : 'pending'
            },
            packingList: {
              uploaded: documento.documentosAdjuntos?.some((doc: any) => doc.tipo === 'LISTA_EMPAQUE') || false,
              status: documento.estado === 'APROBADO' ? 'approved' : documento.estado === 'RECHAZADO' ? 'rejected' : 'pending'
            },
            billOfLading: {
              uploaded: documento.tipo === 'MANIFIESTO' || Math.random() > 0.5, // Simular algunos con conocimiento de embarque
              status: documento.estado === 'APROBADO' ? 'approved' : documento.estado === 'RECHAZADO' ? 'rejected' : 'pending'
            },
            certificateOfOrigin: {
              uploaded: documento.documentosAdjuntos?.some((doc: any) => doc.tipo === 'CERTIFICADO') || Math.random() > 0.3,
              status: documento.estado === 'APROBADO' ? 'approved' : documento.estado === 'RECHAZADO' ? 'rejected' : 'pending'
            }
          }
        }));
        setOrders(mappedOrders);
        console.log('Órdenes mapeadas:', mappedOrders);
      }

      // Cargar plantillas del backend
      const plantillasResponse = await apiClient.getPlantillas();
      console.log('Respuesta plantillas:', plantillasResponse);
      
      let plantillasData = [];
      if (plantillasResponse && plantillasResponse.data && plantillasResponse.data.plantillas) {
        plantillasData = plantillasResponse.data.plantillas;
      } else if (Array.isArray(plantillasResponse)) {
        plantillasData = plantillasResponse;
      }

      if (plantillasData.length > 0) {
        // Mapear las plantillas del backend
        const mappedTemplates: Template[] = plantillasData.map((plantilla: any) => ({
          id: plantilla.id,
          name: plantilla.nombre,
          type: plantilla.tipo,
          uploadDate: new Date(plantilla.fechaSubida).toISOString().split('T')[0],
          url: plantilla.url,
        }));
        setTemplates(mappedTemplates);
        console.log('Plantillas mapeadas:', mappedTemplates);
      }

      // Cargar regulaciones del backend
      const regulacionesResponse = await apiClient.getRegulaciones();
      console.log('Respuesta regulaciones:', regulacionesResponse);
      
      if (regulacionesResponse && regulacionesResponse.data && regulacionesResponse.data.regulaciones) {
        const regulaciones = regulacionesResponse.data.regulaciones;
        if (regulaciones.length > 0) {
          setZlcCustomsContent(regulaciones[0].contenido);
        }
      }

    } catch (err) {
      console.error('Error cargando datos de aduana:', err);
      setError(err instanceof Error ? err.message : 'Error al cargar datos de aduana');
      toast({
        title: "Error",
        description: "No se pudieron cargar los datos de aduana",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  // Función auxiliar para mapear estados
  const mapDocumentStatusToOrderStatus = (estado: string): ProformaOrder['documentStatus'] => {
    switch (estado) {
      case 'APROBADO':
      case 'FINALIZADO':
        return 'complete';
      case 'RECHAZADO':
        return 'rejected';
      case 'EN_PROCESO':
        return 'partial';
      case 'PENDIENTE':
      default:
        return 'pending';
    }
  };

  // Mock data for demonstration - REEMPLAZADO POR DATOS DEL BACKEND
  /*const [orders, setOrders] = useState<ProformaOrder[]>([
    {
      id: "PO-001",
      poNumber: "PO-2024-001",
      supplier: "Global Electronics Ltd",
      date: "2024-01-15",
      documentStatus: "pending",
      documents: {
        commercialInvoice: { uploaded: true, status: "pending" },
        packingList: { uploaded: true, status: "approved" },
        billOfLading: { uploaded: false },
        certificateOfOrigin: { uploaded: true, status: "pending" },
      },
    },
    {
      id: "PO-002",
      poNumber: "PO-2024-002",
      supplier: "Fashion International SA",
      date: "2024-01-12",
      documentStatus: "complete",
      documents: {
        commercialInvoice: { uploaded: true, status: "approved" },
        packingList: { uploaded: true, status: "approved" },
        billOfLading: { uploaded: true, status: "approved" },
        certificateOfOrigin: { uploaded: true, status: "approved" },
      },
    },
    {
      id: "PO-003",
      poNumber: "PO-2024-003",
      supplier: "Tech Solutions Corp",
      date: "2024-01-10",
      documentStatus: "rejected",
      documents: {
        commercialInvoice: {
          uploaded: true,
          status: "rejected",
          comment: "Información de precios incompleta",
        },
        packingList: { uploaded: true, status: "approved" },
        billOfLading: { uploaded: false },
        certificateOfOrigin: {
          uploaded: true,
          status: "rejected",
          comment: "Certificado vencido",
        },
      },
    },
    {
      id: "PO-004",
      poNumber: "PO-2024-004",
      supplier: "Automotive Parts Inc",
      date: "2024-01-08",
      documentStatus: "partial",
      documents: {
        commercialInvoice: { uploaded: true, status: "approved" },
        packingList: { uploaded: true, status: "approved" },
        billOfLading: { uploaded: true, status: "pending" },
        certificateOfOrigin: { uploaded: false },
      },
    },
  ]);*/

  const [templates, setTemplates] = useState<Template[]>([
    {
      id: "TEMP-001",
      name: "Carta de Instrucciones Estándar",
      type: "instruction_letter",
      uploadDate: "2024-01-01",
      url: "/templates/instruction-letter-standard.pdf",
    },
    {
      id: "TEMP-002",
      name: "Packing List Actualizado 2024",
      type: "packing_list",
      uploadDate: "2024-01-05",
      url: "/templates/packing-list-2024.xlsx",
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
      case "partial":
        return (
          <Badge variant="secondary" className="bg-blue-100 text-blue-800">
            <AlertTriangle className="w-3 h-3 mr-1" />
            Parcial
          </Badge>
        );
      case "complete":
        return (
          <Badge variant="secondary" className="bg-green-100 text-green-800">
            <CheckCircle className="w-3 h-3 mr-1" />
            Completo
          </Badge>
        );
      case "rejected":
        return (
          <Badge variant="secondary" className="bg-red-100 text-red-800">
            <XCircle className="w-3 h-3 mr-1" />
            Rechazado
          </Badge>
        );
      default:
        return null;
    }
  };

  const getDocumentStatusBadge = (status?: string) => {
    switch (status) {
      case "approved":
        return (
          <Badge variant="secondary" className="bg-green-100 text-green-800">
            Aprobado
          </Badge>
        );
      case "rejected":
        return (
          <Badge variant="secondary" className="bg-red-100 text-red-800">
            Rechazado
          </Badge>
        );
      case "pending":
        return (
          <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">
            Pendiente
          </Badge>
        );
      default:
        return (
          <Badge variant="secondary" className="bg-gray-100 text-gray-800">
            No subido
          </Badge>
        );
    }
  };

  const filteredOrders = orders.filter((order) => {
    const matchesSearch =
      order.poNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.supplier.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus =
      statusFilter === "all" || order.documentStatus === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const openOrderDetails = (order: ProformaOrder) => {
    setSelectedOrder(order);
    setShowOrderDialog(true);
  };

  const handleDocumentApproval = async (
    docType: keyof ProformaOrder["documents"],
    action: "approve" | "reject",
  ) => {
    if (!selectedOrder) return;

    if (action === "reject" && !rejectionComment.trim()) {
      alert("Debe proporcionar un comentario para rechazar el documento.");
      return;
    }

    try {
      setLoading(true);
      
      // Llamar a la API del backend para aprobar o rechazar documento
      if (action === "approve") {
        await apiClient.aprobarDocumentoOrden(selectedOrder.id, docType);
      } else {
        await apiClient.rechazarDocumentoOrden(selectedOrder.id, docType, rejectionComment);
      }

      // Recargar los datos después de la operación
      await loadAduanaData();
      
      toast({
        title: "Documento actualizado",
        description: `Documento ${docType} ${action === "approve" ? "aprobado" : "rechazado"} correctamente`,
      });

      setRejectionComment("");
      setSelectedDocument("");

    } catch (err) {
      console.error('Error actualizando documento:', err);
      toast({
        title: "Error",
        description: `No se pudo ${action === "approve" ? "aprobar" : "rechazar"} el documento`,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSaveCustomsContent = async () => {
    try {
      setLoading(true);
      
      await apiClient.updateRegulacion('REG-001', zlcCustomsContent);
      
      setIsEditingCustoms(false);
      toast({
        title: "Regulaciones actualizadas",
        description: "El contenido de Aduana ZLC ha sido actualizado correctamente",
      });

    } catch (err) {
      console.error('Error actualizando regulaciones:', err);
      toast({
        title: "Error",
        description: "No se pudo actualizar el contenido de regulaciones",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleUploadTemplate = async () => {
    if (!newTemplateName.trim()) {
      toast({
        title: "Error",
        description: "Debe proporcionar un nombre para la plantilla",
        variant: "destructive",
      });
      return;
    }

    try {
      setLoading(true);
      
      const templateData = {
        nombre: newTemplateName,
        tipo: newTemplateType,
        descripcion: `Plantilla de ${newTemplateType === 'packing_list' ? 'lista de empaque' : 'carta de instrucciones'}`
      };

      const response = await apiClient.createPlantilla(templateData);
      
      if (response && response.data) {
        // Recargar plantillas
        await loadAduanaData();
        
        setNewTemplateName("");
        setShowTemplateUploadDialog(false);
        
        toast({
          title: "Plantilla subida",
          description: "La plantilla ha sido subida correctamente",
        });
      }

    } catch (err) {
      console.error('Error subiendo plantilla:', err);
      toast({
        title: "Error",
        description: "No se pudo subir la plantilla",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteTemplate = async (templateId: string) => {
    try {
      setLoading(true);
      
      await apiClient.deletePlantilla(templateId);
      
      // Recargar plantillas
      await loadAduanaData();
      
      toast({
        title: "Plantilla eliminada",
        description: "La plantilla ha sido eliminada correctamente",
      });

    } catch (err) {
      console.error('Error eliminando plantilla:', err);
      toast({
        title: "Error",
        description: "No se pudo eliminar la plantilla",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const documentNames = {
    commercialInvoice: "Factura Comercial",
    packingList: "Packing List Definitivo",
    billOfLading: "Bill of Lading (BL)",
    certificateOfOrigin: "Certificado de Origen",
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-zlc-darkblue text-zlc-darkblue-foreground shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-4">
              <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center">
                <Gavel className="w-6 h-6 text-zlc-darkblue" />
              </div>
              <div>
                <h1 className="text-xl font-bold">Documentación Aduanera</h1>
                <p className="text-zlc-darkblue-foreground/80 text-sm">
                  Inspector Aduanero
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                onClick={() => setShowLegalUpdatesDialog(true)}
                className="text-zlc-darkblue-foreground hover:bg-zlc-navy"
              >
                <ScrollText className="w-4 h-4 mr-2" />
                Actualizaciones Legales
              </Button>
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
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-zlc-darkblue mb-2">
            Revisión por Orden Proforma
          </h2>
          <p className="text-muted-foreground">
            Revisa y aprueba la documentación aduanera de las órdenes proforma
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
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="search">Buscar orden</Label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                  <Input
                    id="search"
                    placeholder="Nº PO o proveedor..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>

              <div>
                <Label>Estado Documental</Label>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="Todos los estados" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos</SelectItem>
                    <SelectItem value="pending">Pendiente</SelectItem>
                    <SelectItem value="partial">Parcial</SelectItem>
                    <SelectItem value="complete">Completo</SelectItem>
                    <SelectItem value="rejected">Rechazado</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div className="mt-4 flex gap-2">
              <Button onClick={loadAduanaData} disabled={loading} variant="outline">
                {loading ? "Cargando..." : "Actualizar Datos"}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Órdenes Pendientes
              </CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-zlc-darkblue">
                {orders.filter((o) => o.documentStatus === "pending").length}
              </div>
              <p className="text-xs text-muted-foreground">
                Requieren revisión
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Parciales</CardTitle>
              <AlertTriangle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">
                {orders.filter((o) => o.documentStatus === "partial").length}
              </div>
              <p className="text-xs text-muted-foreground">
                Documentos pendientes
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Completas</CardTitle>
              <CheckCircle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">
                {orders.filter((o) => o.documentStatus === "complete").length}
              </div>
              <p className="text-xs text-muted-foreground">Listas para envío</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Rechazadas</CardTitle>
              <XCircle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">
                {orders.filter((o) => o.documentStatus === "rejected").length}
              </div>
              <p className="text-xs text-muted-foreground">
                Requieren corrección
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Orders Table */}
        <Card>
          <CardHeader>
            <CardTitle>Lista de Órdenes Proforma</CardTitle>
            <CardDescription>
              Órdenes registradas para revisión documental (
              {filteredOrders.length} resultados)
            </CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex justify-center items-center py-8">
                <div className="text-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-zlc-darkblue mx-auto"></div>
                  <p className="mt-2 text-sm text-muted-foreground">Cargando datos...</p>
                </div>
              </div>
            ) : error ? (
              <div className="flex justify-center items-center py-8">
                <div className="text-center text-red-600">
                  <p>Error al cargar datos: {error}</p>
                  <Button onClick={loadAduanaData} variant="outline" className="mt-2">
                    Reintentar
                  </Button>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                {filteredOrders.map((order) => (
                <div
                  key={order.id}
                  className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                >
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-zlc-darkblue/10 rounded-lg flex items-center justify-center">
                      <FileText className="w-6 h-6 text-zlc-darkblue" />
                    </div>
                    <div className="space-y-1">
                      <p className="font-medium">{order.poNumber}</p>
                      <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                        <span className="flex items-center">
                          <Building className="w-3 h-3 mr-1" />
                          {order.supplier}
                        </span>
                        <span className="flex items-center">
                          <Calendar className="w-3 h-3 mr-1" />
                          {order.date}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    {getStatusBadge(order.documentStatus)}
                    <Button
                      size="sm"
                      onClick={() => openOrderDetails(order)}
                      className="bg-zlc-darkblue hover:bg-zlc-navy"
                    >
                      <Eye className="w-4 h-4 mr-1" />
                      Revisar
                    </Button>
                  </div>
                </div>
              ))}
              </div>
            )}
          </CardContent>
        </Card>
      </main>

      {/* Order Details Dialog */}
      <Dialog open={showOrderDialog} onOpenChange={setShowOrderDialog}>
        <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <FileText className="w-5 h-5" />
              Revisión Documental: {selectedOrder?.poNumber}
            </DialogTitle>
            <DialogDescription>
              Revisa y aprueba cada documento individualmente
            </DialogDescription>
          </DialogHeader>

          {selectedOrder && (
            <div className="space-y-6">
              {/* Order Info */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">
                    Información de la Orden
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <Label className="text-sm font-medium">Nº PO</Label>
                      <p className="text-sm">{selectedOrder.poNumber}</p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium">Proveedor</Label>
                      <p className="text-sm">{selectedOrder.supplier}</p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium">Fecha</Label>
                      <p className="text-sm">{selectedOrder.date}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Documents Review */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">
                    Documentos para Revisión
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {Object.entries(selectedOrder.documents).map(
                    ([docKey, docData]) => (
                      <div
                        key={docKey}
                        className="flex items-center justify-between p-4 border rounded-lg"
                      >
                        <div className="flex items-center space-x-4">
                          <div className="w-10 h-10 bg-zlc-darkblue/10 rounded-lg flex items-center justify-center">
                            {docKey === "billOfLading" ? (
                              <Ship className="w-5 h-5 text-zlc-darkblue" />
                            ) : (
                              <FileText className="w-5 h-5 text-zlc-darkblue" />
                            )}
                          </div>
                          <div>
                            <p className="font-medium">
                              {
                                documentNames[
                                  docKey as keyof typeof documentNames
                                ]
                              }
                            </p>
                            {docData.comment && (
                              <p className="text-sm text-red-600">
                                {docData.comment}
                              </p>
                            )}
                          </div>
                        </div>
                        <div className="flex items-center space-x-3">
                          {getDocumentStatusBadge(
                            docData.uploaded ? docData.status : undefined,
                          )}
                          {docData.uploaded && (
                            <>
                              <Button 
                                size="sm" 
                                variant="outline"
                                onClick={() => {
                                  const docName = documentNames[docKey as keyof typeof documentNames];
                                  toast({
                                    title: "Abriendo documento",
                                    description: `Visualizando ${docName}...`,
                                  });
                                  // Simular apertura de documento
                                  window.open('#', '_blank');
                                }}
                              >
                                <Download className="w-3 h-3 mr-1" />
                                Ver
                              </Button>
                              {docData.status !== "approved" && (
                                <Button
                                  size="sm"
                                  className="bg-green-600 hover:bg-green-700"
                                  onClick={() =>
                                    handleDocumentApproval(
                                      docKey as keyof ProformaOrder["documents"],
                                      "approve",
                                    )
                                  }
                                >
                                  <CheckCircle className="w-3 h-3 mr-1" />
                                  Aprobar
                                </Button>
                              )}
                              {docData.status !== "rejected" && (
                                <Button
                                  size="sm"
                                  variant="destructive"
                                  onClick={() => {
                                    setSelectedDocument(docKey);
                                    setRejectionComment(docData.comment || "");
                                  }}
                                >
                                  <XCircle className="w-3 h-3 mr-1" />
                                  Rechazar
                                </Button>
                              )}
                            </>
                          )}
                        </div>
                      </div>
                    ),
                  )}
                </CardContent>
              </Card>

              {/* Rejection Comment */}
              {selectedDocument && (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg text-red-600">
                      Comentario de Rechazo
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <Textarea
                      placeholder="Especifica el motivo del rechazo..."
                      value={rejectionComment}
                      onChange={(e) => setRejectionComment(e.target.value)}
                      className="min-h-[100px]"
                    />
                    <div className="flex space-x-2">
                      <Button
                        onClick={() =>
                          handleDocumentApproval(
                            selectedDocument as keyof ProformaOrder["documents"],
                            "reject",
                          )
                        }
                        variant="destructive"
                      >
                        Confirmar Rechazo
                      </Button>
                      <Button
                        variant="outline"
                        onClick={() => setSelectedDocument("")}
                      >
                        Cancelar
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowOrderDialog(false)}>
              Cerrar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Legal Updates Dialog */}
      <Dialog
        open={showLegalUpdatesDialog}
        onOpenChange={setShowLegalUpdatesDialog}
      >
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <ScrollText className="w-5 h-5" />
              Panel de Actualizaciones Legales
            </DialogTitle>
            <DialogDescription>
              Gestiona la sección Aduana ZLC y plantillas descargables
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-6">
            {/* ZLC Customs Section */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center justify-between">
                  Sección "Aduana ZLC"
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setIsEditingCustoms(!isEditingCustoms)}
                  >
                    {isEditingCustoms ? (
                      <Save className="w-4 h-4 mr-1" />
                    ) : (
                      <Edit className="w-4 h-4 mr-1" />
                    )}
                    {isEditingCustoms ? "Guardar" : "Editar"}
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent>
                {isEditingCustoms ? (
                  <div className="space-y-4">
                    <Textarea
                      value={zlcCustomsContent}
                      onChange={(e) => setZlcCustomsContent(e.target.value)}
                      className="min-h-[200px]"
                    />
                    <div className="flex space-x-2">
                      <Button onClick={handleSaveCustomsContent}>
                        <Save className="w-4 h-4 mr-1" />
                        Guardar Cambios
                      </Button>
                      <Button
                        variant="outline"
                        onClick={() => setIsEditingCustoms(false)}
                      >
                        Cancelar
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="p-4 bg-muted rounded-lg">
                    <p className="text-sm whitespace-pre-wrap">
                      {zlcCustomsContent}
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Templates Section */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center justify-between">
                  Plantillas Descargables
                  <Button
                    onClick={() => setShowTemplateUploadDialog(true)}
                    className="bg-zlc-darkblue hover:bg-zlc-navy"
                  >
                    <Plus className="w-4 h-4 mr-1" />
                    Nueva Plantilla
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {templates.map((template) => (
                    <div
                      key={template.id}
                      className="flex items-center justify-between p-3 border rounded-lg"
                    >
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-zlc-darkblue/10 rounded-lg flex items-center justify-center">
                          {template.type === "packing_list" ? (
                            <FileSpreadsheet className="w-4 h-4 text-zlc-darkblue" />
                          ) : (
                            <FileText className="w-4 h-4 text-zlc-darkblue" />
                          )}
                        </div>
                        <div>
                          <p className="font-medium">{template.name}</p>
                          <p className="text-sm text-muted-foreground">
                            {template.type === "packing_list"
                              ? "Packing List"
                              : "Carta de Instrucciones"}{" "}
                            - {template.uploadDate}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => {
                            toast({
                              title: "Descarga iniciada",
                              description: `Descargando ${template.name}...`,
                            });
                            // Simular descarga
                            window.open(template.url, '_blank');
                          }}
                        >
                          <Download className="w-3 h-3 mr-1" />
                          Descargar
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => {
                            if (confirm("¿Está seguro de eliminar esta plantilla?")) {
                              handleDeleteTemplate(template.id);
                            }
                          }}
                          disabled={loading}
                        >
                          <Trash2 className="w-3 h-3" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowLegalUpdatesDialog(false)}
            >
              Cerrar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Template Upload Dialog */}
      <Dialog
        open={showTemplateUploadDialog}
        onOpenChange={setShowTemplateUploadDialog}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Upload className="w-5 h-5" />
              Subir Nueva Plantilla
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            <div>
              <Label htmlFor="template-name">Nombre de la plantilla</Label>
              <Input
                id="template-name"
                placeholder="Ej: Carta de Instrucciones Actualizada"
                value={newTemplateName}
                onChange={(e) => setNewTemplateName(e.target.value)}
              />
            </div>

            <div>
              <Label>Tipo de plantilla</Label>
              <Select
                value={newTemplateType}
                onValueChange={(value) =>
                  setNewTemplateType(
                    value as "instruction_letter" | "packing_list",
                  )
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="instruction_letter">
                    Carta de Instrucciones
                  </SelectItem>
                  <SelectItem value="packing_list">
                    Packing List Actualizado
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="border-2 border-dashed border-muted rounded-lg p-8 text-center">
              <Upload className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-sm text-muted-foreground">
                Arrastra y suelta el archivo aquí o haz clic para seleccionar
              </p>
              <Button variant="outline" className="mt-2">
                Seleccionar Archivo
              </Button>
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowTemplateUploadDialog(false)}
            >
              Cancelar
            </Button>
            <Button onClick={handleUploadTemplate}>Subir Plantilla</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
