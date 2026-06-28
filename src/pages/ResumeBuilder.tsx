import React from 'react'
import { FileText, Upload } from 'lucide-react'

export const ResumeBuilder: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between pb-5 border-b border-slate-200 dark:border-slate-700">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white">Resume Builder & Parser</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1">Upload and optimize your resumes with AI keywords matching.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white dark:bg-slate-800 p-8 rounded-2xl border border-slate-100 dark:border-slate-700 shadow-sm text-center">
          <div className="max-w-md mx-auto py-12 flex flex-col items-center justify-center border-2 border-dashed border-slate-350 dark:border-slate-600 rounded-xl bg-slate-50/50 dark:bg-slate-750/30">
            <Upload className="h-12 w-12 text-slate-400 dark:text-slate-500 mb-4" />
            <h3 className="font-bold text-slate-900 dark:text-white text-base">Drag and drop your resume file</h3>
            <p className="text-xs text-slate-500 mt-1 mb-6">Supports PDF and DOCX up to 5MB</p>
            <button className="px-5 py-2.5 bg-violet-650 hover:bg-violet-755 text-white font-semibold rounded-lg text-sm transition shadow-sm cursor-pointer">
              Choose File
            </button>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-100 dark:border-slate-700 shadow-sm space-y-4">
          <h3 className="text-lg font-bold text-slate-950 dark:text-white flex items-center">
            <FileText className="mr-2 h-5 w-5 text-violet-550" />
            Your Resumes
          </h3>
          <p className="text-xs text-slate-500 leading-relaxed">
            No resumes uploaded yet. Upload a resume file to analyze core technical skills and align cover templates.
          </p>
        </div>
      </div>
    </div>
  )
}
