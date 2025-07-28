import axios, { type AxiosInstance, type AxiosRequestConfig, type AxiosResponse } from "axios"

/**
 * A custom error class to hold more context from API responses,
 * such as the HTTP status and the error body.
 */
export class ApiError extends Error {
  status: number
  body: any

  constructor(status: number, message: string, body: any) {
    super(message)
    this.name = "ApiError"
    this.status = status
    this.body = body
  }
}

// API Configuration
const API_BASE_URL = process.env.REACT_APP_API_URL || "https://suppliers-7zjy.onrender.com/api"

// Create axios instance
const apiClient: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000, // 30 seconds
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
})

// Request interceptor
apiClient.interceptors.request.use(
  (config) => {
    // Add auth token if available
    const token = localStorage.getItem("token")
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }

    // Add timestamp to prevent caching
    if (config.method === "get") {
      config.params = {
        ...config.params,
        _t: Date.now(),
      }
    }

    console.log(`🚀 API Request: ${config.method?.toUpperCase()} ${config.url}`)
    return config
  },
  (error) => {
    console.error("❌ Request Error:", error)
    return Promise.reject(error)
  },
)

// Response interceptor
apiClient.interceptors.response.use(
  (response: AxiosResponse) => {
    console.log(`✅ API Response: ${response.status} ${response.config.url}`)
    return response
  },
  (error) => {
    console.error("❌ Response Error:", error)

    // Handle specific error cases
    if (error.response) {
      const { status, data } = error.response

      switch (status) {
        case 401:
          // Unauthorized - clear token and redirect to login
          localStorage.removeItem("token")
          localStorage.removeItem("user")
          if (window.location.pathname !== "/login") {
            window.location.href = "/login"
          }
          break
        case 403:
          // Forbidden
          console.error("Access forbidden")
          break
        case 404:
          // Not found
          console.error("Resource not found")
          break
        case 429:
          // Too many requests
          console.error("Rate limit exceeded")
          break
        case 500:
          // Server error
          console.error("Internal server error")
          break
        default:
          console.error(`HTTP Error ${status}:`, data?.message || error.message)
      }

      // Return formatted error
      return Promise.reject({
        status,
        message: data?.error || data?.message || error.message,
        data: data,
      })
    } else if (error.request) {
      // Network error
      console.error("Network Error:", error.request)
      return Promise.reject({
        status: 0,
        message: "Network error. Please check your connection.",
        data: null,
      })
    } else {
      // Other error
      console.error("Error:", error.message)
      return Promise.reject({
        status: 0,
        message: error.message,
        data: null,
      })
    }
  },
)

// API methods
export const api = {
  // GET request
  get: async <T = any>(url: string, config?: AxiosRequestConfig): Promise<T> => {
    const response = await apiClient.get(url, config)
    return response.data
  },

  // POST request
  post: async <T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> => {
    const response = await apiClient.post(url, data, config)
    return response.data
  },

  // PUT request
  put: async <T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> => {
    const response = await apiClient.put(url, data, config)
    return response.data
  },

  // PATCH request
  patch: async <T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> => {
    const response = await apiClient.patch(url, data, config)
    return response.data
  },

  // DELETE request
  delete: async <T = any>(url: string, config?: AxiosRequestConfig): Promise<T> => {
    const response = await apiClient.delete(url, config)
    return response.data
  },

  // Upload file
  upload: async <T = any>(
    url: string,
    formData: FormData,
    onUploadProgress?: (progressEvent: any) => void,
  ): Promise<T> => {
    const response = await apiClient.post(url, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
      onUploadProgress,
    })
    return response.data
  },
}

// Hook for using API in components
export const useApi = () => {
  return api
}

// Health check function
export const checkApiHealth = async (): Promise<boolean> => {
  try {
    await api.get("/health")
    return true
  } catch (error) {
    console.error("API Health Check Failed:", error)
    return false
  }
}

export default apiClient
