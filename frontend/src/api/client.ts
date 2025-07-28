import axios, { type AxiosInstance, type AxiosResponse } from "axios"

const API_BASE_URL = process.env.REACT_APP_API_URL || "https://suppliers-7zjy.onrender.com/api"

class ApiClient {
  private client: AxiosInstance

  constructor() {
    this.client = axios.create({
      baseURL: API_BASE_URL,
      timeout: 30000,
      headers: {
        "Content-Type": "application/json",
      },
    })

    // Request interceptor to add auth token
    this.client.interceptors.request.use(
      (config) => {
        const token = localStorage.getItem("token")
        if (token) {
          config.headers.Authorization = `Bearer ${token}`
        }

        // Add user ID for cart operations
        const userId = localStorage.getItem("userId") || "guest"
        config.headers["user-id"] = userId

        return config
      },
      (error) => {
        return Promise.reject(error)
      },
    )

    // Response interceptor for error handling
    this.client.interceptors.response.use(
      (response: AxiosResponse) => response,
      (error) => {
        if (error.response?.status === 401) {
          localStorage.removeItem("token")
          localStorage.removeItem("user")
          localStorage.removeItem("userId")
          window.location.href = "/login"
        }
        return Promise.reject(error)
      },
    )
  }

  async get<T>(url: string, params?: any): Promise<T> {
    const response = await this.client.get<T>(url, { params })
    return response.data
  }

  async post<T>(url: string, data?: any): Promise<T> {
    const response = await this.client.post<T>(url, data)
    return response.data
  }

  async put<T>(url: string, data?: any): Promise<T> {
    const response = await this.client.put<T>(url, data)
    return response.data
  }

  async delete<T>(url: string): Promise<T> {
    const response = await this.client.delete<T>(url)
    return response.data
  }

  async patch<T>(url: string, data?: any): Promise<T> {
    const response = await this.client.patch<T>(url, data)
    return response.data
  }
}

export const apiClient = new ApiClient()

// Hook for using the API client
export const useApi = () => {
  return apiClient
}

export default apiClient
