import { useQuery } from '@tanstack/react-query'
import { api } from '@/services/api'
import { API_ENDPOINTS } from '@/services/endpoints'

export interface DashboardSummary {
  jobsCount: number
  resumesCount: number
  applicationsCount: {
    total: number
    applied: number
    interviewing: number
    offered: number
    rejected: number
    withdrawn: number
  }
  referralsCount: {
    total: number
    pending: number
    referred: number
    declined: number
  }
  pendingFollowUpsCount: number
}

export interface ActivityEvent {
  id: string
  type: 'resume' | 'job' | 'application' | 'referral' | 'followup' | 'profile' | 'auth'
  action: string
  description: string
  timestamp: string
}

export interface FollowUpItem {
  id: string
  title: string
  description?: string
  dueDate: string
  job?: {
    id: string
    company: string
    title: string
  }
}

export interface UpcomingActions {
  followups: FollowUpItem[]
  unreadNotificationsCount: number
}

export const useDashboardSummaryQuery = () => {
  return useQuery({
    queryKey: ['dashboard', 'summary'],
    queryFn: async () => {
      const response = await api.get<{
        success: boolean
        message: string
        data: {
          summary: DashboardSummary
        }
      }>(API_ENDPOINTS.DASHBOARD.SUMMARY)

      return response.data?.summary || (response.data as unknown as DashboardSummary)
    },
  })
}

export const useRecentActivityQuery = () => {
  return useQuery({
    queryKey: ['dashboard', 'recent-activity'],
    queryFn: async () => {
      const response = await api.get<{
        success: boolean
        message: string
        data: ActivityEvent[]
      }>(API_ENDPOINTS.DASHBOARD.RECENT_ACTIVITY)

      return response.data || []
    },
  })
}

export const useUpcomingActionsQuery = () => {
  return useQuery({
    queryKey: ['dashboard', 'upcoming-actions'],
    queryFn: async () => {
      const response = await api.get<{
        success: boolean
        message: string
        data: UpcomingActions
      }>(API_ENDPOINTS.DASHBOARD.UPCOMING_ACTIONS)

      return response.data || { followups: [], unreadNotificationsCount: 0 }
    },
  })
}
