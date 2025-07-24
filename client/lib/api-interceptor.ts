// API Interceptor to connect ZLC-Administrator 2 pages to our real backend
// This allows us to use the beautiful UI from ZLC-Administrator 2 with real data

import { apiClient } from './api-client';

// Flag to prevent intercepting our own apiClient calls
let isIntercepting = false;

// Override fetch globally to intercept API calls from the pages
const originalFetch = window.fetch;

window.fetch = async function(input: RequestInfo | URL, init?: RequestInit): Promise<Response> {
  const url = input.toString();
  
  // Don't intercept if we're already intercepting (prevent infinite loops)
  if (isIntercepting) {
    return originalFetch(input, init);
  }
  
  // Don't intercept external URLs or backend calls
  if (url.startsWith('http://localhost:5000') || 
      (url.startsWith('http') && !url.includes('localhost:8080'))) {
    return originalFetch(input, init);
  }
  
  // Only intercept relative API calls from the UI pages
  if (!url.includes('/api/')) {
    return originalFetch(input, init);
  }
  
  try {
    console.log('🔄 Intercepting API call:', url);
    isIntercepting = true;
    
    // Extract the endpoint from the URL
    const endpoint = url.split('/api')[1];
    
    // Handle different HTTP methods
    const method = init?.method || 'GET';
    const body = init?.body ? JSON.parse(init.body as string) : undefined;
    
    let result;
    
    // Route API calls to our backend methods
    switch (true) {
      // Aduana endpoints
      case endpoint.startsWith('/aduana/dashboard'):
        result = await apiClient.getAduanaDashboard();
        break;
      case endpoint.startsWith('/aduana/documentos'):
        result = await apiClient.getAduanaDocumentos();
        break;
      case endpoint.startsWith('/aduana/ordenes') && method === 'POST':
        result = await apiClient.createAduanaOrden(body);
        break;
      case endpoint.startsWith('/aduana/ordenes'):
        result = await apiClient.getAduanaOrdenes();
        break;
        
      // Calidad endpoints  
      case endpoint.startsWith('/calidad/dashboard'):
        result = await apiClient.getCalidadDashboard();
        break;
      case endpoint.startsWith('/calidad/inspecciones') && method === 'POST':
        result = await apiClient.createCalidadInspeccion(body);
        break;
      case endpoint.startsWith('/calidad/inspecciones'):
        result = await apiClient.getCalidadInspecciones();
        break;
        
      // Logistica endpoints
      case endpoint.startsWith('/logistica/dashboard'):
        result = await apiClient.getLogisticaDashboard();
        break;
      case endpoint.startsWith('/logistica/envios') && method === 'POST':
        result = await apiClient.createLogisticaEnvio(body);
        break;
      case endpoint.startsWith('/logistica/envios'):
        result = await apiClient.getLogisticaEnvios();
        break;
        
      // Soporte endpoints
      case endpoint.startsWith('/soporte/dashboard'):
        result = await apiClient.getSoporteDashboard();
        break;
      case endpoint.startsWith('/soporte/tickets') && method === 'POST':
        result = await apiClient.createSoporteTicket(body);
        break;
      case endpoint.startsWith('/soporte/tickets'):
        result = await apiClient.getSoporteTickets();
        break;
        
      // Veracidad endpoints
      case endpoint.startsWith('/veracidad/dashboard'):
        result = await apiClient.getVeracidadDashboard();
        break;
      case endpoint.startsWith('/veracidad/verificaciones') && method === 'POST':
        result = await apiClient.createVeracidadVerificacion(body);
        break;
      case endpoint.startsWith('/veracidad/verificaciones'):
        result = await apiClient.getVeracidadVerificaciones();
        break;
        
      default:
        console.log('⚠️  Unhandled API endpoint, using original fetch:', endpoint);
        isIntercepting = false;
        return originalFetch(input, init);
    }
    
    // Create a mock Response object
    const response = new Response(JSON.stringify(result), {
      status: 200,
      statusText: 'OK',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    
    console.log('✅ API call intercepted and handled:', url);
    isIntercepting = false;
    return response;
    
  } catch (error) {
    console.error('❌ Error in API interceptor:', error);
    isIntercepting = false;
    
    // Create error response
    const errorResponse = new Response(JSON.stringify({
      error: error instanceof Error ? error.message : 'Unknown error',
      success: false
    }), {
      status: 500,
      statusText: 'Internal Server Error',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    
    return errorResponse;
  }
};

export {};
