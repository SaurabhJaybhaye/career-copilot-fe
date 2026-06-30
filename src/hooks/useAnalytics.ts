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
          resumeStats: ResumeAnalyticsItem[]
        }
      }>(API_ENDPOINTS.ANALYTICS.RESUMES)

      // The backend returns resumeStats, let's map it safely
      return (response as any).data?.resumeStats || []
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
          monthlyTrends: ApplicationAnalyticsItem[]
        }
      }>(API_ENDPOINTS.ANALYTICS.APPLICATIONS)

      // The backend returns monthlyTrends or similar, let's map it safely
      const trends = (response as any).data?.monthlyTrends || (response as any).data || []
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
          sourceCounts: SourceAnalyticsItem[]
        }
      }>(API_ENDPOINTS.ANALYTICS.SOURCES)

      const counts = (response as any).data?.sourceCounts || (response as any).data || []
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
        data: ConversionAnalytics
      }>(API_ENDPOINTS.ANALYTICS.CONVERSIONS)

      return response.data
    },
  })
}
