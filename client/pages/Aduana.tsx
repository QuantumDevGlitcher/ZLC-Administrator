import { useState } from "react";
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

  // Mock data for demonstration
  const [orders, setOrders] = useState<ProformaOrder[]>([
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
  ]);

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

  const handleDocumentApproval = (
    docType: keyof ProformaOrder["documents"],
    action: "approve" | "reject",
  ) => {
    if (!selectedOrder) return;

    if (action === "reject" && !rejectionComment.trim()) {
      alert("Debe proporcionar un comentario para rechazar el documento.");
      return;
    }

    const updatedOrder = {
      ...selectedOrder,
      documents: {
        ...selectedOrder.documents,
        [docType]: {
          ...selectedOrder.documents[docType],
          status: action === "approve" ? "approved" : "rejected",
          comment: action === "reject" ? rejectionComment : undefined,
        },
      },
    };

    // Update document status based on all documents
    const allDocs = Object.values(updatedOrder.documents);
    const uploadedDocs = allDocs.filter((doc) => doc.uploaded);
    const approvedDocs = uploadedDocs.filter(
      (doc) => doc.status === "approved",
    );
    const rejectedDocs = uploadedDocs.filter(
      (doc) => doc.status === "rejected",
    );

    if (rejectedDocs.length > 0) {
      updatedOrder.documentStatus = "rejected";
    } else if (approvedDocs.length === 4) {
      updatedOrder.documentStatus = "complete";
    } else if (approvedDocs.length > 0) {
      updatedOrder.documentStatus = "partial";
    } else {
      updatedOrder.documentStatus = "pending";
    }

    setOrders(
      orders.map((o) => (o.id === selectedOrder.id ? updatedOrder : o)),
    );
    setSelectedOrder(updatedOrder);
    setRejectionComment("");
    setSelectedDocument("");

    const actionText = action === "approve" ? "aprobado" : "rechazado";
    alert(`Documento ${docType} ${actionText} correctamente.`);
  };

  const handleSaveCustomsContent = () => {
    setIsEditingCustoms(false);
    alert("Contenido de Aduana ZLC actualizado correctamente.");
  };

  const handleUploadTemplate = () => {
    if (!newTemplateName.trim()) {
      alert("Debe proporcionar un nombre para la plantilla.");
      return;
    }

    const newTemplate: Template = {
      id: `TEMP-${Date.now()}`,
      name: newTemplateName,
      type: newTemplateType,
      uploadDate: new Date().toISOString().split("T")[0],
      url: `/templates/${newTemplateName.toLowerCase().replace(/\s+/g, "-")}.${
        newTemplateType === "packing_list" ? "xlsx" : "pdf"
      }`,
    };

    setTemplates([...templates, newTemplate]);
    setNewTemplateName("");
    setShowTemplateUploadDialog(false);
    alert("Plantilla subida correctamente.");
  };

  const handleDeleteTemplate = (templateId: string) => {
    if (confirm("¿Está seguro de eliminar esta plantilla?")) {
      setTemplates(templates.filter((t) => t.id !== templateId));
      alert("Plantilla eliminada correctamente.");
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
                              <Button size="sm" variant="outline">
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
                        <Button size="sm" variant="outline">
                          <Download className="w-3 h-3 mr-1" />
                          Descargar
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => handleDeleteTemplate(template.id)}
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
