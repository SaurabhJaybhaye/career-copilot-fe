import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { api } from '@/services/api'
import { API_ENDPOINTS } from '@/services/endpoints'
import type { Resume } from '@/hooks/useResumes'

// Types for Tailored Resume
export interface TailorResumePayload {
  resumeId: string
  jobId: string
  customPrompt?: string
}

export interface TailorResumeResponseData {
  tailoredContent: string
  skills: string[]
  technologies: string[]
  domains: string[]
}

// Types for Save Tailored Resume
export interface SaveTailoredResumePayload {
  resumeId: string
  jobId: string
  tailoredContent: string
  title?: string
  skills: string[]
  technologies: string[]
  domains: string[]
}

// Types for Cover Letter
export interface CoverLetterPayload {
  resumeId: string
  jobId: string
  customPrompt?: string
}

// Types for Referral Message
export interface ReferralMessagePayload {
  resumeId: string
  jobId: string
  referrerName?: string
  platform?: string
  customPrompt?: string
}

// Types for Skill Gap Analyzer
export interface SkillGapResponseData {
  score: number
  matchedSkills: string[]
  missingSkills: string[]
  recommendations: string[]
}

/**
 * Hook to tailor resume based on original resume and job description.
 */
export const useTailorResumeMutation = () => {
  return useMutation({
    mutationFn: async (payload: TailorResumePayload) => {
      const response = await api.post<{
        success: boolean
        message: string
        data: TailorResumeResponseData
      }>(API_ENDPOINTS.AI.TAILOR_RESUME, payload, { timeout: 100000 })
      return response.data
    },
  })
}

/**
 * Hook to save a generated tailored resume.
 */
export const useSaveTailoredResumeMutation = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (payload: SaveTailoredResumePayload) => {
      const response = await api.post<{
        success: boolean
        message: string
        data: {
          resume: Resume
        }
      }>(API_ENDPOINTS.AI.SAVE_TAILORED_RESUME, payload, { timeout: 100000 })
      return response.data.resume
    },
    onSuccess: () => {
      // Invalidate resumes queries to fetch updated list
      queryClient.invalidateQueries({ queryKey: ['resumes'] })
      queryClient.invalidateQueries({ queryKey: ['dashboard'] })
    },
  })
}

/**
 * Hook to generate a cover letter.
 */
export const useGenerateCoverLetterMutation = () => {
  return useMutation({
    mutationFn: async (payload: CoverLetterPayload) => {
      const response = await api.post<{
        success: boolean
        message: string
        data: {
          coverLetter: string
        }
      }>(API_ENDPOINTS.AI.GENERATE_COVER_LETTER, payload, { timeout: 100000 })
      return response.data.coverLetter
    },
  })
}

/**
 * Hook to generate a referral message.
 */
export const useGenerateReferralMutation = () => {
  return useMutation({
    mutationFn: async (payload: ReferralMessagePayload) => {
      const response = await api.post<{
        success: boolean
        message: string
        data: {
          message: string
        }
      }>(API_ENDPOINTS.AI.GENERATE_REFERRAL, payload, { timeout: 100000 })
      return response.data.message
    },
  })
}

/**
 * Hook to execute the skill gap analyzer query.
 * We can run it when both resumeId and jobId are present.
 */
export const useSkillGapQuery = (resumeId: string | null, jobId: string | null) => {
  return useQuery({
    queryKey: ['skill-gap', resumeId, jobId],
    queryFn: async () => {
      if (!resumeId || !jobId) return null
      const response = await api.post<{
        success: boolean
        message: string
        data: SkillGapResponseData
      }>(API_ENDPOINTS.AI.SKILL_GAP, { resumeId, jobId }, { timeout: 100000 })
      return response.data
    },
    enabled: !!resumeId && !!jobId,
    staleTime: 5 * 60 * 1000, // cache for 5 minutes
  })
}
