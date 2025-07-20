/**
 * API Configuration and Types for ZLC Administrator
 * Shared between client and server for type safety
 */

// API Configuration
export const API_CONFIG = {
  BASE_URL: import.meta.env.VITE_API_URL || 'http://localhost:5000',
  ENDPOINTS: {
    // Authentication
    AUTH: {
      LOGIN: '/api/auth/login',
      REGISTER: '/api/auth/register',
      REFRESH: '/api/auth/refresh',
      LOGOUT: '/api/auth/logout',
      FORGOT_PASSWORD: '/api/auth/forgot-password',
      RESET_PASSWORD: '/api/auth/reset-password',
      VERIFY_EMAIL: '/api/auth/verify-email',
    },
    // Users
    USERS: {
      PROFILE: '/api/users/profile',
      UPDATE_PROFILE: '/api/users/profile',
      DELETE_ACCOUNT: '/api/users/account',
    },
    // System Modules
    ADUANA: '/api/aduana',
    CALIDAD: '/api/calidad',
    LOGISTICA: '/api/logistica',
    SOPORTE: '/api/soporte',
    VERACIDAD: '/api/veracidad',
    // System
    HEALTH: '/api/health',
    DOCS: '/api/docs',
  }
} as const;

// Authentication Types
export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  status: 'success' | 'fail' | 'error';
  message: string;
  data?: {
    user: User;
    tokens: {
      accessToken: string;
      refreshToken: string;
      expiresIn: number;
    };
  };
}

export interface RegisterRequest {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
}

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: string;
  permissions: string[];
  isEmailVerified: boolean;
  isActive: boolean;
  createdAt: string;
  lastLogin?: string;
}

// API Response Types
export interface ApiResponse<T = any> {
  status: 'success' | 'fail' | 'error';
  message: string;
  data?: T;
  timestamp: string;
}

export interface HealthResponse {
  status: string;
  message: string;
  timestamp: string;
  environment: string;
}

// Error Types
export interface ApiError {
  status: 'fail' | 'error';
  message: string;
  timestamp: string;
  errors?: Record<string, string[]>;
}

// Module Data Types
export interface AduanaDocument {
  id: string;
  title: string;
  type: string;
  status: string;
  createdAt: string;
  updatedAt: string;
}

export interface CalidadInspection {
  id: string;
  productName: string;
  inspector: string;
  status: 'pending' | 'approved' | 'rejected';
  date: string;
  notes?: string;
}

export interface LogisticaShipment {
  id: string;
  trackingNumber: string;
  origin: string;
  destination: string;
  status: 'in_transit' | 'delivered' | 'pending';
  estimatedDelivery: string;
}

export interface SoporteTicket {
  id: string;
  title: string;
  description: string;
  priority: 'low' | 'medium' | 'high' | 'critical';
  status: 'open' | 'in_progress' | 'resolved' | 'closed';
  createdAt: string;
  assignedTo?: string;
}

export interface VeracidadVerification {
  id: string;
  documentType: string;
  documentNumber: string;
  status: 'verified' | 'pending' | 'rejected';
  verifiedAt?: string;
  verifiedBy?: string;
}

/**
 * Example response type for /api/demo
 */
export interface DemoResponse {
  message: string;
}
