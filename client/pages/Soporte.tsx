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
import { useToast } from "@/hooks/use-toast";
import { apiClient } from "@/lib/api-client";
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
  Loader2,
  Download,
  Archive,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

// Backend interfaces
interface BackendTicket {
  id: string;
  numeroTicket: string;
  titulo: string;
  descripcion: string;
  categoria: 'TECNICO' | 'FUNCIONAL' | 'ACCESO' | 'DATOS' | 'INTEGRACION' | 'OTROS';
  prioridad: 'BAJA' | 'MEDIA' | 'ALTA' | 'CRITICA';
  estado: 'ABIERTO' | 'EN_PROCESO' | 'ESPERANDO_CLIENTE' | 'RESUELTO' | 'CERRADO';
  usuarioCreador: {
    id: string;
    nombre: string;
    email: string;
    telefono?: string;
    empresa?: string;
    departamento?: string;
  };
  agenteAsignado?: {
    id: string;
    nombre: string;
    email: string;
    nivel: 'JUNIOR' | 'SENIOR' | 'EXPERT' | 'LEAD';
    especialidades: string[];
    ticketsAsignados: number;
    disponible: boolean;
  };
  fechaCreacion: string | Date;
  fechaActualizacion: string | Date;
  fechaVencimiento: string | Date;
  tiempoRespuesta?: number;
  tiempoResolucion?: number;
  comentarios: {
    id: string;
    autor: string;
    tipo: 'COMENTARIO' | 'SOLUCION' | 'ESCALAMIENTO' | 'CIERRE';
    contenido: string;
    esInterno: boolean;
    fechaCreacion: string | Date;
    archivos?: string[];
  }[];
  archivos: {
    id: string;
    nombre: string;
    tipo: string;
    tamaño: number;
    url: string;
    fechaSubida: string | Date;
    subidoPor: string;
  }[];
  etiquetas: string[];
  satisfaccion?: {
    puntuacion: number;
    comentario?: string;
    fechaRating: Date;
  };
}

// Conversion functions
function convertBackendToFrontend(backendTicket: BackendTicket): SupportTicket {
  return {
    id: backendTicket.id,
    incidentType: backendTicket.categoria,
    linkedOrder: backendTicket.numeroTicket,
    status: convertBackendStatus(backendTicket.estado),
    responsible: backendTicket.agenteAsignado?.nombre || "No asignado",
    responsibleType: determineResponsibleType(backendTicket.categoria),
    priority: convertBackendPriority(backendTicket.prioridad),
    reporter: backendTicket.usuarioCreador.nombre,
    reporterType: determineReporterType(backendTicket.usuarioCreador.empresa),
    subject: backendTicket.titulo,
    description: backendTicket.descripcion,
    createdDate: typeof backendTicket.fechaCreacion === 'string' ? backendTicket.fechaCreacion : backendTicket.fechaCreacion.toISOString(),
    lastUpdated: typeof backendTicket.fechaActualizacion === 'string' ? backendTicket.fechaActualizacion : backendTicket.fechaActualizacion.toISOString(),
    responses: backendTicket.comentarios.map(comment => ({
      id: comment.id,
      author: comment.autor,
      authorType: determineAuthorType(comment.autor),
      message: comment.contenido,
      timestamp: typeof comment.fechaCreacion === 'string' ? comment.fechaCreacion : comment.fechaCreacion.toISOString(),
      attachments: comment.archivos || []
    })),
    evidence: backendTicket.archivos.map(archivo => ({
      id: archivo.id,
      name: archivo.nombre,
      type: determineFileType(archivo.tipo),
      url: archivo.url,
      uploadedBy: archivo.subidoPor,
      uploadedDate: typeof archivo.fechaSubida === 'string' ? archivo.fechaSubida : archivo.fechaSubida.toISOString()
    })),
    escalated: backendTicket.etiquetas.includes('ESCALATED'),
    escalationDate: backendTicket.etiquetas.includes('ESCALATED') ? 
      (typeof backendTicket.fechaActualizacion === 'string' ? backendTicket.fechaActualizacion : backendTicket.fechaActualizacion.toISOString()) : 
      undefined
  };
}

