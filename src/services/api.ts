import axiosInstance from './axios'

export const api = {
  get: <T>(url: string, config = {}) => axiosInstance.get<T>(url, config).then((r) => r.data),
  post: <T>(url: string, data = {}, config = {}) => axiosInstance.post<T>(url, data, config).then((r) => r.data),
  put: <T>(url: string, data = {}, config = {}) => axiosInstance.put<T>(url, data, config).then((r) => r.data),
  patch: <T>(url: string, data = {}, config = {}) => axiosInstance.patch<T>(url, data, config).then((r) => r.data),
  delete: <T>(url: string, config = {}) => axiosInstance.delete<T>(url, config).then((r) => r.data),
}
