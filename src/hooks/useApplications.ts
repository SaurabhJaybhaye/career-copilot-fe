import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { api } from '@/services/api'
import { API_ENDPOINTS } from '@/services/endpoints'
import type { Job } from './useJobs'
import type { Resume } from './useResumes'

export interface TimelineEvent {
  status: 'saved' | 'applied' | 'interviewing' | 'offered' | 'rejected' | 'withdrawn'
  note?: string
  updatedAt: string
}

export interface Application {
  id?: string
  _id?: string
  userId: string
  jobId: Job
  resumeId?: Resume | null
  status: 'saved' | 'applied' | 'interviewing' | 'offered' | 'rejected' | 'withdrawn'
  appliedAt: string
  note?: string
  timeline?: TimelineEvent[]
  createdAt: string
  updatedAt: string
}

export const useApplicationsQuery = () => {
  return useQuery({
    queryKey: ['applications'],
    queryFn: async () => {
      const response = await api.get<{
        success: boolean
        message: string
        data: {
          applications: Application[]
        }
      }>(API_ENDPOINTS.APPLICATIONS.LIST)

      return response.data?.applications || []
    },
  })
}

interface CreateApplicationPayload {
  jobId: string
  resumeId?: string | null
  status?: 'saved' | 'applied' | 'interviewing' | 'offered' | 'rejected' | 'withdrawn'
  appliedAt?: string | null
  note?: string | null
}

export const useCreateApplicationMutation = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (payload: CreateApplicationPayload) => {
      const response = await api.post<{
        success: boolean
        message: string
        data: {
          application: Application
        }
      }>(API_ENDPOINTS.APPLICATIONS.CREATE, payload)

      return response.data?.application
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['applications'] })
      queryClient.invalidateQueries({ queryKey: ['dashboard'] })
    },
  })
}

interface UpdateApplicationStatusPayload {
  id: string
  status: 'saved' | 'applied' | 'interviewing' | 'offered' | 'rejected' | 'withdrawn'
  note?: string | null
}

export const useUpdateApplicationStatusMutation = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ id, status, note }: UpdateApplicationStatusPayload) => {
      const response = await api.patch<{
        success: boolean
        message: string
        data: {
          application: Application
        }
      }>(API_ENDPOINTS.APPLICATIONS.UPDATE_STATUS(id), { status, note })

      return response.data?.application
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['applications'] })
      queryClient.invalidateQueries({ queryKey: ['dashboard'] })
    },
  })
}

export const useDeleteApplicationMutation = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (id: string) => {
      await api.delete<{
        success: boolean
        message: string
        data: null
      }>(API_ENDPOINTS.APPLICATIONS.DELETE(id))
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['applications'] })
      queryClient.invalidateQueries({ queryKey: ['dashboard'] })
    },
  })
}