function convertBackendStatus(backendStatus: string): "open" | "in_progress" | "resolved" | "closed" {
  switch (backendStatus) {
    case 'ABIERTO': return 'open';
    case 'EN_PROCESO': return 'in_progress';
    case 'ESPERANDO_CLIENTE': return 'in_progress';
    case 'RESUELTO': return 'resolved';
    case 'CERRADO': return 'closed';
    default: return 'open';
  }
}

function convertBackendPriority(backendPriority: string): "low" | "medium" | "high" | "urgent" {
  switch (backendPriority) {
    case 'BAJA': return 'low';
    case 'MEDIA': return 'medium';
    case 'ALTA': return 'high';
    case 'CRITICA': return 'urgent';
    default: return 'medium';
  }
}

function determineResponsibleType(categoria: string): "logistics" | "customs" | "quality" | "unassigned" {
  switch (categoria) {
    case 'TECNICO': return 'quality';
    case 'FUNCIONAL': return 'logistics';
    case 'ACCESO': return 'quality';
    case 'DATOS': return 'customs';
    case 'INTEGRACION': return 'logistics';
    default: return 'unassigned';
  }
}

function determineReporterType(empresa?: string): "supplier" | "buyer" {
  return empresa?.toLowerCase().includes('supplier') || empresa?.toLowerCase().includes('proveedor') ? 'supplier' : 'buyer';
}

function determineAuthorType(author: string): "support" | "inspector" | "client" {
  // Si el autor contiene "@soporte.com" es del equipo de soporte
  if (author.includes('@soporte.com') || author.includes('González') || author.includes('Rodríguez')) {
    return 'support';
  }
  // Si no, es un cliente
  return 'client';
}

function convertAuthorType(tipo: string): "support" | "inspector" | "client" {
  switch (tipo) {
    case 'COMENTARIO': return 'support';
    case 'SOLUCION': return 'support';
    case 'ESCALAMIENTO': return 'inspector';
    case 'CIERRE': return 'support';
    default: return 'client';
  }
}

