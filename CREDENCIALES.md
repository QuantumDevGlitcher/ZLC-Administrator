# 🔐 Credenciales de Acceso - ZLC Administrator

## 📋 Cuentas Configuradas

Todas las cuentas utilizan la contraseña: **`password123`**

### 👑 Administrador General
- **Email:** `admin@zlc.com`
- **Rol:** Administrador
- **Redirección:** `/dashboard`
- **Permisos:** Acceso completo a todos los módulos

---

### 🔍 Inspector de Veracidad
- **Email:** `veracidad@zlcexpress.com`
- **Nombre:** Ana Martínez
- **Rol:** Inspector de Veracidad
- **Redirección:** `/veracidad`
- **Permisos:** Gestión de verificación de documentos

---

### ✅ Inspector de Calidad
- **Email:** `calidad@zlcexpress.com`
- **Nombre:** Carlos González
- **Rol:** Inspector de Calidad
- **Redirección:** `/calidad`
- **Permisos:** Gestión de inspección de lotes

---

### 🛃 Inspector de Aduana
- **Email:** `aduana@zlcexpress.com`
- **Nombre:** Elena Rodríguez
- **Rol:** Inspector de Aduana
- **Redirección:** `/aduana`
- **Permisos:** Gestión de órdenes proforma y documentos aduaneros

---

### 🚚 Inspector de Logística
- **Email:** `logistica@zlcexpress.com`
- **Nombre:** Miguel Torres
- **Rol:** Inspector de Logística
- **Redirección:** `/logistica`
- **Permisos:** Gestión de bookings y embarques

---

### 🎧 Administrador de Soporte
- **Email:** `soporte@zlcexpress.com`
- **Nombre:** Laura Hernández
- **Rol:** Administrador de Soporte
- **Redirección:** `/soporte`
- **Permisos:** Gestión de tickets y soporte técnico

---

## 🔄 Sistema de Redirección Automática

El sistema está configurado para redirigir automáticamente a cada usuario a su módulo correspondiente basado en su rol:

1. **Backend** identifica el rol del usuario
2. **Backend** devuelve la URL de redirección apropiada
3. **Frontend** redirige automáticamente al usuario

## 🧪 Pruebas de Acceso

Para probar el sistema:

1. Ve a la página de login
2. Usa cualquiera de las credenciales listadas arriba
3. El sistema te redirigirá automáticamente a tu módulo correspondiente
4. Verifica que tengas acceso solo a las funciones de tu rol

## 🔒 Seguridad

- Todas las contraseñas están hasheadas con bcrypt
- Los tokens JWT incluyen información del rol y permisos
- Cada módulo valida los permisos del usuario

---

*Nota: Estas credenciales son para desarrollo. En producción, se deben cambiar todas las contraseñas y configurar un sistema de gestión de usuarios más robusto.*
