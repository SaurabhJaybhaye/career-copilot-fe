import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { api } from '@/services/api'
import { API_ENDPOINTS } from '@/services/endpoints'
import type { Job } from './useJobs'

export interface Referral {
  id?: string
  _id?: string
  userId: string
  jobId: Job
  referrerName: string
  referrerEmail?: string
  referrerContact?: string
  status: 'pending' | 'referred' | 'declined'
  notes?: string
  createdAt: string
  updatedAt: string
}

export const useReferralsQuery = () => {
  return useQuery({
    queryKey: ['referrals'],
    queryFn: async () => {
      const response = await api.get<{
        success: boolean
        message: string
        data: {
          referrals: Referral[]
        }
      }>(API_ENDPOINTS.REFERRALS.LIST)

      return response.data?.referrals || []
    },
  })
}

interface CreateReferralPayload {
  jobId: string
  referrerName: string
  referrerEmail?: string
  referrerContact?: string
  status?: 'pending' | 'referred' | 'declined'
  notes?: string
}

export const useCreateReferralMutation = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (payload: CreateReferralPayload) => {
      const response = await api.post<{
        success: boolean
        message: string
        data: {
          referral: Referral
        }
      }>(API_ENDPOINTS.REFERRALS.CREATE, payload)

      return response.data?.referral
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['referrals'] })
      queryClient.invalidateQueries({ queryKey: ['dashboard'] })
    },
  })
}

interface UpdateReferralStatusPayload {
  id: string
  status: 'pending' | 'referred' | 'declined'
  notes?: string
}

export const useUpdateReferralStatusMutation = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ id, status, notes }: UpdateReferralStatusPayload) => {
      const response = await api.patch<{
        success: boolean
        message: string
        data: {
          referral: Referral
        }
      }>(API_ENDPOINTS.REFERRALS.UPDATE_STATUS(id), { status, notes })

      return response.data?.referral
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['referrals'] })
      queryClient.invalidateQueries({ queryKey: ['dashboard'] })
    },
  })
}

export const useDeleteReferralMutation = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (id: string) => {
      await api.delete<{
        success: boolean
        message: string
        data: null
      }>(API_ENDPOINTS.REFERRALS.DELETE(id))
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['referrals'] })
      queryClient.invalidateQueries({ queryKey: ['dashboard'] })
    },
  })
}