function determineFileType(mimeType: string): "image" | "pdf" | "document" {
  if (mimeType.includes('image')) return 'image';
  if (mimeType.includes('pdf')) return 'pdf';
  return 'document';
}

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
  const [tickets, setTickets] = useState<SupportTicket[]>([]);
  const [loading, setLoading] = useState(true);
  const [inspectors, setInspectors] = useState<{[key: string]: string[]}>({
    logistics: [],
    customs: [],
    quality: []
  });
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleLogout = () => {
    navigate("/");
  };

  // Load tickets from backend
  useEffect(() => {
    console.log('🔍 useEffect triggered with filters:', { statusFilter, priorityFilter, typeFilter });
    loadTickets();
    loadInspectors();
  }, [statusFilter, priorityFilter, typeFilter]);

  // Monitor tickets state changes
  useEffect(() => {
    console.log('🔍 Tickets state changed:', tickets);
    console.log('🔍 Number of tickets in state:', tickets.length);
  }, [tickets]);

  const loadTickets = async () => {
    try {
      setLoading(true);
      console.log('🔍 Starting loadTickets function');
      
      // Check if we have authentication token
      const token = localStorage.getItem('accessToken');
      if (!token) {
        console.warn('No authentication token found, redirecting to login');
        navigate('/');
        return;
      }

      const params = new URLSearchParams();
      
      if (statusFilter !== 'all') {
        params.append('estado', convertFrontendStatus(statusFilter));
      }
      if (priorityFilter !== 'all') {
        params.append('prioridad', convertFrontendPriority(priorityFilter));
      }
      if (typeFilter !== 'all') {
        params.append('categoria', typeFilter.toUpperCase());
      }

      console.log('🔍 Loading tickets with params:', params.toString());
      console.log('🔍 Auth token present:', !!token);
      console.log('🔍 Making API call to getSoporteTickets...');
      
      const response = await apiClient.getSoporteTickets(params.toString());
      console.log('🔍 Raw API response:', response);
      
      if (response && response.data && response.data.tickets) {
        const tickets = response.data.tickets;
        console.log('🔍 Tickets array from backend:', tickets);
        console.log('🔍 Number of tickets:', tickets.length);
        
        if (Array.isArray(tickets)) {
          console.log('🔍 Converting', tickets.length, 'tickets from backend to frontend format');
          console.log('🔍 First ticket example:', tickets[0]);
          
          const convertedTickets = tickets.map((ticket, index) => {
            console.log(`🔍 Converting ticket ${index + 1}:`, ticket);
            const converted = convertBackendToFrontend(ticket);
            console.log(`🔍 Converted ticket ${index + 1}:`, converted);
            return converted;
          });
          
          console.log('🔍 All converted tickets:', convertedTickets);
          setTickets(convertedTickets);
          console.log('🔍 Tickets state updated successfully');
        } else {
          console.warn('❌ Response data.tickets is not an array:', tickets);
          setTickets([]);
        }
      } else {
        console.warn('❌ No data.tickets in response structure:', response);
        setTickets([]);
      }
    } catch (error: any) {
      console.error('Error loading tickets:', error);
      
      // If 401 or 403, redirect to login
      if (error.status === 401 || error.status === 403) {
        localStorage.removeItem('accessToken');
        navigate('/');
        return;
      }
      
      toast({
        title: "Error",
        description: `Error al cargar tickets: ${error instanceof Error ? error.message : 'Error desconocido'}`,
        variant: "destructive",
      });
      setTickets([]);
    } finally {
      setLoading(false);
    }
  };

  const convertFrontendStatus = (status: string) => {
    switch (status) {
      case 'open': return 'ABIERTO';
      case 'in_progress': return 'EN_PROCESO';
      case 'resolved': return 'RESUELTO';
      case 'closed': return 'CERRADO';
      default: return 'ABIERTO';
    }
  };

  const convertFrontendPriority = (priority: string) => {
    switch (priority) {
      case 'low': return 'BAJA';
      case 'medium': return 'MEDIA';
      case 'high': return 'ALTA';
      case 'urgent': return 'CRITICA';
      default: return 'MEDIA';
    }
  };

  // Load inspectors from backend
  const loadInspectors = async () => {
    try {
      const response = await apiClient.getSoporteAgentes();
      console.log('Inspectors response:', response);
      
      if (response && response.data) {
        const agentes = response.data.agentes || response.data;
        if (Array.isArray(agentes)) {
          const inspectorsByType = {
            logistics: agentes.filter((a: any) => 
              a.especialidades.includes('Logística') || 
              a.especialidades.includes('Backend') ||
              a.especialidades.includes('Integración')
            ).map((a: any) => a.nombre),
            customs: agentes.filter((a: any) => 
              a.especialidades.includes('Aduanas') || 
              a.especialidades.includes('Configuración')
            ).map((a: any) => a.nombre),
            quality: agentes.filter((a: any) => 
              a.especialidades.includes('Calidad') || 
              a.especialidades.includes('Backend') ||
              a.especialidades.includes('API')
            ).map((a: any) => a.nombre)
          };
          
          // If no specific specialization, add to all categories
          agentes.forEach((a: any) => {
            if (!inspectorsByType.logistics.includes(a.nombre) && 
                !inspectorsByType.customs.includes(a.nombre) && 
                !inspectorsByType.quality.includes(a.nombre)) {
              inspectorsByType.logistics.push(a.nombre);
              inspectorsByType.customs.push(a.nombre);
              inspectorsByType.quality.push(a.nombre);
            }
          });
          
          setInspectors(inspectorsByType);
        }
      }
    } catch (error) {
      console.error('Error loading inspectors:', error);
      // Fallback to default inspectors if API fails
      setInspectors({
        logistics: ["Juan Pérez", "Carlos Rodríguez", "Ana López"],
        customs: ["Miguel Torres", "Sofia Mendoza", "Roberto Silva"],
        quality: ["María García", "Pedro Morales", "Lucia Fernández"],
      });
    }
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

  const handleAssignTicket = async () => {
    if (!selectedTicket || !selectedInspector || !assignmentComment.trim()) {
      toast({
        title: "Error",
        description: "Debe seleccionar un inspector y proporcionar un comentario.",
        variant: "destructive",
      });
      return;
    }

    try {
      await apiClient.assignTicket(selectedTicket.id, selectedInspector);
      
      // Add comment after assignment if provided
      if (assignmentComment.trim()) {
        await apiClient.addTicketComment(selectedTicket.id, {
          contenido: `Ticket asignado a ${selectedInspector}. ${assignmentComment}`,
          tipo: 'COMENTARIO',
          esInterno: false
        });
      }
      
      toast({
        title: "Ticket asignado",
        description: `Ticket asignado a ${selectedInspector}`,
      });
      
      setShowAssignDialog(false);
      setAssignmentComment("");
      setSelectedInspector("");
      loadTickets();
      
      // Refresh ticket details
      if (selectedTicket) {
        const updatedTicket = await apiClient.getTicket(selectedTicket.id);
        setSelectedTicket(convertBackendToFrontend(updatedTicket.data));
      }
    } catch (error) {
      console.error('Error assigning ticket:', error);
      toast({
        title: "Error",
        description: "No se pudo asignar el ticket",
        variant: "destructive",
      });
    }
  };

  const handleAddResponse = async () => {
    if (!selectedTicket || !responseMessage.trim()) {
      toast({
        title: "Error",
        description: "Debe escribir una respuesta.",
        variant: "destructive",
      });
      return;
    }

    try {
      await apiClient.addTicketComment(selectedTicket.id, {
        contenido: responseMessage,
        tipo: 'COMENTARIO',
        esInterno: false
      });
      
      toast({
        title: "Respuesta enviada",
        description: "La respuesta ha sido agregada al ticket",
      });
      
      setResponseMessage("");
      
      // Refresh ticket details
      const updatedTicket = await apiClient.getTicket(selectedTicket.id);
      setSelectedTicket(convertBackendToFrontend(updatedTicket.data));
      loadTickets();
    } catch (error) {
      console.error('Error adding response:', error);
      toast({
        title: "Error",
        description: "No se pudo enviar la respuesta",
        variant: "destructive",
      });
    }
  };

  const handleUpdateStatus = async (newStatus: SupportTicket["status"]) => {
    if (!selectedTicket) return;

    try {
      const backendStatus = convertFrontendStatus(newStatus);
      await apiClient.changeTicketStatus(selectedTicket.id, backendStatus);
      
      toast({
        title: "Estado actualizado",
        description: `Estado actualizado a "${getStatusText(newStatus)}"`,
      });
      
      loadTickets();
      
      // Refresh ticket details
      const updatedTicket = await apiClient.getTicket(selectedTicket.id);
      setSelectedTicket(convertBackendToFrontend(updatedTicket.data));
    } catch (error) {
      console.error('Error updating ticket status:', error);
      toast({
        title: "Error",
        description: "No se pudo actualizar el estado",
        variant: "destructive",
      });
    }
  };

  const handleReassignTicket = () => {
    if (!selectedTicket) return;
    setShowAssignDialog(true);
  };

  const handleUploadEvidence = async (file: File) => {
    if (!selectedTicket) return;

    try {
      await apiClient.uploadTicketEvidence(selectedTicket.id, file);
      
      toast({
        title: "Evidencia subida",
        description: "La evidencia ha sido agregada al ticket",
      });
      
      setShowEvidenceDialog(false);
      
      // Refresh ticket details
      const updatedTicket = await apiClient.getTicket(selectedTicket.id);
      setSelectedTicket(convertBackendToFrontend(updatedTicket.data));
      loadTickets();
    } catch (error) {
      console.error('Error uploading evidence:', error);
      toast({
        title: "Error",
        description: "No se pudo subir la evidencia",
        variant: "destructive",
      });
    }
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
              {loading ? (
                <div className="flex justify-center items-center py-8">
                  <Loader2 className="w-8 h-8 animate-spin text-zlc-darkblue" />
                  <span className="ml-2">Cargando tickets...</span>
                </div>
              ) : filteredTickets.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <Headphones className="w-12 h-12 mx-auto mb-4 text-muted-foreground/50" />
                  <p>No hay tickets que coincidan con los filtros</p>
                </div>
              ) : (
                filteredTickets.map((ticket) => (
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
                ))
              )}
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
              <input
                type="file"
                id="evidence-upload"
                accept=".jpg,.jpeg,.png,.pdf,.doc,.docx"
                style={{ display: 'none' }}
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) {
                    handleUploadEvidence(file);
                  }
                }}
              />
              <Button
                variant="outline"
                className="mt-4"
                onClick={() => document.getElementById('evidence-upload')?.click()}
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
