

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { api } from '@/services/api'
import { API_ENDPOINTS } from '@/services/endpoints'

export interface Job {
  id?: string
  _id?: string
  title: string
  company: string
  location?: string
  description: string
  url?: string
  salary?: string
  status: 'active' | 'archived' | 'draft'
  source?: string
  isEasyApply?: boolean
  insights?: string[]
  skills?: string[]
  postedAt?: string
  createdAt: string
  updatedAt: string
}

export interface MatchResult {
  resumeId: string
  resumeTitle: string
  score: number
  matchedSkills: string[]
  missingSkills: string[]
  recommendationStatus: 'RECOMMENDED' | 'USER_DECISION_REQUIRED'
}

export const useJobsQuery = () => {
  return useQuery({
    queryKey: ['jobs'],
    queryFn: async () => {
      const response = await api.get<{
        success: boolean
        message: string
        data: {
          jobs: Job[]
        }
      }>(API_ENDPOINTS.JOBS.LIST)

      return response.data?.jobs || []
    },
  })
}

export const useJobDetailsQuery = (id: string | null) => {
  return useQuery({
    queryKey: ['jobs', id],
    queryFn: async () => {
      if (!id) return null
      const response = await api.get<{
        success: boolean
        message: string
        data: {
          job: Job
        }
      }>(API_ENDPOINTS.JOBS.DETAILS(id))

      return response.data?.job || null
    },
    enabled: !!id,
  })
}

interface CreateJobPayload {
  title: string
  company: string
  location?: string
  description: string
  url?: string
  salary?: string
  status?: 'active' | 'archived' | 'draft'
}

export const useCreateJobMutation = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (payload: CreateJobPayload) => {
      const response = await api.post<{
        success: boolean
        message: string
        data: {
          job: Job
        }
      }>(API_ENDPOINTS.JOBS.CREATE, payload, { timeout: 100000 })

      return response.data?.job
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['jobs'] })
      queryClient.invalidateQueries({ queryKey: ['dashboard'] })
    },
  })
}

interface UpdateJobPayload {
  id: string
  title?: string
  company?: string
  location?: string
  description?: string
  url?: string
  salary?: string
  status?: 'active' | 'archived' | 'draft'
}

export const useUpdateJobMutation = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ id, ...payload }: UpdateJobPayload) => {
      const response = await api.put<{
        success: boolean
        message: string
        data: {
          job: Job
        }
      }>(API_ENDPOINTS.JOBS.UPDATE(id), payload, { timeout: 100000 })

      return response.data?.job
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['jobs'] })
      queryClient.invalidateQueries({ queryKey: ['jobs', variables.id] })
      queryClient.invalidateQueries({ queryKey: ['dashboard'] })
    },
  })
}

export const useDeleteJobMutation = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (id: string) => {
      await api.delete<{
        success: boolean
        message: string
        data: null
      }>(API_ENDPOINTS.JOBS.DELETE(id))
    },
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: ['jobs'] })
      queryClient.invalidateQueries({ queryKey: ['jobs', id] })
      queryClient.invalidateQueries({ queryKey: ['dashboard'] })
    },
  })
}

export const useDeleteJobsBulkMutation = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (ids: string[]) => {
      const response = await api.post<{
        success: boolean
        message: string
        data: { deletedCount: number }
      }>(API_ENDPOINTS.JOBS.BULK_DELETE, { ids })
      return response.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['jobs'] })
      queryClient.invalidateQueries({ queryKey: ['dashboard'] })
    },
  })
}

export const useMatchResumesMutation = () => {
  return useMutation({
    mutationFn: async (id: string) => {
      const response = await api.post<{
        success: boolean
        message: string
        data: {
          matches: MatchResult[]
        }
      }>(API_ENDPOINTS.JOBS.MATCH_RESUMES(id))

      return response.data?.matches || []
    },
  })
}

export interface FetchExternalJobsPayload {
  title: string
  portal?: 'linkedin' | 'indeed'
  location?: string
  postedOn?: '24h' | 'past_week' | 'past_month'
  experienceLevel?:
    | 'internship'
    | 'entry_level'
    | 'associate'
    | 'mid_senior'
    | 'director'
    | 'executive'
  limit?: number
  saveToDb?: boolean
}

export interface ScrapedJobItem {
  _id: string
  userId?: string
  title: string
  company: string
  location: string
  description: string
  url: string
  salary: string
  isEasyApply: boolean
  insights: string[]
  skills: string[]
  technologies?: string[]
  domains?: string[]
  status: 'active' | 'archived' | 'draft'
  postedAt?: string
  createdAt: string
  updatedAt: string
}

export interface FetchExternalJobsResponse {
  success: boolean
  message: string
  data: {
    jobs: ScrapedJobItem[]
  }
}

export const useFetchExternalJobsMutation = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (payload: FetchExternalJobsPayload) => {
      const response = await api.post<FetchExternalJobsResponse>(
        API_ENDPOINTS.JOBS.FETCH_EXTERNAL,
        payload,
        { timeout: 200000 }
      )
      return response.data?.jobs || []
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['jobs'] })
      queryClient.invalidateQueries({ queryKey: ['dashboard'] })
    },
  })
}

