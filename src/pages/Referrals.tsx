import React from 'react'
import { Users, UserPlus } from 'lucide-react'

export const Referrals: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-5 border-b border-slate-205 dark:border-slate-700 gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white">Referrals</h1>
          <p className="text-slate-550 dark:text-slate-400 mt-1">Track employee outreach requests and template copies.</p>
        </div>
        <button className="flex items-center px-4 py-2 bg-violet-650 hover:bg-violet-755 text-white font-semibold rounded-xl text-sm transition shadow-sm cursor-pointer self-start sm:self-auto">
          <UserPlus className="mr-1.5 h-5 w-5" /> Add Contact
        </button>
      </div>

      <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-100 dark:border-slate-700 shadow-sm">
        <div className="py-12 flex flex-col items-center justify-center text-slate-450 dark:text-slate-500 text-center">
          <Users className="h-12 w-12 text-slate-350 mb-3" />
          <h4 className="font-bold text-slate-900 dark:text-white text-base">No Referrals Registered</h4>
          <p className="text-xs text-slate-550 max-w-sm mt-1">
            Log employee networks to manage outreach template copies and track pipeline conversions.
          </p>
        </div>
      </div>
    </div>
  )
}
