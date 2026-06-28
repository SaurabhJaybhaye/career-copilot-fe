import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { api } from '@/services/api'
import { API_ENDPOINTS } from '@/services/endpoints'
import { useAppDispatch } from './store'
import { updateUserPreferences } from '@/features/auth/authSlice'
import type { User } from '@/features/auth/authSlice'

export const useProfileQuery = () => {
  const dispatch = useAppDispatch()

  return useQuery({
    queryKey: ['profile'],
    queryFn: async () => {
      const response = await api.get<{
        success: boolean
        message: string
        data: {
          user: User
        }
      }>(API_ENDPOINTS.PROFILE.GET)

      // Handle envelope structure
      const user = response.data?.user || (response.data as unknown as User)
      
      if (user && user.preferences) {
        dispatch(updateUserPreferences(user.preferences))
      }
      return user
    },
  })
}

interface UpdateProfilePayload {
  firstName?: string
  lastName?: string
  preferences?: {
    notificationsEnabled?: boolean
  }
}

export const useUpdateProfileMutation = () => {
  const queryClient = useQueryClient()
  const dispatch = useAppDispatch()

  return useMutation({
    mutationFn: async (payload: UpdateProfilePayload) => {
      const response = await api.put<{
        success: boolean
        message: string
        data: {
          user: User
        }
      }>(API_ENDPOINTS.PROFILE.UPDATE, payload)

      return response.data?.user || (response.data as unknown as User)
    },
    onSuccess: (data) => {
      queryClient.setQueryData(['profile'], data)
      if (data && data.preferences) {
        dispatch(updateUserPreferences(data.preferences))
      }
    },
  })
}
