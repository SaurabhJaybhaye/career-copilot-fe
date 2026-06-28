import React from 'react'
import { toast } from 'react-hot-toast'
import { Play, Info, AlertTriangle, CheckCircle2 } from 'lucide-react'

export const DesignSystem: React.FC = () => {
  const triggerToast = () => {
    toast.success('Nice! Design System toast tested successfully!')
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 p-6 md:p-10 space-y-10 transition-colors duration-200">
      {/* Header */}
      <div className="pb-6 border-b border-slate-205 dark:border-slate-700 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="text-left">
          <h1 className="text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">Design System Playground</h1>
          <p className="text-slate-550 dark:text-slate-400 mt-1">Review the application architecture theme patterns, styles, components, and responsive cards.</p>
        </div>
        <button 
          onClick={triggerToast}
          className="flex items-center px-5 py-2.5 bg-violet-650 hover:bg-violet-755 text-white font-semibold rounded-xl text-sm transition shadow-sm cursor-pointer self-start md:self-auto"
        >
          <Play className="mr-2 h-4 w-4" /> Trigger Sample Toast
        </button>
      </div>

      {/* Theme Colors */}
      <section className="space-y-4 text-left">
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Color Swatches</h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-4">
          <div className="space-y-1">
            <div className="h-16 rounded-xl bg-violet-600 shadow-sm"></div>
            <span className="text-xs font-bold text-slate-800 dark:text-slate-200">Violet-600</span>
          </div>
          <div className="space-y-1">
            <div className="h-16 rounded-xl bg-indigo-600 shadow-sm"></div>
            <span className="text-xs font-bold text-slate-800 dark:text-slate-200">Indigo-600</span>
          </div>
          <div className="space-y-1">
            <div className="h-16 rounded-xl bg-blue-600 shadow-sm"></div>
            <span className="text-xs font-bold text-slate-800 dark:text-slate-200">Blue-600</span>
          </div>
          <div className="space-y-1">
            <div className="h-16 rounded-xl bg-emerald-600 shadow-sm"></div>
            <span className="text-xs font-bold text-slate-800 dark:text-slate-200">Emerald-600</span>
          </div>
          <div className="space-y-1">
            <div className="h-16 rounded-xl bg-amber-500 shadow-sm"></div>
            <span className="text-xs font-bold text-slate-800 dark:text-slate-200">Amber-550</span>
          </div>
          <div className="space-y-1">
            <div className="h-16 rounded-xl bg-slate-800 dark:bg-slate-700 shadow-sm"></div>
            <span className="text-xs font-bold text-slate-800 dark:text-slate-200">Neutral Dark</span>
          </div>
        </div>
      </section>

      {/* Form Buttons */}
      <section className="space-y-4 text-left">
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Buttons</h2>
        <div className="flex flex-wrap gap-4">
          <button className="px-4 py-2 bg-violet-650 hover:bg-violet-755 text-white font-semibold rounded-lg text-sm transition cursor-pointer">
            Primary Button
          </button>
          <button className="px-4 py-2 border border-slate-300 dark:border-slate-655 text-slate-700 dark:text-slate-300 font-semibold rounded-lg text-sm hover:bg-slate-50 dark:hover:bg-slate-800 transition cursor-pointer">
            Secondary Button
          </button>
          <button className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-lg text-sm transition cursor-pointer">
            Danger Button
          </button>
          <button className="px-4 py-2 bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-250 dark:hover:bg-slate-650 font-semibold rounded-lg text-sm transition cursor-pointer">
            Default Button
          </button>
        </div>
      </section>

      {/* Info Cards */}
      <section className="space-y-4 text-left">
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Alert Elements</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-4 bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800/40 rounded-2xl flex items-start text-blue-800 dark:text-blue-300">
            <Info className="h-5 w-5 mr-3 mt-0.5 flex-shrink-0" />
            <div>
              <h4 className="font-bold text-sm">Informational Dialog</h4>
              <p className="text-xs mt-1 leading-relaxed">This alerts details background metadata or system updates.</p>
            </div>
          </div>
          <div className="p-4 bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800/40 rounded-2xl flex items-start text-amber-800 dark:text-amber-350">
            <AlertTriangle className="h-5 w-5 mr-3 mt-0.5 flex-shrink-0" />
            <div>
              <h4 className="font-bold text-sm">Warning Warning</h4>
              <p className="text-xs mt-1 leading-relaxed">This alerts highlights expired session cookies or authorization refreshes.</p>
            </div>
          </div>
          <div className="p-4 bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-800/40 rounded-2xl flex items-start text-emerald-800 dark:text-emerald-300">
            <CheckCircle2 className="h-5 w-5 mr-3 mt-0.5 flex-shrink-0" />
            <div>
              <h4 className="font-bold text-sm">Success Check</h4>
              <p className="text-xs mt-1 leading-relaxed">This alerts verifies successful resume parser output data.</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
