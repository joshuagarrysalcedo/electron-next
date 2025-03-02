const { ipcMain } = require('electron');
const https = require('https');
const http = require('http');
const { URL } = require('url');

// Default API configuration
const API_CONFIG = {
  baseUrl: process.env.API_BASE_URL || 'https://api.example.com',
  timeout: 30000, // 30 seconds
  headers: {
    'Content-Type': 'application/json',
  },
};

// API request handler for Electron
class ApiHandler {
  constructor(config = API_CONFIG) {
    this.baseUrl = config.baseUrl;
    this.headers = { ...config.headers };
    this.timeout = config.timeout;
    
    // Initialize IPC handlers
    this.setupIpcHandlers();
  }

  // Set up IPC handlers for API requests
  setupIpcHandlers() {
    ipcMain.on('api-request', async (event, request) => {
      const { requestId, method, endpoint, data } = request;
      
      try {
        const result = await this.makeRequest(method, endpoint, data);
        
        // Send response back to renderer
        event.sender.send('api-response', {
          requestId,
          result
        });
      } catch (error) {
        // Send error back to renderer
        event.sender.send('api-response', {
          requestId,
          result: {
            error: {
              code: 'REQUEST_FAILED',
              message: error.message || 'Unknown error',
              details: error
            },
            status: 0
          }
        });
      }
    });
  }

  // Set auth token for requests
  setAuthToken(token) {
    if (token) {
      this.headers['Authorization'] = `Bearer ${token}`;
    } else {
      delete this.headers['Authorization'];
    }
  }

  // Make HTTP request
  makeRequest(method, endpoint, data) {
    return new Promise((resolve, reject) => {
      const url = new URL(`${this.baseUrl}${endpoint}`);
      const isHttps = url.protocol === 'https:';
      const client = isHttps ? https : http;
      
      // Prepare the request options
      const options = {
        hostname: url.hostname,
        port: url.port || (isHttps ? 443 : 80),
        path: url.pathname + url.search,
        method: method,
        headers: { ...this.headers },
        timeout: this.timeout
      };

      // Handle query parameters for GET requests
      if (method === 'GET' && data) {
        const params = new URLSearchParams();
        Object.entries(data).forEach(([key, value]) => {
          params.append(key, String(value));
        });
        
        options.path += (url.search ? '&' : '?') + params.toString();
      }

      // Create the request
      const req = client.request(options, (res) => {
        let responseData = '';
        
        // Collect response data
        res.on('data', (chunk) => {
          responseData += chunk;
        });
        
        // Process the complete response
        res.on('end', () => {
          try {
            const parsedData = responseData ? JSON.parse(responseData) : {};
            
            resolve({
              data: parsedData,
              status: res.statusCode
            });
          } catch (error) {
            resolve({
              error: {
                code: 'PARSE_ERROR',
                message: 'Failed to parse response',
                details: error
              },
              status: res.statusCode
            });
          }
        });
      });

      // Handle request errors
      req.on('error', (error) => {
        reject({
          error: {
            code: 'NETWORK_ERROR',
            message: error.message,
            details: error
          },
          status: 0
        });
      });

      // Handle request timeout
      req.on('timeout', () => {
        req.destroy();
        reject({
          error: {
            code: 'TIMEOUT',
            message: 'Request timeout',
            details: null
          },
          status: 0
        });
      });

      // Send request body for non-GET methods
      if (method !== 'GET' && data) {
        req.write(JSON.stringify(data));
      }
      
      req.end();
    });
  }
}

// Export the API handler
module.exports = ApiHandler;