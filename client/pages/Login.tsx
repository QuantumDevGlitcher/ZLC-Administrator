import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Eye,
  EyeOff,
  Package,
  AlertCircle,
  Building2,
  FileText,
  Ship,
  Headphones,
  Info,
  Copy,
} from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import { useToast } from "@/hooks/use-toast";

// Define roles for the application
const ROLES = {
  veracidad: {
    name: "Veracidad",
    description: "Verificación documental",
    route: "/veracidad",
  },
  calidad: {
    name: "Calidad",
    description: "Inspección de lotes",
    route: "/calidad",
  },
  aduana: {
    name: "Aduana",
    description: "Órdenes proforma",
    route: "/aduana",
  },
  logistica: {
    name: "Logística",
    description: "Bookings y embarques",
    route: "/logistica",
  },
  soporte: {
    name: "Soporte",
    description: "Tickets de incidencia",
    route: "/soporte",
  },
};

export default function Login() {
  /*
  ===== CREDENCIALES DE PRUEBA PARA DESARROLLO =====
  Usa estas credenciales para probar diferentes roles:

  Administrador General:
  - admin@zlc.com / password123

  Inspector de Veracidad:
  - veracidad@zlcexpress.com / password123

  Inspector de Calidad:
  - calidad@zlcexpress.com / password123

  Inspector de Aduana:
  - aduana@zlcexpress.com / password123

  Inspector de Logística:
  - logistica@zlcexpress.com / password123

  Administrador de Soporte:
  - soporte@zlcexpress.com / password123

  Nota: Estas credenciales son solo para desarrollo
  ============================================
  */

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [showCredentials, setShowCredentials] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();
  const { toast } = useToast();

  // Test credentials for development
  const testCredentials = [
    { email: "admin@zlc.com", role: "Administrador", name: "Admin Sistema" },
    { email: "veracidad@zlcexpress.com", role: "Veracidad", name: "Ana Martínez" },
    { email: "calidad@zlcexpress.com", role: "Calidad", name: "Carlos González" },
    { email: "aduana@zlcexpress.com", role: "Aduana", name: "Elena Rodríguez" },
    { email: "logistica@zlcexpress.com", role: "Logística", name: "Miguel Torres" },
    { email: "soporte@zlcexpress.com", role: "Soporte", name: "Laura Hernández" },
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      console.log('🔵 Login Page - Attempting login with:', { email });
      
      const response = await login({ email, password });
      
      console.log('✅ Login Page - Login successful, navigating...');
      
      // Use the redirectUrl from backend response if available
      const redirectUrl = response?.redirectUrl;
      
      if (redirectUrl) {
        console.log('🔀 Redirecting to:', redirectUrl);
        navigate(redirectUrl);
      } else {
        // Fallback to email-based routing for backward compatibility
        if (email.includes('aduana')) {
          navigate("/aduana");
        } else if (email.includes('calidad')) {
          navigate("/calidad");
        } else if (email.includes('logistica')) {
          navigate("/logistica");
        } else if (email.includes('soporte')) {
          navigate("/soporte");
        } else if (email.includes('veracidad')) {
          navigate("/veracidad");
        } else {
          navigate("/dashboard"); // Default to dashboard
        }
      }
    } catch (err) {
      console.error('❌ Login Page - Login failed:', err);
      setError(err instanceof Error ? err.message : "Error de autenticación");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopyCredentials = (email: string) => {
    navigator.clipboard.writeText(`${email} / password123`);
    toast({
      title: "Credenciales copiadas",
      description: `${email} / password123`,
    });
  };

  const handleQuickLogin = async (email: string) => {
    setEmail(email);
    setPassword("password123");
    
    // Auto-submit after setting credentials
    setTimeout(async () => {
      try {
        const response = await login({ email, password: "password123" });
        const redirectUrl = response?.redirectUrl;
        
        if (redirectUrl) {
          navigate(redirectUrl);
        } else {
          navigate("/dashboard");
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "Error de autenticación");
      }
    }, 100);
  };

  const handleForgotPassword = (e: React.FormEvent) => {
    e.preventDefault();
    // Mock password reset
    alert(
      "Se ha enviado un enlace de restablecimiento a tu email institucional",
    );
    setShowForgotPassword(false);
  };

  if (showForgotPassword) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-zlc-darkblue via-zlc-navy to-background p-4">
        <Card className="w-full max-w-md shadow-2xl border-0">
          <CardHeader className="space-y-1 text-center">
            <div className="flex justify-center mb-4">
              <div className="w-16 h-16 bg-zlc-darkblue rounded-2xl flex items-center justify-center">
                <Package className="w-8 h-8 text-zlc-darkblue-foreground" />
              </div>
            </div>
            <CardTitle className="text-2xl font-bold text-zlc-darkblue">
              Recuperar Contraseña
            </CardTitle>
            <CardDescription>
              Ingresa tu email institucional para recibir un enlace de
              restablecimiento
            </CardDescription>
          </CardHeader>
          <form onSubmit={handleForgotPassword}>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="reset-email">Correo Electrónico</Label>
                <Input
                  id="reset-email"
                  type="email"
                  placeholder="usuario@zlcexpress.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
            </CardContent>
            <CardFooter className="flex flex-col space-y-3">
              <Button
                type="submit"
                className="w-full bg-zlc-darkblue hover:bg-zlc-navy"
              >
                Enviar Enlace
              </Button>
              <Button
                type="button"
                variant="ghost"
                onClick={() => setShowForgotPassword(false)}
                className="w-full"
              >
                Volver al inicio de sesión
              </Button>
            </CardFooter>
          </form>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-zlc-darkblue via-zlc-navy to-background p-4">
      <div className="w-full max-w-md space-y-4">
        {/* Development Credentials - Remove in Production */}
        {process.env.NODE_ENV === "development" && (
          <Card className="bg-blue-50 border-blue-200 shadow-lg">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm text-blue-800">
                  🔧 Credenciales de Prueba
                </CardTitle>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowCredentials(!showCredentials)}
                  className="text-blue-600 hover:text-blue-800"
                >
                  <Info className="w-4 h-4" />
                </Button>
              </div>
              <CardDescription className="text-xs text-blue-600">
                Todas usan contraseña: password123
              </CardDescription>
            </CardHeader>
            {showCredentials && (
              <CardContent className="pt-0">
                <div className="grid grid-cols-1 gap-2">
                  {testCredentials.map((cred) => (
                    <div key={cred.email} className="flex items-center gap-2">
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => handleQuickLogin(cred.email)}
                        className="flex-1 justify-start text-xs bg-white hover:bg-blue-100 border-blue-300"
                      >
                        <Building2 className="w-3 h-3 mr-2 text-blue-600" />
                        <span className="flex-1 text-left">
                          <span className="font-medium text-blue-800">
                            {cred.role}:
                          </span>
                          <span className="text-blue-600 ml-1 block truncate">
                            {cred.email}
                          </span>
                        </span>
                      </Button>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => handleCopyCredentials(cred.email)}
                        className="text-blue-600 hover:text-blue-800"
                      >
                        <Copy className="w-3 h-3" />
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            )}
          </Card>
        )}

        {/* Main Login Card */}
        <Card className="shadow-2xl border-0">
          <CardHeader className="space-y-1 text-center">
            <div className="flex justify-center mb-4">
              <div className="w-16 h-16 bg-zlc-darkblue rounded-2xl flex items-center justify-center">
                <Package className="w-8 h-8 text-zlc-darkblue-foreground" />
              </div>
            </div>
            <CardTitle className="text-2xl font-bold text-zlc-darkblue">
              Iniciar Sesión
            </CardTitle>
            <CardDescription>
              Accede a tu panel de administración ZLC
            </CardDescription>
          </CardHeader>

          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-4">
              {error && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <div className="space-y-2">
                <Label htmlFor="email">Correo Electrónico</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="usuario@zlcexpress.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Contraseña</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Ingresa tu contraseña"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                    onClick={() => setShowPassword(!showPassword)}
                    aria-label={showPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4 text-muted-foreground" />
                    ) : (
                      <Eye className="h-4 w-4 text-muted-foreground" />
                    )}
                  </Button>
                </div>
              </div>
            </CardContent>

            <CardFooter className="flex flex-col space-y-3">
              <Button
                type="submit"
                className="w-full bg-zlc-darkblue hover:bg-zlc-navy"
                disabled={isLoading}
              >
                {isLoading ? "Iniciando sesión..." : "Iniciar Sesión"}
              </Button>

              <Button
                type="button"
                variant="ghost"
                onClick={() => setShowForgotPassword(true)}
                className="w-full text-sm"
              >
                ¿Olvidaste tu contraseña?
              </Button>
            </CardFooter>
          </form>
        </Card>

        {/* Role Information Cards */}
        <div className="mt-8 grid grid-cols-2 md:grid-cols-5 gap-3">
          {Object.entries(ROLES).map(([key, role]) => (
            <Card
              key={key}
              className="p-3 text-center bg-white/10 backdrop-blur border-white/20 hover:bg-white/20 transition-colors"
            >
              <div className="flex flex-col items-center space-y-2">
                {key === "veracidad" && (
                  <Building2 className="w-6 h-6 text-zlc-darkblue-foreground" />
                )}
                {key === "calidad" && (
                  <Package className="w-6 h-6 text-zlc-darkblue-foreground" />
                )}
                {key === "aduana" && (
                  <FileText className="w-6 h-6 text-zlc-darkblue-foreground" />
                )}
                {key === "logistica" && (
                  <Ship className="w-6 h-6 text-zlc-darkblue-foreground" />
                )}
                {key === "soporte" && (
                  <Headphones className="w-6 h-6 text-zlc-darkblue-foreground" />
                )}
                <div>
                  <h3 className="font-medium text-sm text-zlc-darkblue-foreground">
                    {role.name}
                  </h3>
                  <p className="text-xs text-zlc-darkblue-foreground/80">
                    {role.description}
                  </p>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
