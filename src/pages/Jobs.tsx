import React from 'react'
import { Briefcase, Search, Plus } from 'lucide-react'

export const Jobs: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-5 border-b border-slate-205 dark:border-slate-700 gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white">Job Matches</h1>
          <p className="text-slate-550 dark:text-slate-400 mt-1">Analyze job descriptions and find matching roles.</p>
        </div>
        <button className="flex items-center px-4 py-2 bg-violet-650 hover:bg-violet-755 text-white font-semibold rounded-xl text-sm transition shadow-sm cursor-pointer self-start sm:self-auto">
          <Plus className="mr-1.5 h-5 w-5" /> Add New Job
        </button>
      </div>

      <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-100 dark:border-slate-700 shadow-sm">
        <div className="flex flex-col sm:flex-row items-center space-y-3 sm:space-y-0 sm:space-x-4 pb-6 border-b border-slate-100 dark:border-slate-700">
          <div className="relative flex-1 w-full">
            <Search className="absolute left-3.5 top-1/2 transform -translate-y-1/2 text-slate-400 h-5 w-5" />
            <input 
              type="text" 
              placeholder="Search companies, roles, or keyword tags..."
              className="pl-11 pr-4 py-2 border border-slate-200 dark:border-slate-650 rounded-xl text-sm w-full bg-slate-50 dark:bg-slate-750 text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-violet-500 focus:border-violet-500"
            />
          </div>
        </div>

        <div className="py-12 flex flex-col items-center justify-center text-slate-450 dark:text-slate-500 text-center">
          <Briefcase className="h-12 w-12 text-slate-350 mb-3" />
          <h4 className="font-bold text-slate-900 dark:text-white text-base">No Jobs Tracked Yet</h4>
          <p className="text-xs text-slate-500 max-w-sm mt-1">
            Create job entries with job descriptions to check match scores and generate application cover drafts.
          </p>
        </div>
      </div>
    </div>
  )
}
