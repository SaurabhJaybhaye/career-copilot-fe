import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { api } from '@/services/api'
import { API_ENDPOINTS } from '@/services/endpoints'

export interface Resume {
  id: string
  title: string
  fileUrl: string
  isDefault: boolean
  skills: string[]
  technologies: string[]
  domains: string[]
  createdAt: string
  updatedAt: string
}

export const useResumesQuery = () => {
  return useQuery({
    queryKey: ['resumes'],
    queryFn: async () => {
      const response = await api.get<{
        success: boolean
        message: string
        data: {
          resumes: Resume[]
        }
      }>(API_ENDPOINTS.RESUMES.LIST)

      return response.data?.resumes || []
    },
  })
}

export const useResumeDetailsQuery = (id: string | null) => {
  return useQuery({
    queryKey: ['resumes', id],
    queryFn: async () => {
      if (!id) return null
      const response = await api.get<{
        success: boolean
        message: string
        data: {
          resume: Resume
        }
      }>(API_ENDPOINTS.RESUMES.DETAILS(id))

      return response.data?.resume || null
    },
    enabled: !!id,
  })
}

interface UploadResumePayload {
  file: File
  title?: string
}

export const useUploadResumeMutation = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (payload: UploadResumePayload) => {
      const formData = new FormData()
      formData.append('file', payload.file)
      if (payload.title) {
        formData.append('title', payload.title)
      }

      const response = await api.post<{
        success: boolean
        message: string
        data: {
          resume: Resume
        }
      }>(API_ENDPOINTS.RESUMES.UPLOAD, formData, {
        headers: {
          'Content-Type': undefined,
        },
        timeout: 60000,
      })

      return response.data?.resume
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['resumes'] })
      queryClient.invalidateQueries({ queryKey: ['dashboard'] })
    },
  })
}

interface UpdateResumePayload {
  id: string
  title?: string
  isDefault?: boolean
}

export const useUpdateResumeMutation = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ id, ...payload }: UpdateResumePayload) => {
      const response = await api.put<{
        success: boolean
        message: string
        data: {
          resume: Resume
        }
      }>(API_ENDPOINTS.RESUMES.UPDATE(id), payload)

      return response.data?.resume
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['resumes'] })
      queryClient.invalidateQueries({ queryKey: ['dashboard'] })
    },
  })
}

export const useDeleteResumeMutation = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (id: string) => {
      await api.delete<{
        success: boolean
        message: string
        data: null
      }>(API_ENDPOINTS.RESUMES.DELETE(id))
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['resumes'] })
      queryClient.invalidateQueries({ queryKey: ['dashboard'] })
    },
  })
}
