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

    // Simulate authentication
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Mock role assignment based on email domain
      if (!email.includes("@zlcexpress.com")) {
        throw new Error("Debe usar un email institucional (@zlcexpress.com)");
      }

      // Mock role detection from email
      const emailPrefix = email.split("@")[0];
      let userRole = "";

      if (emailPrefix.includes("veracidad")) userRole = "veracidad";
      else if (emailPrefix.includes("calidad")) userRole = "calidad";
      else if (emailPrefix.includes("aduana")) userRole = "aduana";
      else if (emailPrefix.includes("logistica")) userRole = "logistica";
      else if (emailPrefix.includes("soporte")) userRole = "soporte";
      else userRole = "veracidad"; // Default role for demo

      // Redirect based on role
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
              <Label htmlFor="email">Email Institucional</Label>
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

      {/* Role Information Panel */}
      <div className="hidden lg:block absolute top-8 right-8 w-80">
        <Card className="bg-white/95 backdrop-blur-sm border-0 shadow-xl">
          <CardHeader>
            <CardTitle className="text-zlc-darkblue">
              Roles del Sistema
            </CardTitle>
            <CardDescription>Accesos por departamento</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {Object.entries(ROLES).map(([key, role]) => (
              <div
                key={key}
                className="flex items-center space-x-3 p-2 rounded-lg bg-zlc-darkblue/5"
              >
                <div className="w-2 h-2 bg-zlc-darkblue rounded-full"></div>
                <div>
                  <p className="font-medium text-zlc-darkblue">{role.name}</p>
                  <p className="text-sm text-muted-foreground">
                    {role.description}
                  </p>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
