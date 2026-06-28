import React from 'react'
import { Link } from 'react-router-dom'
import { 
  FileText, 
  Briefcase, 
  KanbanSquare, 
  Users, 
  TrendingUp, 
  Calendar,
  ChevronRight,
  Loader2,
  Clock,
  ArrowUpRight
} from 'lucide-react'
import { 
  useDashboardSummaryQuery, 
  useRecentActivityQuery, 
  useUpcomingActionsQuery 
} from '@/hooks/useDashboard'

export const Dashboard: React.FC = () => {
  const { data: summary, isLoading: isSummaryLoading } = useDashboardSummaryQuery()
  const { data: recentActivity = [], isLoading: isActivityLoading } = useRecentActivityQuery()
  const { data: upcomingActions, isLoading: isUpcomingLoading } = useUpcomingActionsQuery()

  const isPageLoading = isSummaryLoading || isUpcomingLoading || isActivityLoading

  // Map activity type to icons
  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'resume':
        return <FileText className="h-4 w-4 text-blue-500" />
      case 'job':
        return <Briefcase className="h-4 w-4 text-violet-500" />
      case 'application':
        return <KanbanSquare className="h-4 w-4 text-emerald-500" />
      case 'referral':
        return <Users className="h-4 w-4 text-amber-500" />
      default:
        return <Clock className="h-4 w-4 text-slate-400" />
    }
  };

  const getActivityColor = (type: string) => {
    switch (type) {
      case 'resume':
        return 'bg-blue-50 dark:bg-blue-950/20 border-blue-100 dark:border-blue-900/30'
      case 'job':
        return 'bg-violet-50 dark:bg-violet-950/20 border-violet-100 dark:border-violet-900/30'
      case 'application':
        return 'bg-emerald-50 dark:bg-emerald-950/20 border-emerald-100 dark:border-emerald-900/30'
      case 'referral':
        return 'bg-amber-50 dark:bg-amber-950/20 border-amber-100 dark:border-amber-900/30'
      default:
        return 'bg-slate-50 dark:bg-slate-800 border-slate-100 dark:border-slate-700'
    }
  };

  if (isPageLoading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center space-y-4">
        <Loader2 className="animate-spin h-10 w-10 text-violet-600" />
        <p className="text-sm font-semibold text-slate-500">Retrieving dashboard overview stats...</p>
      </div>
    )
  }

  // Fallbacks in case metrics aren't populated yet
  const resumesCount = summary?.resumesCount ?? 0
  const jobsCount = summary?.jobsCount ?? 0
  const activeApplications = summary?.applicationsCount?.total ?? 0
  const pendingReferrals = summary?.referralsCount?.pending ?? 0

  const stats = [
    { label: 'Resumes Parsed', count: resumesCount, icon: FileText, color: 'from-blue-500 to-indigo-500', change: `${resumesCount} uploaded` },
    { label: 'Jobs Tracked', count: jobsCount, icon: Briefcase, color: 'from-violet-500 to-purple-500', change: `${summary?.applicationsCount?.applied ?? 0} applied` },
    { label: 'Active Applications', count: activeApplications, icon: KanbanSquare, color: 'from-emerald-500 to-teal-500', change: `${summary?.applicationsCount?.interviewing ?? 0} in interview` },
    { label: 'Pending Referrals', count: pendingReferrals, icon: Users, color: 'from-amber-500 to-orange-500', change: `${pendingReferrals} replies pending` },
  ]

  const followups = upcomingActions?.followups ?? []

  // Stage progress distribution helper
  const totalApps = summary?.applicationsCount?.total || 1
  const getPercentage = (count: number) => {
    return Math.round((count / totalApps) * 100)
  }

  const pipelineStages = [
    { label: 'Applied', count: summary?.applicationsCount?.applied ?? 0, color: 'bg-blue-500' },
    { label: 'Interviewing', count: summary?.applicationsCount?.interviewing ?? 0, color: 'bg-purple-500' },
    { label: 'Offered', count: summary?.applicationsCount?.offered ?? 0, color: 'bg-emerald-500' },
    { label: 'Rejected', count: summary?.applicationsCount?.rejected ?? 0, color: 'bg-red-500' },
  ]

  return (
    <div className="space-y-8">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-violet-600 via-indigo-600 to-blue-600 rounded-3xl p-6 sm:p-8 text-white shadow-lg relative overflow-hidden text-left">
        <div className="relative z-10 space-y-2">
          <span className="bg-white/20 text-white text-xs font-semibold px-3 py-1 rounded-full uppercase tracking-wider">
            Overview
          </span>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">Your Job Application Dashboard</h1>
          <p className="text-violet-100 max-w-xl text-sm sm:text-base">
            Track metrics, manage resume keywords parsed by AI, coordinate employee referrals, and manage pipeline conversions on the Kanban Board.
          </p>
        </div>
        <div className="absolute right-0 bottom-0 opacity-10 translate-x-12 translate-y-12">
          <TrendingUp className="h-64 w-64" />
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, idx) => {
          const Icon = stat.icon
          return (
            <div 
              key={idx}
              className="bg-white dark:bg-slate-800 rounded-2xl p-6 border border-slate-100 dark:border-slate-700 shadow-sm hover:shadow-md transition-all duration-200 flex flex-col justify-between"
            >
              <div className="flex items-center justify-between">
                <span className="text-sm font-semibold text-slate-550 dark:text-slate-400">{stat.label}</span>
                <div className={`p-2.5 rounded-xl bg-gradient-to-br ${stat.color} text-white`}>
                  <Icon className="h-5 w-5" />
                </div>
              </div>
              <div className="mt-4 space-y-1 text-left">
                <span className="text-3xl font-extrabold text-slate-900 dark:text-white">{stat.count}</span>
                <p className="text-xs text-violet-650 dark:text-violet-400 font-bold">{stat.change}</p>
              </div>
            </div>
          )
        })}
      </div>

      {/* Main Widgets Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Side: Upcoming Reminders & Activity timeline */}
        <div className="lg:col-span-2 space-y-6">
          {/* Follow Ups Widget */}
          <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 border border-slate-100 dark:border-slate-700 shadow-sm text-left">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-700">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center">
                <Calendar className="mr-2 h-5 w-5 text-violet-550" />
                Upcoming Follow-ups & Reminders
              </h3>
              <Link to="/applications" className="text-xs font-bold text-violet-650 hover:text-violet-500 dark:text-violet-400 flex items-center">
                View Tracker <ChevronRight className="h-4 w-4" />
              </Link>
            </div>
            
            {followups.length === 0 ? (
              <div className="py-12 flex flex-col items-center justify-center text-slate-400 dark:text-slate-500 text-center">
                <Calendar className="h-10 w-10 text-slate-300 mb-2" />
                <p className="text-xs font-semibold">No pending reminders schedule.</p>
              </div>
            ) : (
              <div className="mt-4 divide-y divide-slate-100 dark:divide-slate-700">
                {followups.slice(0, 5).map((item) => (
                  <div key={item.id} className="py-4 first:pt-0 last:pb-0 flex items-center justify-between gap-4">
                    <div className="space-y-1">
                      <h4 className="font-bold text-slate-900 dark:text-white text-sm sm:text-base">
                        {item.job?.company || 'General'} &bull;{' '}
                        <span className="text-slate-500 dark:text-slate-400 font-normal">
                          {item.job?.title || item.title}
                        </span>
                      </h4>
                      <p className="text-xs text-slate-400">{item.description || 'Follow-up Task'}</p>
                    </div>
                    <span className="text-xs sm:text-sm font-bold bg-violet-50 dark:bg-violet-950/40 text-violet-650 dark:text-violet-400 px-3.5 py-1.5 rounded-full whitespace-nowrap">
                      {new Date(item.dueDate).toLocaleDateString(undefined, {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                      })}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Recent Activity Timeline Widget */}
          <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 border border-slate-100 dark:border-slate-700 shadow-sm text-left">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white pb-4 border-b border-slate-100 dark:border-slate-700">
              Recent Activity Feed
            </h3>
            
            {recentActivity.length === 0 ? (
              <div className="py-12 flex flex-col items-center justify-center text-slate-400 dark:text-slate-500 text-center">
                <Clock className="h-10 w-10 text-slate-300 mb-2" />
                <p className="text-xs font-semibold">No recent activity logged.</p>
              </div>
            ) : (
              <div className="mt-6 relative pl-6 border-l border-slate-100 dark:border-slate-700 space-y-6">
                {recentActivity.slice(0, 5).map((item) => (
                  <div key={item.id} className="relative">
                    {/* Floating icon marker */}
                    <div className={`absolute -left-[35px] top-0 p-1.5 rounded-lg border bg-white dark:bg-slate-800 ${getActivityColor(item.type)}`}>
                      {getActivityIcon(item.type)}
                    </div>
                    
                    <div className="space-y-0.5 pl-2">
                      <p className="text-sm font-semibold text-slate-800 dark:text-slate-205">
                        {item.description}
                      </p>
                      <span className="text-xxs text-slate-400 block uppercase font-bold">
                        {new Date(item.timestamp).toLocaleDateString(undefined, {
                          month: 'short',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right Side Column: Quick Actions & Pipeline Distribution */}
        <div className="space-y-6">
          {/* Quick Actions Card */}
          <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 border border-slate-100 dark:border-slate-700 shadow-sm text-left flex flex-col justify-between">
            <div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4">
                Quick Actions
              </h3>
              <div className="space-y-3">
                <Link 
                  to="/resume-builder" 
                  className="flex items-center p-3.5 rounded-xl border border-slate-100 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-750 transition duration-200"
                >
                  <div className="p-2.5 rounded-lg bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 mr-3">
                    <FileText className="h-5 w-5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-slate-900 dark:text-white flex items-center">
                      Upload Resume <ArrowUpRight className="ml-1 h-3.5 w-3.5 opacity-60" />
                    </h4>
                    <p className="text-xs text-slate-450 dark:text-slate-400 mt-0.5">Parse keywords with AI</p>
                  </div>
                </Link>
                <Link 
                  to="/jobs" 
                  className="flex items-center p-3.5 rounded-xl border border-slate-100 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-750 transition duration-200"
                >
                  <div className="p-2.5 rounded-lg bg-violet-50 dark:bg-violet-900/30 text-violet-650 dark:text-violet-400 mr-3">
                    <Briefcase className="h-5 w-5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-slate-900 dark:text-white flex items-center">
                      Match Job Role <ArrowUpRight className="ml-1 h-3.5 w-3.5 opacity-60" />
                    </h4>
                    <p className="text-xs text-slate-455 dark:text-slate-400 mt-0.5">Diagnose matching percentages</p>
                  </div>
                </Link>
              </div>
            </div>
            
            <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-700 text-center">
              <Link 
                to="/design-system" 
                className="text-xs text-violet-655 dark:text-violet-400 font-bold hover:underline"
              >
                Access Developer Playground
              </Link>
            </div>
          </div>

          {/* Pipeline Distribution Card */}
          <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 border border-slate-100 dark:border-slate-700 shadow-sm text-left">
            <h3 className="text-base font-bold text-slate-900 dark:text-white mb-4">
              Pipeline Distribution
            </h3>
            
            <div className="space-y-4">
              {pipelineStages.map((stage, idx) => {
                const pct = getPercentage(stage.count)
                return (
                  <div key={idx} className="space-y-1.5">
                    <div className="flex items-center justify-between text-xs font-bold text-slate-655 dark:text-slate-350">
                      <span>{stage.label}</span>
                      <span>{stage.count} ({pct}%)</span>
                    </div>
                    <div className="w-full bg-slate-100 dark:bg-slate-700 h-2 rounded-full overflow-hidden">
                      <div 
                        className={`h-full rounded-full ${stage.color}`}
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
