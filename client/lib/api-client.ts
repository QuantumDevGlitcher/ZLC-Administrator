// Production API Client with real backend connection
const API_BASE_URL = 'http://localhost:5000/api';

export interface LoginResponse {
  status: string;
  message: string;
  data: {
    user: {
      id: string;
      email: string;
      firstName: string;
      lastName: string;
      role: string;
      permissions: string[];
      lastLogin?: Date;
    };
    tokens: {
      accessToken: string;
      refreshToken: string;
      expiresIn: string;
    };
  };
}

export class ApiClient {
  private accessToken: string | null = null;
  
  constructor() {
    this.accessToken = localStorage.getItem('accessToken');
  }
  
  private async request(endpoint: string, options: RequestInit = {}): Promise<any> {
    const url = `${API_BASE_URL}${endpoint}`;
    
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      ...options.headers,
    };

    if (this.accessToken) {
      headers['Authorization'] = `Bearer ${this.accessToken}`;
    }

    try {
      console.log('[API] Haciendo request a:', url, 'con headers:', headers);
      const response = await fetch(url, {
        ...options,
        headers,
      });

      console.log('[API] Response status:', response.status, 'statusText:', response.statusText);

      if (!response.ok) {
        if (response.status === 401) {
          console.log('[API] Error 401 - No autorizado, haciendo logout');
          this.logout();
          throw new Error('No autorizado');
        }
        const errorText = await response.text();
        console.log('[API] Error response body:', errorText);
        
        let errorData;
        try {
          errorData = JSON.parse(errorText);
        } catch {
          errorData = { message: errorText };
        }
        
        throw new Error(errorData.message || `HTTP ${response.status}: ${response.statusText}`);
      }

      const responseText = await response.text();
      console.log('[API] Response text:', responseText);
      
      if (!responseText) {
        return {};
      }
      
      return JSON.parse(responseText);
    } catch (error) {
      console.log('[API] Catch error:', error);
      if (error instanceof Error) {
        throw error;
      }
      throw new Error('Error de red');
    }
  }
  
  public isAuthenticated(): boolean {
    return Boolean(this.accessToken);
  }
  
  public getCurrentUser(): any {
    const userData = localStorage.getItem('userData');
    return userData ? JSON.parse(userData) : null;
  }
  
  // Authentication methods
  async login(credentials: { email: string; password: string }): Promise<LoginResponse> {
    const response = await this.request('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
    
    if (response.status === 'success' && response.data.tokens.accessToken) {
      this.accessToken = response.data.tokens.accessToken;
      localStorage.setItem('accessToken', response.data.tokens.accessToken);
      localStorage.setItem('userData', JSON.stringify(response.data.user));
    }
    
    return response;
  }
  
  async logout(): Promise<void> {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('userData');
    this.accessToken = null;
  }
  
  async getProfile(): Promise<any> {
    return this.request('/auth/profile');
  }

  // Calidad methods
  async getCalidadDashboard(): Promise<any> {
    return this.request('/calidad/dashboard');
  }
  
  async getCalidadInspecciones(): Promise<any[]> {
    return this.request('/calidad/inspecciones');
  }
  
  async getCalidadNoConformidades(): Promise<any[]> {
    return this.request('/calidad/no-conformidades');
  }
  
  async getCalidadCertificados(): Promise<any[]> {
    return this.request('/calidad/certificados');
  }
  
  async createCalidadInspeccion(data: any): Promise<any> {
    return this.request('/calidad/inspecciones', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }
  
  async updateCalidadInspeccion(id: string, data: any): Promise<any> {
    return this.request(`/calidad/inspecciones/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  // Logística methods
  async getLogisticaDashboard(): Promise<any> {
    return this.request('/logistica/dashboard');
  }
  
  async getLogisticaEnvios(): Promise<any> {
    return this.request('/logistica/envios');
  }
  
  async getLogisticaRutas(): Promise<any> {
    return this.request('/logistica/rutas');
  }
  
  async getLogisticaAlmacenes(): Promise<any> {
    return this.request('/logistica/almacenes');
  }
  
  async createLogisticaEnvio(data: any): Promise<any> {
    return this.request('/logistica/envios', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }
  
  async createLogisticaRuta(data: any): Promise<any> {
    return this.request('/logistica/rutas', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }
  
  async updateLogisticaEnvio(id: string, data: any): Promise<any> {
    return this.request(`/logistica/envios/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  // Soporte methods
  async getSoporteDashboard(): Promise<any> {
    return this.request('/soporte/dashboard');
  }
  
  async getSoporteTickets(queryString?: string): Promise<any> {
    const url = `/soporte/tickets${queryString ? '?' + queryString : ''}`;
    console.log('Making request to:', url);
    return this.request(url);
  }

  async getTicket(id: string): Promise<any> {
    return this.request(`/soporte/tickets/${id}`);
  }
  
  async getSoporteAgentes(): Promise<any> {
    return this.request('/soporte/agentes');
  }
  
  async getSoporteFAQs(): Promise<any> {
    return this.request('/soporte/faqs');
  }
  
  async createSoporteTicket(data: any): Promise<any> {
    return this.request('/soporte/tickets', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async updateTicket(id: string, data: any): Promise<any> {
    return this.request(`/soporte/tickets/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async addTicketComment(ticketId: string, data: any): Promise<any> {
    return this.request(`/soporte/tickets/${ticketId}/comentarios`, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  // Note: The backend doesn't have assign/status endpoints, so we'll use update
  async assignTicket(ticketId: string, agenteId: string): Promise<any> {
    return this.request(`/soporte/tickets/${ticketId}`, {
      method: 'PUT',
      body: JSON.stringify({ 
        agenteAsignado: { id: agenteId, nombre: agenteId } // Will be updated by backend logic
      }),
    });
  }

  async changeTicketStatus(ticketId: string, estado: string): Promise<any> {
    return this.request(`/soporte/tickets/${ticketId}`, {
      method: 'PUT',
      body: JSON.stringify({ estado }),
    });
  }

  async closeTicket(ticketId: string, data: any): Promise<any> {
    return this.request(`/soporte/tickets/${ticketId}`, {
      method: 'PUT',
      body: JSON.stringify({ ...data, estado: 'CERRADO' }),
    });
  }

  async uploadTicketEvidence(ticketId: string, file: File): Promise<any> {
    const formData = new FormData();
    formData.append('archivo', file);
    
    const headers: HeadersInit = {};
    if (this.accessToken) {
      headers['Authorization'] = `Bearer ${this.accessToken}`;
    }
    
    const response = await fetch(`${API_BASE_URL}/soporte/tickets/${ticketId}/evidencias`, {
      method: 'POST',
      headers,
      body: formData,
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(error || `HTTP error! status: ${response.status}`);
    }

    return response.json();
  }
  
  async createSoporteFAQ(data: any): Promise<any> {
    return this.request('/soporte/faqs', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }
  
  async respondSoporteTicket(id: string, data: any): Promise<any> {
    return this.request(`/soporte/tickets/${id}/respond`, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  // Veracidad methods
  async getVeracidadDashboard(): Promise<any> {
    return this.request('/veracidad/dashboard');
  }
  
  async getVeracidadVerificaciones(queryString?: string): Promise<any> {
    const url = `/veracidad/verificaciones${queryString ? '?' + queryString : ''}`;
    return this.request(url);
  }

  async getVeracidadVerificacion(id: string): Promise<any> {
    return this.request(`/veracidad/verificaciones/${id}`);
  }
  
  async getVeracidadConfiguraciones(): Promise<any[]> {
    return this.request('/veracidad/configuraciones');
  }
  
  async getVeracidadAuditorias(): Promise<any[]> {
    return this.request('/veracidad/auditorias');
  }
  
  async createVeracidadVerificacion(data: any): Promise<any> {
    return this.request('/veracidad/verificaciones', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }
  
  async createVeracidadConfiguracion(data: any): Promise<any> {
    return this.request('/veracidad/configuraciones', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }
  
  async updateVeracidadVerificacion(id: string, data: any): Promise<any> {
    return this.request(`/veracidad/verificaciones/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }
  
  async processVeracidadVerificacion(id: string): Promise<any> {
    return this.request(`/veracidad/verificaciones/${id}/procesar`, {
      method: 'POST',
    });
  }
  
  async getVeracidadBlockchain(id: string): Promise<any> {
    return this.request(`/veracidad/blockchain/${id}`);
  }

  // Aduana methods
  async getAduanaDashboard(): Promise<any> {
    return this.request('/aduana/dashboard');
  }
  
  async getAduanaDocumentos(params?: any): Promise<any> {
    const queryParams = params ? '?' + new URLSearchParams(params).toString() : '';
    return this.request(`/aduana/documentos${queryParams}`);
  }
  
  async getAduanaOrdenes(): Promise<any> {
    return this.request('/aduana/ordenes');
  }
  
  async getAduanaEstadisticas(): Promise<any> {
    return this.request('/aduana/estadisticas');
  }
  
  async createAduanaDocumento(data: any): Promise<any> {
    return this.request('/aduana/documentos', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }
  
  async createAduanaOrden(data: any): Promise<any> {
    return this.request('/aduana/ordenes', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }
  
  async getAduanaDocumento(id: string): Promise<any> {
    return this.request(`/aduana/documentos/${id}`);
  }

  async getAduanaOrden(id: string): Promise<any> {
    return this.request(`/aduana/ordenes/${id}`);
  }

  async aprobarDocumentoOrden(ordenId: string, tipoDocumento: string): Promise<any> {
    return this.request(`/aduana/documentos/${ordenId}/aprobar/${tipoDocumento}`, {
      method: 'POST',
    });
  }

  async rechazarDocumentoOrden(ordenId: string, tipoDocumento: string, comentario: string): Promise<any> {
    return this.request(`/aduana/documentos/${ordenId}/rechazar/${tipoDocumento}`, {
      method: 'POST',
      body: JSON.stringify({ comentario }),
    });
  }

  // Métodos para plantillas
  async getPlantillas(tipo?: string): Promise<any> {
    const params = tipo ? `?tipo=${tipo}` : '';
    return this.request(`/aduana/plantillas${params}`);
  }

  async createPlantilla(data: any): Promise<any> {
    return this.request('/aduana/plantillas', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async deletePlantilla(id: string): Promise<any> {
    return this.request(`/aduana/plantillas/${id}`, {
      method: 'DELETE',
    });
  }

  // Métodos para regulaciones
  async getRegulaciones(): Promise<any> {
    return this.request('/aduana/regulaciones');
  }

  async updateRegulacion(id: string, contenido: string): Promise<any> {
    return this.request(`/aduana/regulaciones/${id}`, {
      method: 'PUT',
      body: JSON.stringify({ contenido }),
    });
  }

  // ==================== MÉTODOS DE CALIDAD - LOTES ====================

  // Obtener lotes con filtros y paginación
  async getLotes(params?: {
    search?: string;
    estado?: string;
    categoria?: string;
    fechaInicio?: string;
    fechaFin?: string;
    page?: number;
    limit?: number;
  }): Promise<any> {
    const searchParams = new URLSearchParams();
    if (params?.search) searchParams.append('search', params.search);
    if (params?.estado) searchParams.append('estado', params.estado);
    if (params?.categoria) searchParams.append('categoria', params.categoria);
    if (params?.fechaInicio) searchParams.append('fechaInicio', params.fechaInicio);
    if (params?.fechaFin) searchParams.append('fechaFin', params.fechaFin);
    if (params?.page) searchParams.append('page', params.page.toString());
    if (params?.limit) searchParams.append('limit', params.limit.toString());
    
    const query = searchParams.toString();
    return this.request(`/calidad/lotes${query ? `?${query}` : ''}`);
  }

  // Obtener lote específico
  async getLote(id: string): Promise<any> {
    return this.request(`/calidad/lotes/${id}`);
  }

  // Aprobar lote con comentario opcional
  async aprobarLote(id: string, comentario?: string): Promise<any> {
    return this.request(`/calidad/lotes/${id}/aprobar`, {
      method: 'PATCH',
      body: JSON.stringify({ comentario }),
    });
  }

  // Rechazar lote con comentario requerido
  async rechazarLote(id: string, comentario: string): Promise<any> {
    return this.request(`/calidad/lotes/${id}/rechazar`, {
      method: 'PATCH',
      body: JSON.stringify({ comentario }),
    });
  }

  // Descargar documento técnico de lote
  async getDocumentoTecnico(loteId: string, documentoId: string): Promise<any> {
    return this.request(`/calidad/lotes/${loteId}/documentos/${documentoId}`);
  }

  // Obtener galería de imágenes de lote
  async getImagenesLote(id: string): Promise<any> {
    return this.request(`/calidad/lotes/${id}/imagenes`);
  }
}

export const apiClient = new ApiClient();
export default apiClient;