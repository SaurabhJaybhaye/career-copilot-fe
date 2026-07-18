import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { api } from '@/services/api'
import { API_ENDPOINTS } from '@/services/endpoints'

export interface CoverLetter {
  id: string
  _id?: string
  userId: string
  jobId: string
  title: string
  fileUrl: string
  filePath?: string
  content: string
  createdAt: string
  updatedAt: string
}

export interface SaveCoverLetterPayload {
  resumeId: string
  jobId: string
  content: string
  title?: string
}

/**
 * Hook to retrieve all saved cover letters.
 */
export const useCoverLettersQuery = () => {
  return useQuery({
    queryKey: ['cover-letters'],
    queryFn: async () => {
      const response = await api.get<{
        success: boolean
        message: string
        data: {
          coverLetters: CoverLetter[]
        }
      }>(API_ENDPOINTS.COVER_LETTERS.LIST)

      return response.data?.coverLetters || []
    },
  })
}

/**
 * Hook to retrieve a specific cover letter's details.
 */
export const useCoverLetterDetailsQuery = (id: string | null) => {
  return useQuery({
    queryKey: ['cover-letters', id],
    queryFn: async () => {
      if (!id) return null
      const response = await api.get<{
        success: boolean
        message: string
        data: {
          coverLetter: CoverLetter
        }
      }>(API_ENDPOINTS.COVER_LETTERS.DETAILS(id))

      return response.data?.coverLetter || null
    },
    enabled: !!id,
  })
}

/**
 * Hook to save a generated cover letter.
 */
export const useSaveCoverLetterMutation = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (payload: SaveCoverLetterPayload) => {
      const response = await api.post<{
        success: boolean
        message: string
        data: {
          coverLetter: CoverLetter
        }
      }>(API_ENDPOINTS.AI.SAVE_COVER_LETTER, payload, { timeout: 100000 })
      return response.data.coverLetter
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cover-letters'] })
      queryClient.invalidateQueries({ queryKey: ['dashboard'] })
    },
  })
}

/**
 * Hook to delete a saved cover letter.
 */
export const useDeleteCoverLetterMutation = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (id: string) => {
      await api.delete<{
        success: boolean
        message: string
        data: null
      }>(API_ENDPOINTS.COVER_LETTERS.DELETE(id))
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cover-letters'] })
      queryClient.invalidateQueries({ queryKey: ['dashboard'] })
    },
  })
}
