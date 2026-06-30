import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { api } from '@/services/api'
import { API_ENDPOINTS } from '@/services/endpoints'

export interface Notification {
  id?: string
  _id?: string
  userId: string
  title: string
  message: string
  type: 'info' | 'success' | 'warning' | 'error' | 'reminder'
  isRead: boolean
  createdAt: string
  updatedAt: string
}

export const useNotificationsQuery = () => {
  return useQuery({
    queryKey: ['notifications'],
    queryFn: async () => {
      const response = await api.get<{
        success: boolean
        message: string
        data: {
          notifications: Notification[]
        }
      }>(API_ENDPOINTS.NOTIFICATIONS.LIST)

      return response.data?.notifications || []
    },
    // Poll every 30 seconds for new alerts/reminders
    refetchInterval: 30000,
  })
}

interface CreateNotificationPayload {
  title: string
  message: string
  type?: 'info' | 'success' | 'warning' | 'error' | 'reminder'
}

export const useCreateNotificationMutation = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (payload: CreateNotificationPayload) => {
      const response = await api.post<{
        success: boolean
        message: string
        data: {
          notification: Notification
        }
      }>(API_ENDPOINTS.NOTIFICATIONS.CREATE, payload)

      return response.data?.notification
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] })
    },
  })
}

export const useMarkAllReadMutation = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async () => {
      await api.post<{
        success: boolean
        message: string
        data: null
      }>(API_ENDPOINTS.NOTIFICATIONS.MARK_ALL_READ)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] })
    },
  })
}

export const useMarkReadMutation = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (id: string) => {
      await api.patch<{
        success: boolean
        message: string
        data: {
          notification: Notification
        }
      }>(API_ENDPOINTS.NOTIFICATIONS.MARK_READ(id))
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] })
    },
  })
}

export const useDeleteNotificationMutation = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (id: string) => {
      await api.delete<{
        success: boolean
        message: string
        data: null
      }>(API_ENDPOINTS.NOTIFICATIONS.DELETE(id))
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] })
    },
  })
}
