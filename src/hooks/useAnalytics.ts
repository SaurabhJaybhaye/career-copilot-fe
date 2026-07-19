import { useQuery } from '@tanstack/react-query'
import { api } from '@/services/api'
import { API_ENDPOINTS } from '@/services/endpoints'

export interface ResumeAnalyticsItem {
  resumeId: string
  title: string
  totalApplications: number
  interviewCount: number
  offerCount: number
  successRate: number
  interviewRate: number
}

export interface ApplicationAnalyticsItem {
  month: string
  total: number
  applied: number
  interviewing: number
  offered: number
  rejected: number
  withdrawn: number
}

export interface SourceAnalyticsItem {
  source: string
  count: number
}

export interface ConversionAnalytics {
  funnel: {
    applied: number
    interviewed: number
    offered: number
  }
  rates: {
    appliedToInterviewRate: number
    interviewToOfferRate: number
    overallSuccessRate: number
  }
}

export const useResumeAnalyticsQuery = () => {
  return useQuery({
    queryKey: ['analytics', 'resumes'],
    queryFn: async () => {
      const response = await api.get<{
        success: boolean
        message: string
        data: {
          resumes: ResumeAnalyticsItem[]
          resumeStats?: ResumeAnalyticsItem[]
        }
      }>(API_ENDPOINTS.ANALYTICS.RESUMES)

      // Map safely using backend's resumes field first, then fallback to resumeStats
      return (response as any).data?.resumes || (response as any).data?.resumeStats || []
    },
  })
}

export const useApplicationAnalyticsQuery = () => {
  return useQuery({
    queryKey: ['analytics', 'applications'],
    queryFn: async () => {
      const response = await api.get<{
        success: boolean
        message: string
        data: {
          timeline: ApplicationAnalyticsItem[]
          monthlyTrends?: ApplicationAnalyticsItem[]
        }
      }>(API_ENDPOINTS.ANALYTICS.APPLICATIONS)

      // Map safely using backend's timeline field first, then fallback
      const trends = (response as any).data?.timeline || (response as any).data?.monthlyTrends || (response as any).data || []
      return Array.isArray(trends) ? trends : []
    },
  })
}

export const useSourceAnalyticsQuery = () => {
  return useQuery({
    queryKey: ['analytics', 'sources'],
    queryFn: async () => {
      const response = await api.get<{
        success: boolean
        message: string
        data: {
          sources: SourceAnalyticsItem[]
          sourceCounts?: SourceAnalyticsItem[]
        }
      }>(API_ENDPOINTS.ANALYTICS.SOURCES)

      // Map safely using backend's sources field first, then fallback
      const counts = (response as any).data?.sources || (response as any).data?.sourceCounts || (response as any).data || []
      return Array.isArray(counts) ? counts : []
    },
  })
}

export const useConversionAnalyticsQuery = () => {
  return useQuery({
    queryKey: ['analytics', 'conversions'],
    queryFn: async () => {
      const response = await api.get<{
        success: boolean
        message: string
        data: {
          conversions: ConversionAnalytics
        }
      }>(API_ENDPOINTS.ANALYTICS.CONVERSIONS)

      // Map safely using backend's conversions wrapper first, then fallback
      return (response as any).data?.conversions || response.data
    },
  })
}
