import React from 'react'
import { KanbanSquare } from 'lucide-react'

export const Applications: React.FC = () => {
  const columns = ['Saved', 'Applied', 'Assessment', 'Interview', 'Offer', 'Rejected']

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-5 border-b border-slate-205 dark:border-slate-700 gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white flex items-center">
            <KanbanSquare className="mr-2.5 h-8 w-8 text-violet-550" />
            Application Tracker
          </h1>
          <p className="text-slate-550 dark:text-slate-400 mt-1">Manage active job pipelines using visual pipelines.</p>
        </div>
      </div>

      {/* Kanban Board Columns Placeholder */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4 overflow-x-auto pb-4">
        {columns.map((col, idx) => (
          <div 
            key={idx} 
            className="bg-slate-100/60 dark:bg-slate-800/60 p-4 rounded-2xl border border-slate-200/50 dark:border-slate-700/50 min-h-[300px] flex flex-col space-y-3"
          >
            <div className="flex items-center justify-between">
              <span className="text-sm font-bold text-slate-805 dark:text-slate-200">{col}</span>
              <span className="text-xs font-semibold bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 px-2 py-0.5 rounded-full">
                0
              </span>
            </div>
            
            <div className="flex-1 flex flex-col items-center justify-center border-2 border-dashed border-slate-250 dark:border-slate-700 rounded-xl p-4 text-center">
              <span className="text-xs text-slate-400 dark:text-slate-500 font-medium">Empty</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
