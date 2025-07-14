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
  Ship,
  CheckCircle,
  XCircle,
  Clock,
  Eye,
  Download,
  Filter,
  Calendar,
  Building,
  Container,
  MapPin,
  DollarSign,
  TrendingUp,
  Anchor,
  Navigation,
  Globe,
  Bell,
  Plus,
  FileText,
  BarChart3,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

interface TransportQuote {
  id: string;
  requestId: string;
  requester: string;
  requesterType: "supplier" | "buyer";
  containerType: string;
  originPort: string;
  destinationPort: string;
  operators: string[];
  quotedRate: number;
  currency: string;
  incoterm: string;
  transitTime: number;
  validUntil: string;
  status: "pending" | "validated" | "approved" | "rejected";
  sourceVerified: boolean;
  commission: number;
}

interface Booking {
  id: string;
  bookingNumber: string;
  shippingLine: string;
  commission: number;
  assignedContainer: string;
  origin: string;
  destination: string;
  createdDate: string;
  estimatedDeparture: string;
  estimatedArrival: string;
  status: "created" | "container_ready" | "sailed" | "in_transit" | "arrived";
  quoteId: string;
}

export default function Logistica() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [containerFilter, setContainerFilter] = useState("all");
  const [selectedQuote, setSelectedQuote] = useState<TransportQuote | null>(
    null,
  );
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [showQuoteDialog, setShowQuoteDialog] = useState(false);
  const [showBookingDialog, setShowBookingDialog] = useState(false);
  const [showTrackingDialog, setShowTrackingDialog] = useState(false);
  const [activeTab, setActiveTab] = useState<
    "quotes" | "bookings" | "tracking"
  >("quotes");
  const [validationNotes, setValidationNotes] = useState("");
  const navigate = useNavigate();

  const handleLogout = () => {
    navigate("/");
  };

  // Mock data for demonstration
  const [quotes, setQuotes] = useState<TransportQuote[]>([
    {
      id: "QUOTE-001",
      requestId: "REQ-2024-001",
      requester: "Electronics Global Ltd",
      requesterType: "supplier",
      containerType: "20' DRY",
      originPort: "Shanghai, China",
      destinationPort: "Callao, Perú",
      operators: ["COSCO", "MSC", "CMA CGM"],
      quotedRate: 2850,
      currency: "USD",
      incoterm: "FOB",
      transitTime: 22,
      validUntil: "2024-02-15",
      status: "pending",
      sourceVerified: true,
      commission: 285,
    },
    {
      id: "QUOTE-002",
      requestId: "REQ-2024-002",
      requester: "Fashion International SA",
      requesterType: "buyer",
      containerType: "40' HC",
      originPort: "Hamburg, Germany",
      destinationPort: "Buenaventura, Colombia",
      operators: ["Hapag-Lloyd", "Maersk"],
      quotedRate: 3200,
      currency: "USD",
      incoterm: "CIF",
      transitTime: 18,
      validUntil: "2024-02-20",
      status: "validated",
      sourceVerified: true,
      commission: 320,
    },
    {
      id: "QUOTE-003",
      requestId: "REQ-2024-003",
      requester: "Auto Parts Corp",
      requesterType: "supplier",
      containerType: "20' DRY",
      originPort: "Tokyo, Japan",
      destinationPort: "Guayaquil, Ecuador",
      operators: ["K Line", "NYK Line"],
      quotedRate: 2650,
      currency: "USD",
      incoterm: "CFR",
      transitTime: 25,
      validUntil: "2024-02-10",
      status: "approved",
      sourceVerified: true,
      commission: 265,
    },
  ]);

  const [bookings, setBookings] = useState<Booking[]>([
    {
      id: "BOOK-001",
      bookingNumber: "ZLCB-2024-001",
      shippingLine: "K Line",
      commission: 265,
      assignedContainer: "KIKU-123456-7",
      origin: "Tokyo, Japan",
      destination: "Guayaquil, Ecuador",
      createdDate: "2024-01-15",
      estimatedDeparture: "2024-01-25",
      estimatedArrival: "2024-02-19",
      status: "container_ready",
      quoteId: "QUOTE-003",
    },
    {
      id: "BOOK-002",
      bookingNumber: "ZLCB-2024-002",
      shippingLine: "Maersk",
      commission: 320,
      assignedContainer: "MSKU-789012-3",
      origin: "Hamburg, Germany",
      destination: "Buenaventura, Colombia",
      createdDate: "2024-01-10",
      estimatedDeparture: "2024-01-20",
      estimatedArrival: "2024-02-07",
      status: "in_transit",
      quoteId: "QUOTE-002",
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
      case "validated":
        return (
          <Badge variant="secondary" className="bg-blue-100 text-blue-800">
            <CheckCircle className="w-3 h-3 mr-1" />
            Validada
          </Badge>
        );
      case "approved":
        return (
          <Badge variant="secondary" className="bg-green-100 text-green-800">
            <CheckCircle className="w-3 h-3 mr-1" />
            Aprobada
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

  const getBookingStatusBadge = (status: string) => {
    switch (status) {
      case "created":
        return (
          <Badge variant="secondary" className="bg-gray-100 text-gray-800">
            <FileText className="w-3 h-3 mr-1" />
            Creado
          </Badge>
        );
      case "container_ready":
        return (
          <Badge variant="secondary" className="bg-blue-100 text-blue-800">
            <Container className="w-3 h-3 mr-1" />
            Contenedor Listo
          </Badge>
        );
      case "sailed":
        return (
          <Badge variant="secondary" className="bg-purple-100 text-purple-800">
            <Ship className="w-3 h-3 mr-1" />
            Zarpó
          </Badge>
        );
      case "in_transit":
        return (
          <Badge variant="secondary" className="bg-orange-100 text-orange-800">
            <Navigation className="w-3 h-3 mr-1" />
            En Tránsito
          </Badge>
        );
      case "arrived":
        return (
          <Badge variant="secondary" className="bg-green-100 text-green-800">
            <Anchor className="w-3 h-3 mr-1" />
            Llegó a Puerto
          </Badge>
        );
      default:
        return null;
    }
  };

  const filteredQuotes = quotes.filter((quote) => {
    const matchesSearch =
      quote.requestId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      quote.requester.toLowerCase().includes(searchTerm.toLowerCase()) ||
      quote.originPort.toLowerCase().includes(searchTerm.toLowerCase()) ||
      quote.destinationPort.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus =
      statusFilter === "all" || quote.status === statusFilter;
    const matchesContainer =
      containerFilter === "all" || quote.containerType === containerFilter;

    return matchesSearch && matchesStatus && matchesContainer;
  });

  const openQuoteDetails = (quote: TransportQuote) => {
    setSelectedQuote(quote);
    setValidationNotes("");
    setShowQuoteDialog(true);
  };

  const openBookingDetails = (booking: Booking) => {
    setSelectedBooking(booking);
    setShowBookingDialog(true);
  };

  const handleValidateQuote = () => {
    if (!selectedQuote) return;

    const updatedQuote = {
      ...selectedQuote,
      status: "validated" as const,
    };

    setQuotes(
      quotes.map((q) => (q.id === selectedQuote.id ? updatedQuote : q)),
    );
    setShowQuoteDialog(false);
    alert("Cotización validada correctamente.");
  };

  const handleApproveQuote = () => {
    if (!selectedQuote) return;

    // Update quote status
    const updatedQuote = {
      ...selectedQuote,
      status: "approved" as const,
    };

    // Generate booking
    const newBooking: Booking = {
      id: `BOOK-${Date.now()}`,
      bookingNumber: `ZLCB-2024-${String(bookings.length + 1).padStart(3, "0")}`,
      shippingLine: selectedQuote.operators[0],
      commission: selectedQuote.commission,
      assignedContainer: `${selectedQuote.operators[0].substring(0, 4).toUpperCase()}-${Math.random().toString().substring(2, 8)}-${Math.floor(Math.random() * 10)}`,
      origin: selectedQuote.originPort,
      destination: selectedQuote.destinationPort,
      createdDate: new Date().toISOString().split("T")[0],
      estimatedDeparture: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000)
        .toISOString()
        .split("T")[0],
      estimatedArrival: new Date(
        Date.now() + (10 + selectedQuote.transitTime) * 24 * 60 * 60 * 1000,
      )
        .toISOString()
        .split("T")[0],
      status: "created",
      quoteId: selectedQuote.id,
    };

    setQuotes(
      quotes.map((q) => (q.id === selectedQuote.id ? updatedQuote : q)),
    );
    setBookings([...bookings, newBooking]);
    setShowQuoteDialog(false);
    alert(
      `Cotización aprobada y booking generado: ${newBooking.bookingNumber}`,
    );
  };

  const handleRejectQuote = () => {
    if (!selectedQuote) return;

    const updatedQuote = {
      ...selectedQuote,
      status: "rejected" as const,
    };

    setQuotes(
      quotes.map((q) => (q.id === selectedQuote.id ? updatedQuote : q)),
    );
    setShowQuoteDialog(false);
    alert("Cotización rechazada.");
  };

  const handleUpdateBookingStatus = (
    bookingId: string,
    newStatus: Booking["status"],
  ) => {
    const updatedBooking = bookings.find((b) => b.id === bookingId);
    if (!updatedBooking) return;

    const updatedBookings = bookings.map((b) =>
      b.id === bookingId ? { ...b, status: newStatus } : b,
    );

    setBookings(updatedBookings);

    // Mock notification
    alert(
      `Estado actualizado a "${getStatusText(newStatus)}". Notificaciones enviadas al comprador y proveedor.`,
    );
  };

  const getStatusText = (status: string) => {
    const statusMap = {
      created: "Creado",
      container_ready: "Contenedor Listo",
      sailed: "Zarpó",
      in_transit: "En Tránsito",
      arrived: "Llegó a Puerto",
    };
    return statusMap[status as keyof typeof statusMap] || status;
  };

  const exportBookingData = (booking: Booking) => {
    const data = {
      bookingNumber: booking.bookingNumber,
      shippingLine: booking.shippingLine,
      commission: booking.commission,
      assignedContainer: booking.assignedContainer,
      origin: booking.origin,
      destination: booking.destination,
      createdDate: booking.createdDate,
    };

    alert(`Datos del booking exportados:\n${JSON.stringify(data, null, 2)}`);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-zlc-darkblue text-zlc-darkblue-foreground shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-4">
              <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center">
                <Ship className="w-6 h-6 text-zlc-darkblue" />
              </div>
              <div>
                <h1 className="text-xl font-bold">Logística y Bookings</h1>
                <p className="text-zlc-darkblue-foreground/80 text-sm">
                  Inspector Logístico
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                onClick={() => setShowTrackingDialog(true)}
                className="text-zlc-darkblue-foreground hover:bg-zlc-navy"
              >
                <Navigation className="w-4 h-4 mr-2" />
                Seguimiento
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
            Panel de Logística
          </h2>
          <p className="text-muted-foreground">
            Gestiona cotizaciones de transporte, bookings y seguimiento de
            embarques
          </p>
        </div>

        {/* Navigation Tabs */}
        <div className="flex space-x-1 mb-6">
          <Button
            variant={activeTab === "quotes" ? "default" : "outline"}
            onClick={() => setActiveTab("quotes")}
            className={
              activeTab === "quotes" ? "bg-zlc-darkblue hover:bg-zlc-navy" : ""
            }
          >
            <BarChart3 className="w-4 h-4 mr-2" />
            Cotizaciones
          </Button>
          <Button
            variant={activeTab === "bookings" ? "default" : "outline"}
            onClick={() => setActiveTab("bookings")}
            className={
              activeTab === "bookings"
                ? "bg-zlc-darkblue hover:bg-zlc-navy"
                : ""
            }
          >
            <FileText className="w-4 h-4 mr-2" />
            Bookings
          </Button>
          <Button
            variant={activeTab === "tracking" ? "default" : "outline"}
            onClick={() => setActiveTab("tracking")}
            className={
              activeTab === "tracking"
                ? "bg-zlc-darkblue hover:bg-zlc-navy"
                : ""
            }
          >
            <Navigation className="w-4 h-4 mr-2" />
            Seguimiento
          </Button>
        </div>

        {/* Quotes Tab */}
        {activeTab === "quotes" && (
          <>
            {/* Filters and Search */}
            <Card className="mb-6">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Filter className="w-5 h-5" />
                  Filtros y Búsqueda
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="search">Buscar cotización</Label>
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                      <Input
                        id="search"
                        placeholder="ID, solicitante o puerto..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10"
                      />
                    </div>
                  </div>

                  <div>
                    <Label>Estado</Label>
                    <Select
                      value={statusFilter}
                      onValueChange={setStatusFilter}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Todos los estados" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Todos</SelectItem>
                        <SelectItem value="pending">Pendiente</SelectItem>
                        <SelectItem value="validated">Validada</SelectItem>
                        <SelectItem value="approved">Aprobada</SelectItem>
                        <SelectItem value="rejected">Rechazada</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label>Tipo de Contenedor</Label>
                    <Select
                      value={containerFilter}
                      onValueChange={setContainerFilter}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Todos los tipos" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Todos</SelectItem>
                        <SelectItem value="20' DRY">20' DRY</SelectItem>
                        <SelectItem value="40' HC">40' HC</SelectItem>
                        <SelectItem value="40' DRY">40' DRY</SelectItem>
                        <SelectItem value="20' RF">20' RF</SelectItem>
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
                    Cotizaciones Pendientes
                  </CardTitle>
                  <Clock className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-zlc-darkblue">
                    {quotes.filter((q) => q.status === "pending").length}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Requieren validación
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Validadas
                  </CardTitle>
                  <CheckCircle className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-blue-600">
                    {quotes.filter((q) => q.status === "validated").length}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Listas para aprobación
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Aprobadas
                  </CardTitle>
                  <TrendingUp className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-green-600">
                    {quotes.filter((q) => q.status === "approved").length}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Bookings generados
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Comisión Total
                  </CardTitle>
                  <DollarSign className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-green-600">
                    $
                    {quotes
                      .filter((q) => q.status === "approved")
                      .reduce((sum, q) => sum + q.commission, 0)}
                  </div>
                  <p className="text-xs text-muted-foreground">USD este mes</p>
                </CardContent>
              </Card>
            </div>

            {/* Quotes Table */}
            <Card>
              <CardHeader>
                <CardTitle>Cotizaciones de Transporte</CardTitle>
                <CardDescription>
                  Solicitudes de cotización de proveedores y compradores (
                  {filteredQuotes.length} resultados)
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {filteredQuotes.map((quote) => (
                    <div
                      key={quote.id}
                      className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                    >
                      <div className="flex items-center space-x-4">
                        <div className="w-12 h-12 bg-zlc-darkblue/10 rounded-lg flex items-center justify-center">
                          <Container className="w-6 h-6 text-zlc-darkblue" />
                        </div>
                        <div className="space-y-1">
                          <div className="flex items-center space-x-2">
                            <p className="font-medium">{quote.requestId}</p>
                            <Badge
                              variant={
                                quote.requesterType === "supplier"
                                  ? "secondary"
                                  : "outline"
                              }
                            >
                              {quote.requesterType === "supplier"
                                ? "Proveedor"
                                : "Comprador"}
                            </Badge>
                            {quote.sourceVerified && (
                              <Badge className="bg-green-100 text-green-800">
                                Verificado
                              </Badge>
                            )}
                          </div>
                          <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                            <span className="flex items-center">
                              <Building className="w-3 h-3 mr-1" />
                              {quote.requester}
                            </span>
                            <span className="flex items-center">
                              <Container className="w-3 h-3 mr-1" />
                              {quote.containerType}
                            </span>
                            <span className="flex items-center">
                              <MapPin className="w-3 h-3 mr-1" />
                              {quote.originPort} → {quote.destinationPort}
                            </span>
                            <span className="flex items-center">
                              <DollarSign className="w-3 h-3 mr-1" />
                              {quote.quotedRate} {quote.currency}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-3">
                        {getStatusBadge(quote.status)}
                        <Button
                          size="sm"
                          onClick={() => openQuoteDetails(quote)}
                          className="bg-zlc-darkblue hover:bg-zlc-navy"
                        >
                          <Eye className="w-4 h-4 mr-1" />
                          Validar
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </>
        )}

        {/* Bookings Tab */}
        {activeTab === "bookings" && (
          <Card>
            <CardHeader>
              <CardTitle>Órdenes de Transporte (Bookings)</CardTitle>
              <CardDescription>
                Bookings generados a partir de cotizaciones aprobadas
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {bookings.map((booking) => (
                  <div
                    key={booking.id}
                    className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                  >
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-zlc-darkblue/10 rounded-lg flex items-center justify-center">
                        <Ship className="w-6 h-6 text-zlc-darkblue" />
                      </div>
                      <div className="space-y-1">
                        <p className="font-medium">{booking.bookingNumber}</p>
                        <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                          <span className="flex items-center">
                            <Ship className="w-3 h-3 mr-1" />
                            {booking.shippingLine}
                          </span>
                          <span className="flex items-center">
                            <Container className="w-3 h-3 mr-1" />
                            {booking.assignedContainer}
                          </span>
                          <span className="flex items-center">
                            <DollarSign className="w-3 h-3 mr-1" />
                            Comisión: ${booking.commission}
                          </span>
                          <span className="flex items-center">
                            <Calendar className="w-3 h-3 mr-1" />
                            {booking.estimatedDeparture}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      {getBookingStatusBadge(booking.status)}
                      <Button
                        size="sm"
                        onClick={() => openBookingDetails(booking)}
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
        )}

        {/* Tracking Tab */}
        {activeTab === "tracking" && (
          <Card>
            <CardHeader>
              <CardTitle>Seguimiento de Embarques</CardTitle>
              <CardDescription>
                Control de estados de contenedores y embarques
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {bookings.map((booking) => (
                  <div
                    key={booking.id}
                    className="p-4 border rounded-lg space-y-4"
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">{booking.bookingNumber}</p>
                        <p className="text-sm text-muted-foreground">
                          {booking.origin} → {booking.destination}
                        </p>
                      </div>
                      {getBookingStatusBadge(booking.status)}
                    </div>

                    <div className="flex space-x-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() =>
                          handleUpdateBookingStatus(
                            booking.id,
                            "container_ready",
                          )
                        }
                        disabled={booking.status !== "created"}
                      >
                        Contenedor Listo
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() =>
                          handleUpdateBookingStatus(booking.id, "sailed")
                        }
                        disabled={booking.status !== "container_ready"}
                      >
                        Zarpó
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() =>
                          handleUpdateBookingStatus(booking.id, "in_transit")
                        }
                        disabled={booking.status !== "sailed"}
                      >
                        En Tránsito
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() =>
                          handleUpdateBookingStatus(booking.id, "arrived")
                        }
                        disabled={booking.status !== "in_transit"}
                      >
                        Llegó a Puerto
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </main>

      {/* Quote Details Dialog */}
      <Dialog open={showQuoteDialog} onOpenChange={setShowQuoteDialog}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <BarChart3 className="w-5 h-5" />
              Validación de Cotización: {selectedQuote?.requestId}
            </DialogTitle>
            <DialogDescription>
              Revisa y valida los detalles de la cotización
            </DialogDescription>
          </DialogHeader>

          {selectedQuote && (
            <div className="space-y-6">
              {/* Quote Details */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">
                    Detalles de la Cotización
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label className="text-sm font-medium">
                        ID Solicitud
                      </Label>
                      <p className="text-sm">{selectedQuote.requestId}</p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium">Solicitante</Label>
                      <p className="text-sm">{selectedQuote.requester}</p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium">
                        Tipo de Contenedor
                      </Label>
                      <p className="text-sm">{selectedQuote.containerType}</p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium">Incoterm</Label>
                      <p className="text-sm">{selectedQuote.incoterm}</p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium">
                        Puerto de Origen
                      </Label>
                      <p className="text-sm">{selectedQuote.originPort}</p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium">
                        Puerto de Destino
                      </Label>
                      <p className="text-sm">{selectedQuote.destinationPort}</p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium">Tarifa</Label>
                      <p className="text-sm font-bold text-green-600">
                        {selectedQuote.quotedRate} {selectedQuote.currency}
                      </p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium">
                        Tiempo de Tránsito
                      </Label>
                      <p className="text-sm">
                        {selectedQuote.transitTime} días
                      </p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium">
                        Válida hasta
                      </Label>
                      <p className="text-sm">{selectedQuote.validUntil}</p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium">Comisión</Label>
                      <p className="text-sm font-bold text-blue-600">
                        ${selectedQuote.commission} USD
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Operators */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">
                    Operadores Disponibles
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {selectedQuote.operators.map((operator, index) => (
                      <Badge key={index} variant="outline">
                        {operator}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Source Verification */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">
                    Verificación de Fuente
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center space-x-2">
                    {selectedQuote.sourceVerified ? (
                      <CheckCircle className="w-5 h-5 text-green-600" />
                    ) : (
                      <XCircle className="w-5 h-5 text-red-600" />
                    )}
                    <p className="text-sm">
                      {selectedQuote.sourceVerified
                        ? "Fuente verificada y confiable"
                        : "Fuente no verificada"}
                    </p>
                  </div>
                </CardContent>
              </Card>

              {/* Validation Notes */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Notas de Validación</CardTitle>
                </CardHeader>
                <CardContent>
                  <Textarea
                    placeholder="Añade notas sobre la validación de la cotización..."
                    value={validationNotes}
                    onChange={(e) => setValidationNotes(e.target.value)}
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
                onClick={() => setShowQuoteDialog(false)}
              >
                Cancelar
              </Button>
            </div>
            {selectedQuote?.status === "pending" && (
              <div className="flex space-x-2">
                <Button variant="destructive" onClick={handleRejectQuote}>
                  <XCircle className="w-4 h-4 mr-1" />
                  Rechazar
                </Button>
                <Button onClick={handleValidateQuote}>
                  <CheckCircle className="w-4 h-4 mr-1" />
                  Validar
                </Button>
              </div>
            )}
            {selectedQuote?.status === "validated" && (
              <Button
                onClick={handleApproveQuote}
                className="bg-green-600 hover:bg-green-700"
              >
                <Plus className="w-4 h-4 mr-1" />
                Generar Booking
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Booking Details Dialog */}
      <Dialog open={showBookingDialog} onOpenChange={setShowBookingDialog}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <FileText className="w-5 h-5" />
              Detalles del Booking: {selectedBooking?.bookingNumber}
            </DialogTitle>
          </DialogHeader>

          {selectedBooking && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium">
                    Número de Booking
                  </Label>
                  <p className="text-sm font-mono">
                    {selectedBooking.bookingNumber}
                  </p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Naviera</Label>
                  <p className="text-sm">{selectedBooking.shippingLine}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium">
                    Contenedor Asignado
                  </Label>
                  <p className="text-sm font-mono">
                    {selectedBooking.assignedContainer}
                  </p>
                </div>
                <div>
                  <Label className="text-sm font-medium">
                    Comisión Aplicada
                  </Label>
                  <p className="text-sm font-bold text-green-600">
                    ${selectedBooking.commission} USD
                  </p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Origen</Label>
                  <p className="text-sm">{selectedBooking.origin}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Destino</Label>
                  <p className="text-sm">{selectedBooking.destination}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium">
                    Fecha de Creación
                  </Label>
                  <p className="text-sm">{selectedBooking.createdDate}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Estado Actual</Label>
                  {getBookingStatusBadge(selectedBooking.status)}
                </div>
              </div>
            </div>
          )}

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowBookingDialog(false)}
            >
              Cerrar
            </Button>
            <Button
              onClick={() =>
                selectedBooking && exportBookingData(selectedBooking)
              }
            >
              <Download className="w-4 h-4 mr-1" />
              Exportar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
