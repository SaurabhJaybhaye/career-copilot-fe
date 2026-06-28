import axios from 'axios'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api/v1'

const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Request Interceptor to inject bearer token
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token')
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Response Interceptor for handling token refresh and global errors
axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config
    
    // Prevent infinite loops
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true
      
      try {
        // Attempt to refresh token
        const refreshToken = localStorage.getItem('refreshToken')
        if (refreshToken) {
          const response = await axios.post(`${API_BASE_URL}/auth/refresh-token`, { refreshToken })
          const { accessToken, token } = response.data.data || {}
          const newToken = accessToken || token
          
          if (newToken) {
            localStorage.setItem('token', newToken)
            axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${newToken}`
            originalRequest.headers['Authorization'] = `Bearer ${newToken}`
            return axiosInstance(originalRequest)
          }
        }
      } catch (refreshError) {
        // Refresh token failed or expired -> log out user
        localStorage.removeItem('token')
        localStorage.removeItem('refreshToken')
        window.location.href = '/login'
        return Promise.reject(refreshError)
      }
    }
    
    // Global error message extraction
    const errorMessage = error.response?.data?.message || 'An unexpected error occurred'
    return Promise.reject(new Error(errorMessage))
  }
)

export default axiosInstance
