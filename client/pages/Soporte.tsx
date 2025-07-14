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
  Headphones,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Clock,
  Eye,
  Upload,
  Filter,
  Calendar,
  Building,
  User,
  MessageSquare,
  Paperclip,
  Bell,
  RotateCcw,
  Send,
  Plus,
  FileText,
  Image,
  Download,
  Archive,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

interface SupportTicket {
  id: string;
  incidentType: string;
  linkedOrder: string;
  status: "open" | "in_progress" | "resolved" | "closed";
  responsible: string;
  responsibleType: "logistics" | "customs" | "quality" | "unassigned";
  priority: "low" | "medium" | "high" | "urgent";
  reporter: string;
  reporterType: "supplier" | "buyer";
  subject: string;
  description: string;
  createdDate: string;
  lastUpdated: string;
  responses: TicketResponse[];
  evidence: Evidence[];
  escalated: boolean;
  escalationDate?: string;
}

interface TicketResponse {
  id: string;
  author: string;
  authorType: "support" | "inspector" | "client";
  message: string;
  timestamp: string;
  attachments: string[];
}

interface Evidence {
  id: string;
  name: string;
  type: "image" | "pdf" | "document";
  url: string;
  uploadedBy: string;
  uploadedDate: string;
}

export default function Soporte() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [priorityFilter, setPriorityFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");
  const [selectedTicket, setSelectedTicket] = useState<SupportTicket | null>(
    null,
  );
  const [showTicketDialog, setShowTicketDialog] = useState(false);
  const [showAssignDialog, setShowAssignDialog] = useState(false);
  const [showEvidenceDialog, setShowEvidenceDialog] = useState(false);
  const [assignmentType, setAssignmentType] = useState<
    "logistics" | "customs" | "quality"
  >("logistics");
  const [assignmentComment, setAssignmentComment] = useState("");
  const [responseMessage, setResponseMessage] = useState("");
  const [selectedInspector, setSelectedInspector] = useState("");
  const navigate = useNavigate();

  const handleLogout = () => {
    navigate("/");
  };

  // Mock data for demonstration
  const [tickets, setTickets] = useState<SupportTicket[]>([
    {
      id: "TICK-001",
      incidentType: "Documentación Incorrecta",
      linkedOrder: "PO-2024-001",
      status: "open",
      responsible: "No asignado",
      responsibleType: "unassigned",
      priority: "high",
      reporter: "Electronics Global Ltd",
      reporterType: "supplier",
      subject: "Documentos de importación rechazados",
      description:
        "Los documentos de importación fueron rechazados por aduana. Necesitamos revisar el certificado de origen.",
      createdDate: "2024-01-15",
      lastUpdated: "2024-01-15",
      responses: [
        {
          id: "RESP-001",
          author: "Electronics Global Ltd",
          authorType: "client",
          message:
            "Los documentos de importación fueron rechazados por aduana. Necesitamos revisar el certificado de origen.",
          timestamp: "2024-01-15 09:30",
          attachments: ["certificate_rejection.pdf"],
        },
      ],
      evidence: [
        {
          id: "EVD-001",
          name: "certificate_rejection.pdf",
          type: "pdf",
          url: "/evidence/certificate_rejection.pdf",
          uploadedBy: "Electronics Global Ltd",
          uploadedDate: "2024-01-15",
        },
      ],
      escalated: false,
    },
    {
      id: "TICK-002",
      incidentType: "Retraso en Embarque",
      linkedOrder: "PO-2024-002",
      status: "in_progress",
      responsible: "Inspector Logístico - Juan Pérez",
      responsibleType: "logistics",
      priority: "medium",
      reporter: "Fashion International SA",
      reporterType: "buyer",
      subject: "Contenedor no zarpó en fecha programada",
      description:
        "El contenedor MSKU-789012-3 no zarpó en la fecha programada del 20 de enero.",
      createdDate: "2024-01-12",
      lastUpdated: "2024-01-13",
      responses: [
        {
          id: "RESP-002",
          author: "Fashion International SA",
          authorType: "client",
          message:
            "El contenedor MSKU-789012-3 no zarpó en la fecha programada del 20 de enero.",
          timestamp: "2024-01-12 14:20",
          attachments: [],
        },
        {
          id: "RESP-003",
          author: "Juan Pérez",
          authorType: "inspector",
          message:
            "Se está coordinando con la naviera para reprogramar el embarque. Tendremos actualización mañana.",
          timestamp: "2024-01-13 10:15",
          attachments: [],
        },
      ],
      evidence: [],
      escalated: false,
    },
    {
      id: "TICK-003",
      incidentType: "Problema de Calidad",
      linkedOrder: "LOT-2024-003",
      status: "resolved",
      responsible: "Inspector Calidad - María García",
      responsibleType: "quality",
      priority: "urgent",
      reporter: "Food Express SAC",
      reporterType: "supplier",
      subject: "Lote rechazado por falta de documentación",
      description:
        "El lote LOT-2024-003 fue rechazado por falta de fotos del interior de las cajas.",
      createdDate: "2024-01-10",
      lastUpdated: "2024-01-14",
      responses: [
        {
          id: "RESP-004",
          author: "Food Express SAC",
          authorType: "client",
          message:
            "El lote LOT-2024-003 fue rechazado por falta de fotos del interior de las cajas.",
          timestamp: "2024-01-10 16:45",
          attachments: [],
        },
        {
          id: "RESP-005",
          author: "María García",
          authorType: "inspector",
          message:
            "Se requieren fotos adicionales del interior de las cajas para completar la inspección.",
          timestamp: "2024-01-11 09:30",
          attachments: [],
        },
        {
          id: "RESP-006",
          author: "Food Express SAC",
          authorType: "client",
          message: "Fotos adicionales subidas. Por favor revisar.",
          timestamp: "2024-01-14 11:20",
          attachments: ["interior_boxes_01.jpg", "interior_boxes_02.jpg"],
        },
        {
          id: "RESP-007",
          author: "María García",
          authorType: "inspector",
          message: "Fotos revisadas y aprobadas. Lote aprobado.",
          timestamp: "2024-01-14 15:30",
          attachments: [],
        },
      ],
      evidence: [
        {
          id: "EVD-002",
          name: "interior_boxes_01.jpg",
          type: "image",
          url: "/evidence/interior_boxes_01.jpg",
          uploadedBy: "Food Express SAC",
          uploadedDate: "2024-01-14",
        },
        {
          id: "EVD-003",
          name: "interior_boxes_02.jpg",
          type: "image",
          url: "/evidence/interior_boxes_02.jpg",
          uploadedBy: "Food Express SAC",
          uploadedDate: "2024-01-14",
        },
      ],
      escalated: true,
      escalationDate: "2024-01-12",
    },
  ]);

  const inspectors = {
    logistics: ["Juan Pérez", "Carlos Rodríguez", "Ana López"],
    customs: ["Miguel Torres", "Sofia Mendoza", "Roberto Silva"],
    quality: ["María García", "Pedro Morales", "Lucia Fernández"],
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "open":
        return (
          <Badge variant="secondary" className="bg-red-100 text-red-800">
            <AlertTriangle className="w-3 h-3 mr-1" />
            Abierto
          </Badge>
        );
      case "in_progress":
        return (
          <Badge variant="secondary" className="bg-blue-100 text-blue-800">
            <Clock className="w-3 h-3 mr-1" />
            En Proceso
          </Badge>
        );
      case "resolved":
        return (
          <Badge variant="secondary" className="bg-green-100 text-green-800">
            <CheckCircle className="w-3 h-3 mr-1" />
            Resuelto
          </Badge>
        );
      case "closed":
        return (
          <Badge variant="secondary" className="bg-gray-100 text-gray-800">
            <Archive className="w-3 h-3 mr-1" />
            Cerrado
          </Badge>
        );
      default:
        return null;
    }
  };

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case "urgent":
        return (
          <Badge className="bg-red-600 text-white">
            <AlertTriangle className="w-3 h-3 mr-1" />
            Urgente
          </Badge>
        );
      case "high":
        return (
          <Badge className="bg-orange-600 text-white">
            <AlertTriangle className="w-3 h-3 mr-1" />
            Alta
          </Badge>
        );
      case "medium":
        return (
          <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">
            Media
          </Badge>
        );
      case "low":
        return (
          <Badge variant="secondary" className="bg-green-100 text-green-800">
            Baja
          </Badge>
        );
      default:
        return null;
    }
  };

  const filteredTickets = tickets.filter((ticket) => {
    const matchesSearch =
      ticket.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ticket.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ticket.reporter.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ticket.linkedOrder.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus =
      statusFilter === "all" || ticket.status === statusFilter;
    const matchesPriority =
      priorityFilter === "all" || ticket.priority === priorityFilter;
    const matchesType =
      typeFilter === "all" || ticket.incidentType === typeFilter;

    return matchesSearch && matchesStatus && matchesPriority && matchesType;
  });

  const openTicketDetails = (ticket: SupportTicket) => {
    setSelectedTicket(ticket);
    setResponseMessage("");
    setShowTicketDialog(true);
  };

  const handleAssignTicket = () => {
    if (!selectedTicket || !selectedInspector || !assignmentComment.trim()) {
      alert("Debe seleccionar un inspector y proporcionar un comentario.");
      return;
    }

    const updatedTicket = {
      ...selectedTicket,
      status: "in_progress" as const,
      responsible: `Inspector ${getTypeLabel(assignmentType)} - ${selectedInspector}`,
      responsibleType: assignmentType,
      lastUpdated: new Date().toISOString().split("T")[0],
      responses: [
        ...selectedTicket.responses,
        {
          id: `RESP-${Date.now()}`,
          author: "Administrador de Soporte",
          authorType: "support" as const,
          message: `Ticket asignado a ${selectedInspector} (${getTypeLabel(assignmentType)}). ${assignmentComment}`,
          timestamp: new Date().toLocaleString(),
          attachments: [],
        },
      ],
    };

    setTickets(
      tickets.map((t) => (t.id === selectedTicket.id ? updatedTicket : t)),
    );
    setSelectedTicket(updatedTicket);
    setShowAssignDialog(false);
    setAssignmentComment("");
    setSelectedInspector("");

    // Mock notification
    alert(`Ticket asignado a ${selectedInspector}. Notificaciones enviadas.`);
  };

  const handleAddResponse = () => {
    if (!selectedTicket || !responseMessage.trim()) {
      alert("Debe escribir una respuesta.");
      return;
    }

    const newResponse: TicketResponse = {
      id: `RESP-${Date.now()}`,
      author: "Administrador de Soporte",
      authorType: "support",
      message: responseMessage,
      timestamp: new Date().toLocaleString(),
      attachments: [],
    };

    const updatedTicket = {
      ...selectedTicket,
      lastUpdated: new Date().toISOString().split("T")[0],
      responses: [...selectedTicket.responses, newResponse],
    };

    setTickets(
      tickets.map((t) => (t.id === selectedTicket.id ? updatedTicket : t)),
    );
    setSelectedTicket(updatedTicket);
    setResponseMessage("");

    alert("Respuesta añadida. Notificación enviada al cliente.");
  };

  const handleUpdateStatus = (newStatus: SupportTicket["status"]) => {
    if (!selectedTicket) return;

    const updatedTicket = {
      ...selectedTicket,
      status: newStatus,
      lastUpdated: new Date().toISOString().split("T")[0],
      responses: [
        ...selectedTicket.responses,
        {
          id: `RESP-${Date.now()}`,
          author: "Administrador de Soporte",
          authorType: "support" as const,
          message: `Estado cambiado a "${getStatusText(newStatus)}"`,
          timestamp: new Date().toLocaleString(),
          attachments: [],
        },
      ],
    };

    setTickets(
      tickets.map((t) => (t.id === selectedTicket.id ? updatedTicket : t)),
    );
    setSelectedTicket(updatedTicket);

    alert(
      `Estado actualizado a "${getStatusText(newStatus)}". Notificaciones enviadas.`,
    );
  };

  const handleReassignTicket = () => {
    if (!selectedTicket) return;

    const updatedTicket = {
      ...selectedTicket,
      escalated: true,
      escalationDate: new Date().toISOString().split("T")[0],
      responses: [
        ...selectedTicket.responses,
        {
          id: `RESP-${Date.now()}`,
          author: "Sistema",
          authorType: "support" as const,
          message:
            "Ticket escalado por falta de respuesta en 48h. Reasignando inspector.",
          timestamp: new Date().toLocaleString(),
          attachments: [],
        },
      ],
    };

    setTickets(
      tickets.map((t) => (t.id === selectedTicket.id ? updatedTicket : t)),
    );
    setSelectedTicket(updatedTicket);
    setShowAssignDialog(true);

    alert("Ticket escalado. Proceda a reasignar inspector.");
  };

  const handleUploadEvidence = () => {
    alert("Funcionalidad de subida de evidencias - Mock implementation");
  };

  const getTypeLabel = (type: string) => {
    const typeMap = {
      logistics: "Logístico",
      customs: "Aduanero",
      quality: "Calidad",
    };
    return typeMap[type as keyof typeof typeMap] || type;
  };

  const getStatusText = (status: string) => {
    const statusMap = {
      open: "Abierto",
      in_progress: "En Proceso",
      resolved: "Resuelto",
      closed: "Cerrado",
    };
    return statusMap[status as keyof typeof statusMap] || status;
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-zlc-darkblue text-zlc-darkblue-foreground shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-4">
              <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center">
                <Headphones className="w-6 h-6 text-zlc-darkblue" />
              </div>
              <div>
                <h1 className="text-xl font-bold">Incidencias y Soporte</h1>
                <p className="text-zlc-darkblue-foreground/80 text-sm">
                  Administrador de Soporte
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                className="text-zlc-darkblue-foreground hover:bg-zlc-navy relative"
              >
                <Bell className="w-4 h-4 mr-2" />
                Notificaciones
                <Badge className="ml-2 bg-red-500 text-white">
                  {tickets.filter((t) => t.escalated).length}
                </Badge>
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
            Panel de Tickets
          </h2>
          <p className="text-muted-foreground">
            Gestiona incidencias y proporciona soporte a proveedores y
            compradores
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
                <Label htmlFor="search">Buscar ticket</Label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                  <Input
                    id="search"
                    placeholder="ID, asunto o cliente..."
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
                    <SelectItem value="open">Abierto</SelectItem>
                    <SelectItem value="in_progress">En Proceso</SelectItem>
                    <SelectItem value="resolved">Resuelto</SelectItem>
                    <SelectItem value="closed">Cerrado</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label>Prioridad</Label>
                <Select
                  value={priorityFilter}
                  onValueChange={setPriorityFilter}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Todas las prioridades" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todas</SelectItem>
                    <SelectItem value="urgent">Urgente</SelectItem>
                    <SelectItem value="high">Alta</SelectItem>
                    <SelectItem value="medium">Media</SelectItem>
                    <SelectItem value="low">Baja</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label>Tipo de Incidencia</Label>
                <Select value={typeFilter} onValueChange={setTypeFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="Todos los tipos" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos</SelectItem>
                    <SelectItem value="Documentación Incorrecta">
                      Documentación
                    </SelectItem>
                    <SelectItem value="Retraso en Embarque">
                      Embarque
                    </SelectItem>
                    <SelectItem value="Problema de Calidad">Calidad</SelectItem>
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
                Tickets Abiertos
              </CardTitle>
              <AlertTriangle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">
                {tickets.filter((t) => t.status === "open").length}
              </div>
              <p className="text-xs text-muted-foreground">
                Requieren asignación
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">En Proceso</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">
                {tickets.filter((t) => t.status === "in_progress").length}
              </div>
              <p className="text-xs text-muted-foreground">Siendo atendidos</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Resueltos</CardTitle>
              <CheckCircle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">
                {tickets.filter((t) => t.status === "resolved").length}
              </div>
              <p className="text-xs text-muted-foreground">Esta semana</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Escalados</CardTitle>
              <RotateCcw className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-orange-600">
                {tickets.filter((t) => t.escalated).length}
              </div>
              <p className="text-xs text-muted-foreground">
                Requieren reasignación
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Tickets Table */}
        <Card>
          <CardHeader>
            <CardTitle>Lista de Tickets</CardTitle>
            <CardDescription>
              Tickets de soporte registrados ({filteredTickets.length}{" "}
              resultados)
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {filteredTickets.map((ticket) => (
                <div
                  key={ticket.id}
                  className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                >
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-zlc-darkblue/10 rounded-lg flex items-center justify-center">
                      <Headphones className="w-6 h-6 text-zlc-darkblue" />
                    </div>
                    <div className="space-y-1">
                      <div className="flex items-center space-x-2">
                        <p className="font-medium">{ticket.id}</p>
                        {ticket.escalated && (
                          <Badge className="bg-orange-600 text-white">
                            <RotateCcw className="w-3 h-3 mr-1" />
                            Escalado
                          </Badge>
                        )}
                      </div>
                      <p className="text-sm font-medium text-zlc-darkblue">
                        {ticket.subject}
                      </p>
                      <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                        <span className="flex items-center">
                          <FileText className="w-3 h-3 mr-1" />
                          {ticket.incidentType}
                        </span>
                        <span className="flex items-center">
                          <Building className="w-3 h-3 mr-1" />
                          {ticket.linkedOrder}
                        </span>
                        <span className="flex items-center">
                          <User className="w-3 h-3 mr-1" />
                          {ticket.responsible}
                        </span>
                        <span className="flex items-center">
                          <Calendar className="w-3 h-3 mr-1" />
                          {ticket.lastUpdated}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    {getPriorityBadge(ticket.priority)}
                    {getStatusBadge(ticket.status)}
                    <Button
                      size="sm"
                      onClick={() => openTicketDetails(ticket)}
                      className="bg-zlc-darkblue hover:bg-zlc-navy"
                    >
                      <Eye className="w-4 h-4 mr-1" />
                      Ver
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </main>

      {/* Ticket Details Dialog */}
      <Dialog open={showTicketDialog} onOpenChange={setShowTicketDialog}>
        <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Headphones className="w-5 h-5" />
              Ticket: {selectedTicket?.id} - {selectedTicket?.subject}
            </DialogTitle>
            <DialogDescription>
              Gestiona el ticket y proporciona soporte al cliente
            </DialogDescription>
          </DialogHeader>

          {selectedTicket && (
            <div className="space-y-6">
              {/* Ticket Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">
                      Información del Ticket
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <Label className="text-sm font-medium">ID</Label>
                        <p className="text-sm">{selectedTicket.id}</p>
                      </div>
                      <div>
                        <Label className="text-sm font-medium">Estado</Label>
                        {getStatusBadge(selectedTicket.status)}
                      </div>
                      <div>
                        <Label className="text-sm font-medium">Prioridad</Label>
                        {getPriorityBadge(selectedTicket.priority)}
                      </div>
                      <div>
                        <Label className="text-sm font-medium">Tipo</Label>
                        <p className="text-sm">{selectedTicket.incidentType}</p>
                      </div>
                      <div>
                        <Label className="text-sm font-medium">
                          Orden Vinculada
                        </Label>
                        <p className="text-sm">{selectedTicket.linkedOrder}</p>
                      </div>
                      <div>
                        <Label className="text-sm font-medium">
                          Responsable
                        </Label>
                        <p className="text-sm">{selectedTicket.responsible}</p>
                      </div>
                      <div>
                        <Label className="text-sm font-medium">
                          Reportado por
                        </Label>
                        <p className="text-sm">{selectedTicket.reporter}</p>
                      </div>
                      <div>
                        <Label className="text-sm font-medium">
                          Fecha de Creación
                        </Label>
                        <p className="text-sm">{selectedTicket.createdDate}</p>
                      </div>
                    </div>
                    <div>
                      <Label className="text-sm font-medium">Descripción</Label>
                      <p className="text-sm mt-1 p-3 bg-muted rounded-lg">
                        {selectedTicket.description}
                      </p>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Acciones Rápidas</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {selectedTicket.responsibleType === "unassigned" ? (
                      <Button
                        onClick={() => setShowAssignDialog(true)}
                        className="w-full bg-zlc-darkblue hover:bg-zlc-navy"
                      >
                        <User className="w-4 h-4 mr-2" />
                        Asignar a Inspector
                      </Button>
                    ) : (
                      <div className="space-y-2">
                        <Button
                          onClick={() => handleUpdateStatus("resolved")}
                          disabled={selectedTicket.status === "resolved"}
                          className="w-full bg-green-600 hover:bg-green-700"
                        >
                          <CheckCircle className="w-4 h-4 mr-2" />
                          Marcar como Resuelto
                        </Button>
                        <Button
                          onClick={() => handleUpdateStatus("closed")}
                          disabled={selectedTicket.status === "closed"}
                          variant="outline"
                          className="w-full"
                        >
                          <Archive className="w-4 h-4 mr-2" />
                          Cerrar Ticket
                        </Button>
                      </div>
                    )}

                    <Button
                      onClick={() => setShowEvidenceDialog(true)}
                      variant="outline"
                      className="w-full"
                    >
                      <Upload className="w-4 h-4 mr-2" />
                      Subir Evidencias
                    </Button>

                    {selectedTicket.responsibleType !== "unassigned" && (
                      <Button
                        onClick={handleReassignTicket}
                        variant="outline"
                        className="w-full text-orange-600 border-orange-600"
                      >
                        <RotateCcw className="w-4 h-4 mr-2" />
                        Reasignar Inspector
                      </Button>
                    )}
                  </CardContent>
                </Card>
              </div>

              {/* Response History */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <MessageSquare className="w-5 h-5" />
                    Historial de Respuestas
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4 max-h-64 overflow-y-auto">
                    {selectedTicket.responses.map((response, index) => (
                      <div
                        key={response.id}
                        className={`p-3 rounded-lg ${
                          response.authorType === "client"
                            ? "bg-blue-50 border-l-4 border-blue-500"
                            : response.authorType === "inspector"
                              ? "bg-green-50 border-l-4 border-green-500"
                              : "bg-gray-50 border-l-4 border-gray-500"
                        }`}
                      >
                        <div className="flex items-center justify-between mb-2">
                          <p className="text-sm font-medium">
                            {response.author}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {response.timestamp}
                          </p>
                        </div>
                        <p className="text-sm">{response.message}</p>
                        {response.attachments.length > 0 && (
                          <div className="mt-2 flex flex-wrap gap-2">
                            {response.attachments.map((attachment, i) => (
                              <Badge key={i} variant="outline">
                                <Paperclip className="w-3 h-3 mr-1" />
                                {attachment}
                              </Badge>
                            ))}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>

                  <div className="mt-4 space-y-3">
                    <Label>Añadir Respuesta</Label>
                    <Textarea
                      placeholder="Escribe tu respuesta..."
                      value={responseMessage}
                      onChange={(e) => setResponseMessage(e.target.value)}
                      className="min-h-[100px]"
                    />
                    <Button onClick={handleAddResponse}>
                      <Send className="w-4 h-4 mr-2" />
                      Enviar Respuesta
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Evidence */}
              {selectedTicket.evidence.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                      <Paperclip className="w-5 h-5" />
                      Evidencias
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      {selectedTicket.evidence.map((evidence) => (
                        <div
                          key={evidence.id}
                          className="p-3 border rounded-lg text-center"
                        >
                          <div className="w-8 h-8 mx-auto mb-2 flex items-center justify-center">
                            {evidence.type === "image" ? (
                              <Image className="w-6 h-6 text-zlc-darkblue" />
                            ) : (
                              <FileText className="w-6 h-6 text-zlc-darkblue" />
                            )}
                          </div>
                          <p className="text-sm font-medium truncate">
                            {evidence.name}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {evidence.uploadedBy}
                          </p>
                          <Button size="sm" variant="outline" className="mt-2">
                            <Download className="w-3 h-3 mr-1" />
                            Ver
                          </Button>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          )}

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowTicketDialog(false)}
            >
              Cerrar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Assignment Dialog */}
      <Dialog open={showAssignDialog} onOpenChange={setShowAssignDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <User className="w-5 h-5" />
              Asignar a Inspector
            </DialogTitle>
            <DialogDescription>
              Selecciona el tipo de caso y el inspector responsable
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div>
              <Label>Tipo de Caso</Label>
              <Select
                value={assignmentType}
                onValueChange={(value) =>
                  setAssignmentType(
                    value as "logistics" | "customs" | "quality",
                  )
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="logistics">Logístico</SelectItem>
                  <SelectItem value="customs">Aduanero</SelectItem>
                  <SelectItem value="quality">Calidad</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label>Inspector</Label>
              <Select
                value={selectedInspector}
                onValueChange={setSelectedInspector}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Seleccionar inspector" />
                </SelectTrigger>
                <SelectContent>
                  {inspectors[assignmentType].map((inspector) => (
                    <SelectItem key={inspector} value={inspector}>
                      {inspector}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label>Comentario de Contexto</Label>
              <Textarea
                placeholder="Proporciona contexto adicional para el inspector..."
                value={assignmentComment}
                onChange={(e) => setAssignmentComment(e.target.value)}
                className="min-h-[100px]"
              />
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowAssignDialog(false)}
            >
              Cancelar
            </Button>
            <Button onClick={handleAssignTicket}>Asignar Inspector</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Evidence Upload Dialog */}
      <Dialog open={showEvidenceDialog} onOpenChange={setShowEvidenceDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Upload className="w-5 h-5" />
              Subir Evidencias
            </DialogTitle>
            <DialogDescription>
              Sube imágenes, PDFs o documentos relacionados con el ticket
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div className="border-2 border-dashed border-muted rounded-lg p-8 text-center">
              <Upload className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-sm text-muted-foreground mb-2">
                Arrastra y suelta archivos aquí o haz clic para seleccionar
              </p>
              <p className="text-xs text-muted-foreground">
                Soporta: JPG, PNG, PDF, DOC, DOCX (máx. 10MB)
              </p>
              <Button
                variant="outline"
                className="mt-4"
                onClick={handleUploadEvidence}
              >
                Seleccionar Archivos
              </Button>
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowEvidenceDialog(false)}
            >
              Cancelar
            </Button>
            <Button onClick={() => setShowEvidenceDialog(false)}>
              Subir Evidencias
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
