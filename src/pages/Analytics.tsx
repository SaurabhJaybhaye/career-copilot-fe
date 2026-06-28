import React from 'react'
import { BarChart3, TrendingUp, Compass } from 'lucide-react'

export const Analytics: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between pb-5 border-b border-slate-200 dark:border-slate-700">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white">Analytics</h1>
          <p className="text-slate-550 dark:text-slate-400 mt-1">Review application conversions and source performance reports.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-100 dark:border-slate-700 shadow-sm flex flex-col justify-between min-h-[300px]">
          <h3 className="font-bold text-slate-900 dark:text-white text-base flex items-center">
            <TrendingUp className="mr-2 h-5 w-5 text-violet-550" />
            Conversion Performance
          </h3>
          <div className="flex-1 flex flex-col items-center justify-center text-center text-slate-400 dark:text-slate-500">
            <BarChart3 className="h-10 w-10 text-slate-350 mb-2" />
            <p className="text-xs">No analytics data available to compile funnel representations yet.</p>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-100 dark:border-slate-700 shadow-sm flex flex-col justify-between min-h-[300px]">
          <h3 className="font-bold text-slate-900 dark:text-white text-base flex items-center">
            <Compass className="mr-2 h-5 w-5 text-violet-550" />
            Source Success Rate
          </h3>
          <div className="flex-1 flex flex-col items-center justify-center text-center text-slate-400 dark:text-slate-500">
            <BarChart3 className="h-10 w-10 text-slate-350 mb-2" />
            <p className="text-xs">No jobs linked to compute success stats per source.</p>
          </div>
        </div>
      </div>
    </div>
  )
}
