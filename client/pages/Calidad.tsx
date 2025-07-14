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
  Package,
  FileText,
  CheckCircle,
  XCircle,
  Clock,
  AlertTriangle,
  Eye,
  Download,
  Filter,
  Calendar,
  Scale,
  Building,
  Image,
  FileCheck,
  TrendingDown,
  RefreshCw,
  Camera,
  ClipboardList,
  Beaker,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

interface Batch {
  id: string;
  code: string;
  category: string;
  weight: number;
  supplier: string;
  date: string;
  status: "pending" | "manual_review" | "approved" | "rejected";
  stockPercentage: number;
  evidence: {
    technicalSheet: {
      uploaded: boolean;
      url?: string;
    };
    labReport: {
      uploaded: boolean;
      url?: string;
    };
    images: {
      product: string[];
      pallets: string[];
      boxes: string[];
      container: string[];
    };
  };
  comments?: string;
  rejectionReason?: string;
}

export default function Calidad() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [selectedBatch, setSelectedBatch] = useState<Batch | null>(null);
  const [showInspectionDialog, setShowInspectionDialog] = useState(false);
  const [showCriticalStockDialog, setShowCriticalStockDialog] = useState(false);
  const [rejectionComments, setRejectionComments] = useState("");
  const [selectedImageGallery, setSelectedImageGallery] = useState<{
    type: string;
    images: string[];
  } | null>(null);
  const navigate = useNavigate();

  const handleLogout = () => {
    navigate("/");
  };

  // Mock data for demonstration
  const [batches, setBatches] = useState<Batch[]>([
    {
      id: "BATCH-001",
      code: "LOT-2024-001",
      category: "Electrónicos",
      weight: 2500,
      supplier: "Tech Solutions Ltd",
      date: "2024-01-15",
      status: "pending",
      stockPercentage: 85,
      evidence: {
        technicalSheet: { uploaded: true, url: "/docs/tech-sheet-001.pdf" },
        labReport: { uploaded: true, url: "/docs/lab-report-001.pdf" },
        images: {
          product: ["/img/product-001-1.jpg", "/img/product-001-2.jpg"],
          pallets: ["/img/pallet-001.jpg"],
          boxes: ["/img/box-001-1.jpg", "/img/box-001-2.jpg"],
          container: ["/img/container-001.jpg"],
        },
      },
    },
    {
      id: "BATCH-002",
      code: "LOT-2024-002",
      category: "Textiles",
      weight: 1800,
      supplier: "Fashion Global Inc",
      date: "2024-01-12",
      status: "approved",
      stockPercentage: 92,
      evidence: {
        technicalSheet: { uploaded: true, url: "/docs/tech-sheet-002.pdf" },
        labReport: { uploaded: false },
        images: {
          product: ["/img/product-002-1.jpg"],
          pallets: ["/img/pallet-002.jpg"],
          boxes: ["/img/box-002-1.jpg"],
          container: ["/img/container-002.jpg"],
        },
      },
    },
    {
      id: "BATCH-003",
      code: "LOT-2024-003",
      category: "Alimentos",
      weight: 3200,
      supplier: "Food Express SAC",
      date: "2024-01-10",
      status: "rejected",
      stockPercentage: 15,
      evidence: {
        technicalSheet: { uploaded: true, url: "/docs/tech-sheet-003.pdf" },
        labReport: { uploaded: true, url: "/docs/lab-report-003.pdf" },
        images: {
          product: ["/img/product-003-1.jpg"],
          pallets: [],
          boxes: ["/img/box-003-1.jpg"],
          container: [],
        },
      },
      rejectionReason:
        "Falta foto del interior de caja y montaje del contenedor",
    },
    {
      id: "BATCH-004",
      code: "LOT-2024-004",
      category: "Cosméticos",
      weight: 950,
      supplier: "Beauty World Ltd",
      date: "2024-01-08",
      status: "manual_review",
      stockPercentage: 18,
      evidence: {
        technicalSheet: { uploaded: true, url: "/docs/tech-sheet-004.pdf" },
        labReport: { uploaded: false },
        images: {
          product: ["/img/product-004-1.jpg", "/img/product-004-2.jpg"],
          pallets: ["/img/pallet-004.jpg"],
          boxes: ["/img/box-004-1.jpg"],
          container: ["/img/container-004.jpg"],
        },
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
      case "manual_review":
        return (
          <Badge variant="secondary" className="bg-blue-100 text-blue-800">
            <FileCheck className="w-3 h-3 mr-1" />
            Revisión Manual
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
            <XCircle className="w-3 h-3 mr-1" />
            Rechazado
          </Badge>
        );
      default:
        return null;
    }
  };

  const getStockBadge = (percentage: number) => {
    if (percentage <= 20) {
      return (
        <Badge variant="destructive" className="ml-2">
          <TrendingDown className="w-3 h-3 mr-1" />
          Stock Crítico ({percentage}%)
        </Badge>
      );
    }
    return (
      <Badge variant="secondary" className="ml-2 bg-green-100 text-green-800">
        Stock OK ({percentage}%)
      </Badge>
    );
  };

  const filteredBatches = batches.filter((batch) => {
    const matchesSearch =
      batch.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      batch.supplier.toLowerCase().includes(searchTerm.toLowerCase()) ||
      batch.category.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus =
      statusFilter === "all" || batch.status === statusFilter;
    const matchesCategory =
      categoryFilter === "all" || batch.category === categoryFilter;

    return matchesSearch && matchesStatus && matchesCategory;
  });

  const criticalStockBatches = batches.filter(
    (batch) => batch.stockPercentage <= 20,
  );

  const openBatchInspection = (batch: Batch) => {
    setSelectedBatch(batch);
    setRejectionComments(batch.rejectionReason || "");
    setShowInspectionDialog(true);
  };

  const handleApproveBatch = () => {
    if (!selectedBatch) return;

    const updatedBatch = {
      ...selectedBatch,
      status: "approved" as const,
    };

    setBatches(
      batches.map((b) => (b.id === selectedBatch.id ? updatedBatch : b)),
    );
    setShowInspectionDialog(false);

    alert(`Lote ${selectedBatch.code} aprobado correctamente.`);
  };

  const handleRejectBatch = () => {
    if (!selectedBatch || !rejectionComments.trim()) {
      alert("Debe proporcionar un comentario para rechazar el lote.");
      return;
    }

    const updatedBatch = {
      ...selectedBatch,
      status: "rejected" as const,
      rejectionReason: rejectionComments,
    };

    setBatches(
      batches.map((b) => (b.id === selectedBatch.id ? updatedBatch : b)),
    );
    setShowInspectionDialog(false);

    alert(`Lote ${selectedBatch.code} rechazado. Notificación enviada.`);
  };

  const handleConfirmProduction = (batchId: string) => {
    const batch = batches.find((b) => b.id === batchId);
    if (batch) {
      alert(`Nueva producción confirmada para lote ${batch.code}`);
    }
  };

  const openImageGallery = (type: string, images: string[]) => {
    setSelectedImageGallery({ type, images });
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-zlc-darkblue text-zlc-darkblue-foreground shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-4">
              <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center">
                <Package className="w-6 h-6 text-zlc-darkblue" />
              </div>
              <div>
                <h1 className="text-xl font-bold">Control de Lotes</h1>
                <p className="text-zlc-darkblue-foreground/80 text-sm">
                  Inspector de Calidad
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                onClick={() => setShowCriticalStockDialog(true)}
                className="text-zlc-darkblue-foreground hover:bg-zlc-navy relative"
              >
                <TrendingDown className="w-4 h-4 mr-2" />
                Stock Crítico
                {criticalStockBatches.length > 0 && (
                  <Badge className="ml-2 bg-red-500 text-white">
                    {criticalStockBatches.length}
                  </Badge>
                )}
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
            Lotes Pendientes de Inspección
          </h2>
          <p className="text-muted-foreground">
            Revisa y valida los lotes por contenedor antes del envío
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
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label htmlFor="search">Buscar lote</Label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                  <Input
                    id="search"
                    placeholder="Código, proveedor o categoría..."
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
                    <SelectItem value="manual_review">
                      Revisión Manual
                    </SelectItem>
                    <SelectItem value="approved">Aprobado</SelectItem>
                    <SelectItem value="rejected">Rechazado</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label>Categoría</Label>
                <Select
                  value={categoryFilter}
                  onValueChange={setCategoryFilter}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Todas las categorías" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todas</SelectItem>
                    <SelectItem value="Electrónicos">Electrónicos</SelectItem>
                    <SelectItem value="Textiles">Textiles</SelectItem>
                    <SelectItem value="Alimentos">Alimentos</SelectItem>
                    <SelectItem value="Cosméticos">Cosméticos</SelectItem>
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
                Lotes Pendientes
              </CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-zlc-darkblue">
                {batches.filter((b) => b.status === "pending").length}
              </div>
              <p className="text-xs text-muted-foreground">
                Requieren inspección
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Revisión Manual
              </CardTitle>
              <FileCheck className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">
                {batches.filter((b) => b.status === "manual_review").length}
              </div>
              <p className="text-xs text-muted-foreground">
                Requieren atención especial
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Aprobados Hoy
              </CardTitle>
              <CheckCircle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">
                {batches.filter((b) => b.status === "approved").length}
              </div>
              <p className="text-xs text-muted-foreground">+20% vs ayer</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Stock Crítico
              </CardTitle>
              <TrendingDown className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">
                {criticalStockBatches.length}
              </div>
              <p className="text-xs text-muted-foreground">
                Requieren reposición
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Batches Table */}
        <Card>
          <CardHeader>
            <CardTitle>Lista de Lotes</CardTitle>
            <CardDescription>
              Lotes registrados para inspección ({filteredBatches.length}{" "}
              resultados)
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {filteredBatches.map((batch) => (
                <div
                  key={batch.id}
                  className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                >
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-zlc-darkblue/10 rounded-lg flex items-center justify-center">
                      <Package className="w-6 h-6 text-zlc-darkblue" />
                    </div>
                    <div className="space-y-1">
                      <p className="font-medium">{batch.code}</p>
                      <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                        <span className="flex items-center">
                          <ClipboardList className="w-3 h-3 mr-1" />
                          {batch.category}
                        </span>
                        <span className="flex items-center">
                          <Scale className="w-3 h-3 mr-1" />
                          {batch.weight} kg
                        </span>
                        <span className="flex items-center">
                          <Building className="w-3 h-3 mr-1" />
                          {batch.supplier}
                        </span>
                        <span className="flex items-center">
                          <Calendar className="w-3 h-3 mr-1" />
                          {batch.date}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    {getStatusBadge(batch.status)}
                    {getStockBadge(batch.stockPercentage)}
                    <Button
                      size="sm"
                      onClick={() => openBatchInspection(batch)}
                      className="bg-zlc-darkblue hover:bg-zlc-navy"
                    >
                      <Eye className="w-4 h-4 mr-1" />
                      Inspeccionar
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </main>

      {/* Batch Inspection Dialog */}
      <Dialog
        open={showInspectionDialog}
        onOpenChange={setShowInspectionDialog}
      >
        <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Package className="w-5 h-5" />
              Inspección: {selectedBatch?.code}
            </DialogTitle>
            <DialogDescription>
              Revisa todas las evidencias antes de aprobar o rechazar el lote
            </DialogDescription>
          </DialogHeader>

          {selectedBatch && (
            <div className="space-y-6">
              {/* Batch Info */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">
                    Información del Lote
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label className="text-sm font-medium">Código</Label>
                      <p className="text-sm">{selectedBatch.code}</p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium">Categoría</Label>
                      <p className="text-sm">{selectedBatch.category}</p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium">Peso</Label>
                      <p className="text-sm">{selectedBatch.weight} kg</p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium">Proveedor</Label>
                      <p className="text-sm">{selectedBatch.supplier}</p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium">Fecha</Label>
                      <p className="text-sm">{selectedBatch.date}</p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium">
                        Stock Disponible
                      </Label>
                      <p className="text-sm">
                        {selectedBatch.stockPercentage}%
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Evidence Visualization */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <FileCheck className="w-5 h-5" />
                    Visualización de Evidencias
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Documents */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center space-x-3">
                        <FileText className="w-5 h-5 text-zlc-darkblue" />
                        <div>
                          <p className="font-medium">Ficha Técnica</p>
                          <p className="text-sm text-muted-foreground">
                            Especificaciones del producto
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        {selectedBatch.evidence.technicalSheet.uploaded ? (
                          <Badge className="bg-green-100 text-green-800">
                            Disponible
                          </Badge>
                        ) : (
                          <Badge variant="secondary">No disponible</Badge>
                        )}
                        {selectedBatch.evidence.technicalSheet.uploaded && (
                          <Button size="sm" variant="outline">
                            <Download className="w-3 h-3 mr-1" />
                            Ver
                          </Button>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center space-x-3">
                        <Beaker className="w-5 h-5 text-zlc-darkblue" />
                        <div>
                          <p className="font-medium">Informe de Laboratorio</p>
                          <p className="text-sm text-muted-foreground">
                            Análisis de calidad
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        {selectedBatch.evidence.labReport.uploaded ? (
                          <Badge className="bg-green-100 text-green-800">
                            Disponible
                          </Badge>
                        ) : (
                          <Badge variant="secondary">No disponible</Badge>
                        )}
                        {selectedBatch.evidence.labReport.uploaded && (
                          <Button size="sm" variant="outline">
                            <Download className="w-3 h-3 mr-1" />
                            Ver
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Image Gallery */}
                  <div>
                    <Label className="text-base font-medium mb-3 block">
                      Galería de Imágenes
                    </Label>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div
                        className="p-4 border rounded-lg cursor-pointer hover:bg-muted/50 transition-colors"
                        onClick={() =>
                          openImageGallery(
                            "Producto",
                            selectedBatch.evidence.images.product,
                          )
                        }
                      >
                        <div className="flex flex-col items-center text-center">
                          <Camera className="w-8 h-8 text-zlc-darkblue mb-2" />
                          <p className="font-medium">Producto</p>
                          <p className="text-sm text-muted-foreground">
                            {selectedBatch.evidence.images.product.length} fotos
                          </p>
                        </div>
                      </div>

                      <div
                        className="p-4 border rounded-lg cursor-pointer hover:bg-muted/50 transition-colors"
                        onClick={() =>
                          openImageGallery(
                            "Paletas",
                            selectedBatch.evidence.images.pallets,
                          )
                        }
                      >
                        <div className="flex flex-col items-center text-center">
                          <Package className="w-8 h-8 text-zlc-darkblue mb-2" />
                          <p className="font-medium">Paletas</p>
                          <p className="text-sm text-muted-foreground">
                            {selectedBatch.evidence.images.pallets.length} fotos
                          </p>
                        </div>
                      </div>

                      <div
                        className="p-4 border rounded-lg cursor-pointer hover:bg-muted/50 transition-colors"
                        onClick={() =>
                          openImageGallery(
                            "Cajas",
                            selectedBatch.evidence.images.boxes,
                          )
                        }
                      >
                        <div className="flex flex-col items-center text-center">
                          <Package className="w-8 h-8 text-zlc-darkblue mb-2" />
                          <p className="font-medium">Cajas</p>
                          <p className="text-sm text-muted-foreground">
                            {selectedBatch.evidence.images.boxes.length} fotos
                          </p>
                        </div>
                      </div>

                      <div
                        className="p-4 border rounded-lg cursor-pointer hover:bg-muted/50 transition-colors"
                        onClick={() =>
                          openImageGallery(
                            "Contenedor",
                            selectedBatch.evidence.images.container,
                          )
                        }
                      >
                        <div className="flex flex-col items-center text-center">
                          <Building className="w-8 h-8 text-zlc-darkblue mb-2" />
                          <p className="font-medium">Contenedor</p>
                          <p className="text-sm text-muted-foreground">
                            {selectedBatch.evidence.images.container.length}{" "}
                            fotos
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Rejection Comments */}
              {selectedBatch.status === "rejected" ||
              selectedBatch.rejectionReason ? (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg text-red-600">
                      Motivo de Rechazo
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm">
                      {selectedBatch.rejectionReason ||
                        "No se especificó motivo"}
                    </p>
                  </CardContent>
                </Card>
              ) : (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">
                      Comentarios de Inspección
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Textarea
                      placeholder="Añade comentarios sobre la inspección (obligatorio para rechazo)..."
                      value={rejectionComments}
                      onChange={(e) => setRejectionComments(e.target.value)}
                      className="min-h-[100px]"
                    />
                  </CardContent>
                </Card>
              )}
            </div>
          )}

          <DialogFooter className="flex justify-between">
            <div className="flex space-x-2">
              <Button
                variant="outline"
                onClick={() => setShowInspectionDialog(false)}
              >
                Cancelar
              </Button>
            </div>
            {selectedBatch?.status !== "approved" &&
              selectedBatch?.status !== "rejected" && (
                <div className="flex space-x-2">
                  <Button
                    variant="destructive"
                    onClick={handleRejectBatch}
                    className="flex items-center gap-2"
                  >
                    <XCircle className="w-4 h-4" />
                    Rechazar Lote
                  </Button>
                  <Button
                    onClick={handleApproveBatch}
                    className="bg-green-600 hover:bg-green-700 flex items-center gap-2"
                  >
                    <CheckCircle className="w-4 h-4" />
                    Aprobar Lote
                  </Button>
                </div>
              )}
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Critical Stock Dialog */}
      <Dialog
        open={showCriticalStockDialog}
        onOpenChange={setShowCriticalStockDialog}
      >
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <TrendingDown className="w-5 h-5 text-red-600" />
              Seguimiento de Stock Crítico
            </DialogTitle>
            <DialogDescription>
              Lotes con inventario en riesgo (menos del 20% disponible)
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            {criticalStockBatches.length > 0 ? (
              criticalStockBatches.map((batch) => (
                <div
                  key={batch.id}
                  className="flex items-center justify-between p-4 border rounded-lg"
                >
                  <div className="flex items-center space-x-4">
                    <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
                      <TrendingDown className="w-5 h-5 text-red-600" />
                    </div>
                    <div>
                      <p className="font-medium">{batch.code}</p>
                      <p className="text-sm text-muted-foreground">
                        {batch.category} - {batch.supplier}
                      </p>
                      <p className="text-sm text-red-600 font-medium">
                        Stock disponible: {batch.stockPercentage}%
                      </p>
                    </div>
                  </div>
                  <Button
                    onClick={() => handleConfirmProduction(batch.id)}
                    className="bg-green-600 hover:bg-green-700 flex items-center gap-2"
                  >
                    <RefreshCw className="w-4 h-4" />
                    Confirmar Nueva Producción
                  </Button>
                </div>
              ))
            ) : (
              <div className="text-center py-8">
                <CheckCircle className="w-12 h-12 text-green-600 mx-auto mb-4" />
                <p className="text-lg font-medium">Sin stock crítico</p>
                <p className="text-muted-foreground">
                  Todos los lotes tienen inventario suficiente
                </p>
              </div>
            )}
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowCriticalStockDialog(false)}
            >
              Cerrar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Image Gallery Dialog */}
      <Dialog
        open={!!selectedImageGallery}
        onOpenChange={() => setSelectedImageGallery(null)}
      >
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Image className="w-5 h-5" />
              Galería: {selectedImageGallery?.type}
            </DialogTitle>
          </DialogHeader>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {selectedImageGallery?.images.map((image, index) => (
              <div
                key={index}
                className="aspect-square bg-muted rounded-lg flex items-center justify-center"
              >
                <Image className="w-12 h-12 text-muted-foreground" />
                <p className="text-sm text-muted-foreground ml-2">
                  Imagen {index + 1}
                </p>
              </div>
            ))}
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setSelectedImageGallery(null)}
            >
              Cerrar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
