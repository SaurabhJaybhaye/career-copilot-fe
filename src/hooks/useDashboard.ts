import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
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

      return response.data?.summary
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
        data: {
          activities: ActivityEvent[]
        }
      }>(API_ENDPOINTS.DASHBOARD.RECENT_ACTIVITY)

      return response.data?.activities || []
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
        data: {
          upcoming: UpcomingActions
        }
      }>(API_ENDPOINTS.DASHBOARD.UPCOMING_ACTIONS)

      return response.data?.upcoming || { followups: [], unreadNotificationsCount: 0 }
    },
  })
}

interface CreateFollowUpPayload {
  jobId?: string | null
  title: string
  description?: string
  dueDate: string
}

export const useCreateFollowUpMutation = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (payload: CreateFollowUpPayload) => {
      const response = await api.post<{
        success: boolean
        message: string
        data: {
          followup: FollowUpItem
        }
      }>(API_ENDPOINTS.FOLLOWUPS.CREATE, payload)

      return response.data?.followup
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['dashboard'] })
    },
  })
}

interface UpdateFollowUpStatusPayload {
  id: string
  status: 'pending' | 'completed'
}

export const useUpdateFollowUpStatusMutation = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ id, status }: UpdateFollowUpStatusPayload) => {
      const response = await api.patch<{
        success: boolean
        message: string
        data: {
          followup: FollowUpItem
        }
      }>(API_ENDPOINTS.FOLLOWUPS.UPDATE_STATUS(id), { status })

      return response.data?.followup
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['dashboard'] })
    },
  })
}

export const useDeleteFollowUpMutation = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (id: string) => {
      await api.delete<{
        success: boolean
        message: string
        data: null
      }>(API_ENDPOINTS.FOLLOWUPS.DELETE(id))
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['dashboard'] })
    },
  })
}
