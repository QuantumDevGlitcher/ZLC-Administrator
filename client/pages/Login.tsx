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
import { Eye, EyeOff, Package, AlertCircle } from "lucide-react";

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
  ===== TEST CREDENTIALS FOR DEVELOPMENT =====
  Use these credentials to test different roles:

  Veracidad (Truth Inspector):
  - veracidad@zlcexpress.com / veracidad123
  - maria.garcia@zlcexpress.com / password123

  Calidad (Quality Inspector):
  - calidad@zlcexpress.com / calidad123
  - juan.perez@zlcexpress.com / password123

  Aduana (Customs Inspector):
  - aduana@zlcexpress.com / aduana123
  - carlos.lopez@zlcexpress.com / password123

  Logística (Logistics Inspector):
  - logistica@zlcexpress.com / logistica123
  - ana.torres@zlcexpress.com / password123

  Soporte (Support Administrator):
  - soporte@zlcexpress.com / soporte123
  - pedro.silva@zlcexpress.com / password123

  Note: Remove this section when implementing real authentication
  ============================================
  */

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      // TODO: Replace with actual API call to authenticate user
      // const response = await fetch('/api/auth/login', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ email, password })
      // });
      // const userData = await response.json();

      // Simulate API authentication
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Mock role assignment based on email domain
      if (!email.includes("@zlcexpress.com")) {
        throw new Error("Debe usar un email institucional (@zlcexpress.com)");
      }

      // ===== HARDCODED CREDENTIALS FOR TESTING - REMOVE WHEN IMPLEMENTING DATABASE =====
      // This section contains hardcoded user credentials for testing purposes.
      // When implementing real database authentication, delete everything between these comments
      // and replace with actual database user validation.

      const testCredentials = {
        // Veracidad Inspector
        "veracidad@zlcexpress.com": {
          password: "veracidad123",
          role: "veracidad",
          name: "Inspector de Veracidad",
        },
        // Quality Inspector
        "calidad@zlcexpress.com": {
          password: "calidad123",
          role: "calidad",
          name: "Inspector de Calidad",
        },
        // Customs Inspector
        "aduana@zlcexpress.com": {
          password: "aduana123",
          role: "aduana",
          name: "Inspector Aduanero",
        },
        // Logistics Inspector
        "logistica@zlcexpress.com": {
          password: "logistica123",
          role: "logistica",
          name: "Inspector Logístico",
        },
        // Support Administrator
        "soporte@zlcexpress.com": {
          password: "soporte123",
          role: "soporte",
          name: "Administrador de Soporte",
        },
        // Additional test users for each role
        "juan.perez@zlcexpress.com": {
          password: "password123",
          role: "calidad",
          name: "Juan Carlos Pérez",
        },
        "maria.garcia@zlcexpress.com": {
          password: "password123",
          role: "veracidad",
          name: "María García",
        },
        "carlos.lopez@zlcexpress.com": {
          password: "password123",
          role: "aduana",
          name: "Carlos López",
        },
        "ana.torres@zlcexpress.com": {
          password: "password123",
          role: "logistica",
          name: "Ana Torres",
        },
        "pedro.silva@zlcexpress.com": {
          password: "password123",
          role: "soporte",
          name: "Pedro Silva",
        },
      };

      // Validate hardcoded credentials
      const user = testCredentials[email as keyof typeof testCredentials];
      if (!user || user.password !== password) {
        throw new Error("Email o contraseña incorrectos");
      }

      // Get role from hardcoded user data
      const userRole = user.role;

      // ===== END OF HARDCODED CREDENTIALS SECTION =====
      // When implementing database authentication, replace the above section with:
      // const userRole = userData.role; // Get from API response

      // TODO: Get user role and permissions from API response
      // const userRole = userData.role;
      // const userPermissions = userData.permissions;

      // Note: userRole is now obtained from hardcoded credentials above
      // When database is implemented, userRole will come from API response

      // Redirect based on role from database
      const role = ROLES[userRole as keyof typeof ROLES];
      if (role) {
        navigate(role.route);
      } else {
        throw new Error("Usuario sin rol asignado");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error de autenticación");
    } finally {
      setIsLoading(false);
    }
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
                <Label htmlFor="reset-email">Email Institucional</Label>
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
      <Card className="w-full max-w-md shadow-2xl border-0">
        <CardHeader className="space-y-1 text-center">
          <div className="flex justify-center mb-6">
            <div className="w-20 h-20 bg-zlc-darkblue rounded-3xl flex items-center justify-center shadow-lg">
              <Package className="w-10 h-10 text-zlc-darkblue-foreground" />
            </div>
          </div>
          <CardTitle className="text-3xl font-bold text-zlc-darkblue">
            ZLC Express
          </CardTitle>
          <CardDescription className="text-lg">
            Panel de Administración
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
                className="h-12"
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
                  className="h-12 pr-10"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                  onClick={() => setShowPassword(!showPassword)}
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
          <CardFooter className="flex flex-col space-y-4">
            <Button
              type="submit"
              className="w-full h-12 bg-zlc-darkblue hover:bg-zlc-navy text-lg font-semibold"
              disabled={isLoading}
            >
              {isLoading ? "Iniciando sesión..." : "Iniciar Sesión"}
            </Button>

            <Button
              type="button"
              variant="link"
              onClick={() => setShowForgotPassword(true)}
              className="text-zlc-darkblue hover:text-zlc-navy"
            >
              ¿Olvidaste tu contraseña?
            </Button>
          </CardFooter>
        </form>
      </Card>

      {/* Development Credentials Hint - Remove in Production */}
      {process.env.NODE_ENV === "development" && (
        <div className="mt-4 w-full max-w-md">
          <Card className="bg-blue-50 border-blue-200">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm text-blue-800">
                🔧 Credenciales de Prueba
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="text-xs text-blue-700 space-y-1">
                <p>
                  <strong>Veracidad:</strong> veracidad@zlcexpress.com /
                  veracidad123
                </p>
                <p>
                  <strong>Calidad:</strong> calidad@zlcexpress.com / calidad123
                </p>
                <p>
                  <strong>Aduana:</strong> aduana@zlcexpress.com / aduana123
                </p>
                <p>
                  <strong>Logística:</strong> logistica@zlcexpress.com /
                  logistica123
                </p>
                <p>
                  <strong>Soporte:</strong> soporte@zlcexpress.com / soporte123
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
