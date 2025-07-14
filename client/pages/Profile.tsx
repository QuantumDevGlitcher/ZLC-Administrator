import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
  ArrowLeft,
  User,
  Mail,
  Shield,
  Key,
  Bell,
  Monitor,
  LogOut,
  Save,
  Eye,
  EyeOff,
  CheckCircle,
  AlertTriangle,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

interface UserProfile {
  name: string;
  email: string;
  role: string;
  roleType: "veracidad" | "calidad" | "aduana" | "logistica" | "soporte";
  avatar: string;
  joinDate: string;
  lastLogin: string;
}

interface NotificationPreferences {
  pushNotifications: boolean;
  emailNotifications: boolean;
  ticketUpdates: boolean;
  statusChanges: boolean;
  escalations: boolean;
}

interface AppPreferences {
  startView: "pending_tasks" | "activity_summary";
  theme: "light" | "dark" | "system";
  language: "es" | "en";
}

export default function Profile() {
  const navigate = useNavigate();
  const [showPasswordDialog, setShowPasswordDialog] = useState(false);
  const [showLogoutDialog, setShowLogoutDialog] = useState(false);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // Mock user data - in real app this would come from auth context/API
  const [userProfile] = useState<UserProfile>({
    name: "Juan Carlos Pérez",
    email: "juan.perez@zlcexpress.com",
    role: "Inspector de Calidad",
    roleType: "calidad",
    avatar: "/avatars/juan-perez.jpg",
    joinDate: "2023-06-15",
    lastLogin: "2024-01-15 09:30",
  });

  const [notifications, setNotifications] = useState<NotificationPreferences>({
    pushNotifications: true,
    emailNotifications: true,
    ticketUpdates: true,
    statusChanges: false,
    escalations: true,
  });

  const [preferences, setPreferences] = useState<AppPreferences>({
    startView: "pending_tasks",
    theme: "light",
    language: "es",
  });

  const handleBack = () => {
    // Navigate back to the appropriate module based on user role
    const roleRoutes = {
      veracidad: "/veracidad",
      calidad: "/calidad",
      aduana: "/aduana",
      logistica: "/logistica",
      soporte: "/soporte",
    };
    navigate(roleRoutes[userProfile.roleType]);
  };

  const handleChangePassword = async () => {
    if (!currentPassword || !newPassword || !confirmPassword) {
      alert("Todos los campos de contraseña son obligatorios");
      return;
    }

    if (newPassword !== confirmPassword) {
      alert("Las contraseñas nuevas no coinciden");
      return;
    }

    if (newPassword.length < 8) {
      alert("La nueva contraseña debe tener al menos 8 caracteres");
      return;
    }

    setIsLoading(true);

    // Mock password change - in real app this would call an API
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Mock validation
      if (currentPassword !== "current123") {
        throw new Error("Contraseña actual incorrecta");
      }

      alert("Contraseña actualizada correctamente");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      setShowPasswordDialog(false);
    } catch (error) {
      alert(
        error instanceof Error ? error.message : "Error al cambiar contraseña",
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleSavePreferences = () => {
    // Mock save preferences - in real app this would call an API
    alert("Preferencias guardadas correctamente");
  };

  const handleLogout = () => {
    setShowLogoutDialog(false);
    navigate("/");
  };

  const getRoleBadge = (role: string) => {
    const roleColors = {
      veracidad: "bg-blue-100 text-blue-800",
      calidad: "bg-green-100 text-green-800",
      aduana: "bg-purple-100 text-purple-800",
      logistica: "bg-orange-100 text-orange-800",
      soporte: "bg-red-100 text-red-800",
    };

    return (
      <Badge className={roleColors[userProfile.roleType]}>
        <Shield className="w-3 h-3 mr-1" />
        {role}
      </Badge>
    );
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-zlc-darkblue text-zlc-darkblue-foreground shadow-lg">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                onClick={handleBack}
                className="text-zlc-darkblue-foreground hover:bg-zlc-navy"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Volver
              </Button>
              <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center">
                <User className="w-6 h-6 text-zlc-darkblue" />
              </div>
              <div>
                <h1 className="text-xl font-bold">Perfil de Inspector</h1>
                <p className="text-zlc-darkblue-foreground/80 text-sm">
                  Configuración y Preferencias
                </p>
              </div>
            </div>
            <Button
              variant="ghost"
              onClick={() => setShowLogoutDialog(true)}
              className="text-zlc-darkblue-foreground hover:bg-zlc-navy"
            >
              <LogOut className="w-4 h-4 mr-2" />
              Cerrar Sesión
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Profile Information */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader className="text-center">
                <div className="w-24 h-24 bg-zlc-darkblue/10 rounded-full mx-auto mb-4 flex items-center justify-center">
                  <User className="w-12 h-12 text-zlc-darkblue" />
                </div>
                <CardTitle className="text-xl">{userProfile.name}</CardTitle>
                <CardDescription className="flex items-center justify-center mt-2">
                  {getRoleBadge(userProfile.role)}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center space-x-3">
                    <Mail className="w-4 h-4 text-muted-foreground" />
                    <div>
                      <p className="text-sm font-medium">Email Institucional</p>
                      <p className="text-sm text-muted-foreground">
                        {userProfile.email}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Shield className="w-4 h-4 text-muted-foreground" />
                    <div>
                      <p className="text-sm font-medium">Subrol Asignado</p>
                      <p className="text-sm text-muted-foreground">
                        {userProfile.role}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <User className="w-4 h-4 text-muted-foreground" />
                    <div>
                      <p className="text-sm font-medium">Fecha de Ingreso</p>
                      <p className="text-sm text-muted-foreground">
                        {userProfile.joinDate}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Monitor className="w-4 h-4 text-muted-foreground" />
                    <div>
                      <p className="text-sm font-medium">Último Acceso</p>
                      <p className="text-sm text-muted-foreground">
                        {userProfile.lastLogin}
                      </p>
                    </div>
                  </div>
                </div>

                <Button
                  onClick={() => setShowPasswordDialog(true)}
                  variant="outline"
                  className="w-full"
                >
                  <Key className="w-4 h-4 mr-2" />
                  Editar Contraseña
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Settings */}
          <div className="lg:col-span-2 space-y-6">
            {/* Notification Preferences */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Bell className="w-5 h-5" />
                  Preferencias de Notificaciones
                </CardTitle>
                <CardDescription>
                  Configura cómo y cuándo recibir notificaciones
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label className="text-sm font-medium">
                        Notificaciones Push
                      </Label>
                      <p className="text-sm text-muted-foreground">
                        Recibe notificaciones en tiempo real en el navegador
                      </p>
                    </div>
                    <Checkbox
                      checked={notifications.pushNotifications}
                      onCheckedChange={(checked) =>
                        setNotifications({
                          ...notifications,
                          pushNotifications: checked as boolean,
                        })
                      }
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label className="text-sm font-medium">
                        Notificaciones por Email
                      </Label>
                      <p className="text-sm text-muted-foreground">
                        Recibe resúmenes y alertas importantes por email
                      </p>
                    </div>
                    <Checkbox
                      checked={notifications.emailNotifications}
                      onCheckedChange={(checked) =>
                        setNotifications({
                          ...notifications,
                          emailNotifications: checked as boolean,
                        })
                      }
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label className="text-sm font-medium">
                        Actualizaciones de Tickets
                      </Label>
                      <p className="text-sm text-muted-foreground">
                        Notificar cuando haya nuevas respuestas o cambios
                      </p>
                    </div>
                    <Checkbox
                      checked={notifications.ticketUpdates}
                      onCheckedChange={(checked) =>
                        setNotifications({
                          ...notifications,
                          ticketUpdates: checked as boolean,
                        })
                      }
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label className="text-sm font-medium">
                        Cambios de Estado
                      </Label>
                      <p className="text-sm text-muted-foreground">
                        Notificar cambios de estado en órdenes y lotes
                      </p>
                    </div>
                    <Checkbox
                      checked={notifications.statusChanges}
                      onCheckedChange={(checked) =>
                        setNotifications({
                          ...notifications,
                          statusChanges: checked as boolean,
                        })
                      }
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label className="text-sm font-medium">
                        Escalaciones
                      </Label>
                      <p className="text-sm text-muted-foreground">
                        Alertas de alta prioridad y casos escalados
                      </p>
                    </div>
                    <Checkbox
                      checked={notifications.escalations}
                      onCheckedChange={(checked) =>
                        setNotifications({
                          ...notifications,
                          escalations: checked as boolean,
                        })
                      }
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* App Preferences */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Monitor className="w-5 h-5" />
                  Preferencias de Aplicación
                </CardTitle>
                <CardDescription>
                  Personaliza tu experiencia en la aplicación
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="start-view">Vista de Inicio</Label>
                    <Select
                      value={preferences.startView}
                      onValueChange={(value) =>
                        setPreferences({
                          ...preferences,
                          startView: value as
                            | "pending_tasks"
                            | "activity_summary",
                        })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="pending_tasks">
                          Lista de Tareas Pendientes
                        </SelectItem>
                        <SelectItem value="activity_summary">
                          Resumen de Actividad
                        </SelectItem>
                      </SelectContent>
                    </Select>
                    <p className="text-sm text-muted-foreground">
                      Elige qué ver al abrir la aplicación
                    </p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="theme">Tema</Label>
                    <Select
                      value={preferences.theme}
                      onValueChange={(value) =>
                        setPreferences({
                          ...preferences,
                          theme: value as "light" | "dark" | "system",
                        })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="light">Claro</SelectItem>
                        <SelectItem value="dark">Oscuro</SelectItem>
                        <SelectItem value="system">Sistema</SelectItem>
                      </SelectContent>
                    </Select>
                    <p className="text-sm text-muted-foreground">
                      Apariencia de la interfaz
                    </p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="language">Idioma</Label>
                    <Select
                      value={preferences.language}
                      onValueChange={(value) =>
                        setPreferences({
                          ...preferences,
                          language: value as "es" | "en",
                        })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="es">Español</SelectItem>
                        <SelectItem value="en">English</SelectItem>
                      </SelectContent>
                    </Select>
                    <p className="text-sm text-muted-foreground">
                      Idioma de la interfaz
                    </p>
                  </div>
                </div>

                <div className="pt-4">
                  <Button
                    onClick={handleSavePreferences}
                    className="bg-zlc-darkblue hover:bg-zlc-navy"
                  >
                    <Save className="w-4 h-4 mr-2" />
                    Guardar Preferencias
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Security Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="w-5 h-5" />
                  Información de Seguridad
                </CardTitle>
                <CardDescription>
                  Estado de seguridad de tu cuenta
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center space-x-3">
                      <CheckCircle className="w-5 h-5 text-green-600" />
                      <div>
                        <p className="text-sm font-medium">
                          Verificación de Email
                        </p>
                        <p className="text-sm text-muted-foreground">
                          Tu email institucional está verificado
                        </p>
                      </div>
                    </div>
                    <Badge className="bg-green-100 text-green-800">
                      Activo
                    </Badge>
                  </div>

                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center space-x-3">
                      <AlertTriangle className="w-5 h-5 text-yellow-600" />
                      <div>
                        <p className="text-sm font-medium">Última Contraseña</p>
                        <p className="text-sm text-muted-foreground">
                          Cambiada hace 45 días
                        </p>
                      </div>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setShowPasswordDialog(true)}
                    >
                      Cambiar
                    </Button>
                  </div>

                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center space-x-3">
                      <CheckCircle className="w-5 h-5 text-green-600" />
                      <div>
                        <p className="text-sm font-medium">Permisos de Rol</p>
                        <p className="text-sm text-muted-foreground">
                          Acceso completo a {userProfile.role}
                        </p>
                      </div>
                    </div>
                    <Badge className="bg-green-100 text-green-800">
                      Activo
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>

      {/* Password Change Dialog */}
      <Dialog open={showPasswordDialog} onOpenChange={setShowPasswordDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Key className="w-5 h-5" />
              Cambiar Contraseña
            </DialogTitle>
            <DialogDescription>
              Ingresa tu contraseña actual y elige una nueva contraseña segura
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="current-password">Contraseña Actual</Label>
              <div className="relative">
                <Input
                  id="current-password"
                  type={showCurrentPassword ? "text" : "password"}
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  placeholder="Ingresa tu contraseña actual"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                  onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                >
                  {showCurrentPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </Button>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="new-password">Nueva Contraseña</Label>
              <div className="relative">
                <Input
                  id="new-password"
                  type={showNewPassword ? "text" : "password"}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Mínimo 8 caracteres"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                  onClick={() => setShowNewPassword(!showNewPassword)}
                >
                  {showNewPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </Button>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirm-password">
                Confirmar Nueva Contraseña
              </Label>
              <div className="relative">
                <Input
                  id="confirm-password"
                  type={showConfirmPassword ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Repite la nueva contraseña"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </Button>
              </div>
            </div>

            {newPassword && (
              <div className="text-sm space-y-1">
                <p className="font-medium">Requisitos de contraseña:</p>
                <div className="space-y-1">
                  <div
                    className={`flex items-center space-x-2 ${newPassword.length >= 8 ? "text-green-600" : "text-muted-foreground"}`}
                  >
                    <CheckCircle className="w-3 h-3" />
                    <span>Mínimo 8 caracteres</span>
                  </div>
                  <div
                    className={`flex items-center space-x-2 ${/[A-Z]/.test(newPassword) ? "text-green-600" : "text-muted-foreground"}`}
                  >
                    <CheckCircle className="w-3 h-3" />
                    <span>Al menos una mayúscula</span>
                  </div>
                  <div
                    className={`flex items-center space-x-2 ${/[0-9]/.test(newPassword) ? "text-green-600" : "text-muted-foreground"}`}
                  >
                    <CheckCircle className="w-3 h-3" />
                    <span>Al menos un número</span>
                  </div>
                </div>
              </div>
            )}
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowPasswordDialog(false)}
              disabled={isLoading}
            >
              Cancelar
            </Button>
            <Button onClick={handleChangePassword} disabled={isLoading}>
              {isLoading ? "Cambiando..." : "Cambiar Contraseña"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Logout Confirmation Dialog */}
      <Dialog open={showLogoutDialog} onOpenChange={setShowLogoutDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <LogOut className="w-5 h-5" />
              Cerrar Sesión
            </DialogTitle>
            <DialogDescription>
              ¿Estás seguro que deseas cerrar tu sesión? Tendrás que volver a
              iniciar sesión para acceder al sistema.
            </DialogDescription>
          </DialogHeader>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowLogoutDialog(false)}
            >
              Cancelar
            </Button>
            <Button onClick={handleLogout} variant="destructive">
              <LogOut className="w-4 h-4 mr-2" />
              Cerrar Sesión
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
