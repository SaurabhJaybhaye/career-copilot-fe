import React from 'react'
import { Link } from 'react-router-dom'
import { 
  FileText, 
  Briefcase, 
  KanbanSquare, 
  Users, 
  TrendingUp, 
  Calendar,
  ChevronRight
} from 'lucide-react'

export const Dashboard: React.FC = () => {
  const stats = [
    { label: 'Resumes Parsed', count: 12, icon: FileText, color: 'from-blue-500 to-indigo-500', change: '+2 this week' },
    { label: 'Jobs Tracked', count: 48, icon: Briefcase, color: 'from-violet-500 to-purple-500', change: '+8 new matches' },
    { label: 'Active Applications', count: 9, icon: KanbanSquare, color: 'from-emerald-500 to-teal-500', change: '2 in interview stage' },
    { label: 'Referral Requests', count: 6, icon: Users, color: 'from-amber-500 to-orange-500', change: '4 responses pending' },
  ]

  const upcomingFollowups = [
    { company: 'Google', role: 'Frontend Architect', date: 'June 30, 2026', type: 'Technical Interview' },
    { company: 'Meta', role: 'Staff Product Engineer', date: 'July 03, 2026', type: 'System Design Interview' },
  ]

  return (
    <div className="space-y-8">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-violet-600 via-indigo-600 to-blue-600 rounded-3xl p-6 sm:p-8 text-white shadow-lg relative overflow-hidden">
        <div className="relative z-10 space-y-2">
          <span className="bg-white/20 text-white text-xs font-semibold px-3 py-1 rounded-full uppercase tracking-wider">
            Overview
          </span>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">Your Job Application Dashboard</h1>
          <p className="text-violet-100 max-w-xl text-sm sm:text-base">
            Track metrics, generate cover letters, manage referral requests, and improve your resume match scores dynamically using AI.
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
                <span className="text-sm font-semibold text-slate-550 dark:text-slate-450">{stat.label}</span>
                <div className={`p-2.5 rounded-xl bg-gradient-to-br ${stat.color} text-white`}>
                  <Icon className="h-5 w-5" />
                </div>
              </div>
              <div className="mt-4 space-y-1">
                <span className="text-3xl font-extrabold text-slate-900 dark:text-white">{stat.count}</span>
                <p className="text-xs text-violet-600 dark:text-violet-400 font-medium">{stat.change}</p>
              </div>
            </div>
          )
        })}
      </div>

      {/* Widgets Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Follow Ups */}
        <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 border border-slate-100 dark:border-slate-700 shadow-sm lg:col-span-2">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-700">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center">
              <Calendar className="mr-2 h-5 w-5 text-violet-550" />
              Upcoming Follow-ups & Interviews
            </h3>
            <Link to="/applications" className="text-xs font-semibold text-violet-600 hover:text-violet-500 dark:text-violet-400 flex items-center">
              View Board <ChevronRight className="h-4 w-4" />
            </Link>
          </div>
          <div className="mt-4 divide-y divide-slate-100 dark:divide-slate-700">
            {upcomingFollowups.map((item, idx) => (
              <div key={idx} className="py-4 first:pt-0 last:pb-0 flex items-center justify-between">
                <div className="space-y-1">
                  <h4 className="font-bold text-slate-900 dark:text-white text-sm sm:text-base">
                    {item.company} &bull; <span className="text-slate-500 dark:text-slate-400 font-normal">{item.role}</span>
                  </h4>
                  <p className="text-xs text-slate-400">{item.type}</p>
                </div>
                <span className="text-xs sm:text-sm font-semibold bg-violet-50 dark:bg-violet-950/40 text-violet-650 dark:text-violet-400 px-3.5 py-1.5 rounded-full">
                  {item.date}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 border border-slate-100 dark:border-slate-700 shadow-sm flex flex-col justify-between">
          <div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4">
              Quick Actions
            </h3>
            <div className="space-y-3">
              <Link 
                to="/resume-builder" 
                className="flex items-center p-3 rounded-xl border border-slate-100 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors"
              >
                <div className="p-2 rounded-lg bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 mr-3">
                  <FileText className="h-5 w-5" />
                </div>
                <div className="text-left">
                  <h4 className="text-sm font-bold text-slate-950 dark:text-white">Upload Resume</h4>
                  <p className="text-xs text-slate-450 dark:text-slate-400">Analyze keywords using AI</p>
                </div>
              </Link>
              <Link 
                to="/jobs" 
                className="flex items-center p-3 rounded-xl border border-slate-100 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors"
              >
                <div className="p-2 rounded-lg bg-violet-50 dark:bg-violet-900/30 text-violet-600 dark:text-violet-400 mr-3">
                  <Briefcase className="h-5 w-5" />
                </div>
                <div className="text-left">
                  <h4 className="text-sm font-bold text-slate-950 dark:text-white">Match Job Role</h4>
                  <p className="text-xs text-slate-450 dark:text-slate-400">Check matching percentages</p>
                </div>
              </Link>
            </div>
          </div>
          
          <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-700 text-center">
            <Link 
              to="/design-system" 
              className="text-xs text-violet-600 dark:text-violet-400 font-semibold hover:underline"
            >
              Access Developer Playground
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
