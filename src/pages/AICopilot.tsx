import React, { useState } from 'react'
import { useSearchParams, Link } from 'react-router-dom'
import { Sparkles, Brain, FileText, Briefcase } from 'lucide-react'
import { Select } from '@/components/Select'
import { useResumesQuery } from '@/hooks/useResumes'
import { useJobsQuery } from '@/hooks/useJobs'
import { SkillGapTab } from '@/features/ai-copilot/SkillGapTab'
import { TailorResumeTab } from '@/features/ai-copilot/TailorResumeTab'
import { CoverLetterTab } from '@/features/ai-copilot/CoverLetterTab'
import { ReferralTab } from '@/features/ai-copilot/ReferralTab'

export const AICopilot: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams()
  const paramResumeId = searchParams.get('resumeId') || ''
  const paramJobId = searchParams.get('jobId') || ''

  // Data queries
  const { data: resumes = [], isLoading: isResumesLoading } = useResumesQuery()
  const { data: jobs = [], isLoading: isJobsLoading } = useJobsQuery()

  // State controls for manually selected IDs
  const [selectedResumeIdState, setSelectedResumeIdState] = useState<string>('')
  const [selectedJobIdState, setSelectedJobIdState] = useState<string>('')
  const [activeTab, setActiveTab] = useState<'skill-gap' | 'tailor' | 'cover-letter' | 'referral'>('skill-gap')

  // Derive active selection cleanly without triggering set-state-in-effect anti-patterns
  const effectiveResumeId =
    selectedResumeIdState ||
    paramResumeId ||
    resumes.find((r) => r.isDefault)?._id ||
    resumes.find((r) => r.isDefault)?.id ||
    resumes[0]?._id ||
    resumes[0]?.id ||
    ''

  const effectiveJobId =
    selectedJobIdState ||
    paramJobId ||
    jobs[0]?._id ||
    jobs[0]?.id ||
    ''

  // Event handlers
  const handleResumeSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const val = e.target.value
    setSelectedResumeIdState(val)
    setSearchParams((prev) => {
      if (val) prev.set('resumeId', val)
      else prev.delete('resumeId')
      return prev
    })
  }

  const handleJobSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const val = e.target.value
    setSelectedJobIdState(val)
    setSearchParams((prev) => {
      if (val) prev.set('jobId', val)
      else prev.delete('jobId')
      return prev
    })
  }

  const activeResume = resumes.find((r) => (r._id || r.id) === effectiveResumeId)
  const activeJob = jobs.find((j) => (j._id || j.id) === effectiveJobId)

  // Options for Select inputs
  const resumeOptions = resumes.map((r) => ({
    value: r._id || r.id || '',
    label: r.title + (r.isDefault ? ' (Default)' : ''),
  }))

  const jobOptions = jobs.map((j) => ({
    value: j._id || j.id || '',
    label: `${j.title} at ${j.company}`,
  }))

  const isSelectionActive = !!effectiveResumeId && !!effectiveJobId

  return (
    <div className="space-y-6 text-left">
      {/* Page Header */}
      <div className="pb-5 border-b border-slate-200 dark:border-slate-700 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
            <Sparkles className="h-8 w-8 text-violet-600 animate-pulse" />
            AI Copilot Engine
          </h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1">
            Leverage advanced semantic matching to optimize your applications, tailor resumes, draft cover letters, and build networking messages.
          </p>
        </div>
      </div>

      {/* Target Setup Panel */}
      <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-100 dark:border-slate-700 shadow-sm space-y-4">
        <h3 className="text-base font-bold text-slate-950 dark:text-white flex items-center gap-2">
          <Brain className="h-5 w-5 text-violet-650" />
          Target Workpiece Configuration
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            {isResumesLoading ? (
              <div className="h-10 animate-pulse bg-slate-100 dark:bg-slate-700 rounded-xl" />
            ) : resumes.length === 0 ? (
              <div className="p-3 border border-dashed border-red-200 rounded-xl text-center bg-red-50/20 text-red-650 text-xs">
                No resumes found. Please <Link to="/resume-builder" className="font-bold underline">Upload a resume</Link> first.
              </div>
            ) : (
              <Select
                label="Step 1: Select Your Resume Profile"
                value={effectiveResumeId}
                onChange={handleResumeSelectChange}
                options={resumeOptions}
                placeholder="Choose resume context..."
              />
            )}
          </div>

          <div>
            {isJobsLoading ? (
              <div className="h-10 animate-pulse bg-slate-100 dark:bg-slate-700 rounded-xl" />
            ) : jobs.length === 0 ? (
              <div className="p-3 border border-dashed border-red-200 rounded-xl text-center bg-red-50/20 text-red-650 text-xs">
                No target jobs tracked. Please <Link to="/jobs" className="font-bold underline">Add a job description</Link> first.
              </div>
            ) : (
              <Select
                label="Step 2: Select Target Job Description"
                value={effectiveJobId}
                onChange={handleJobSelectChange}
                options={jobOptions}
                placeholder="Choose job context..."
              />
            )}
          </div>
        </div>

        {isSelectionActive && activeResume && activeJob && (
          <div className="pt-2 flex flex-wrap items-center gap-x-4 gap-y-2 border-t border-slate-100 dark:border-slate-700 text-xs font-semibold text-slate-500 dark:text-slate-400">
            <span className="flex items-center gap-1">
              <FileText className="h-3.5 w-3.5" /> Source: {activeResume.title}
            </span>
            <span className="text-slate-300 dark:text-slate-700">|</span>
            <span className="flex items-center gap-1">
              <Briefcase className="h-3.5 w-3.5" /> Target: {activeJob.title} ({activeJob.company})
            </span>
          </div>
        )}
      </div>

      {/* Main Feature Container */}
      {!isSelectionActive ? (
        <div className="bg-slate-50 dark:bg-slate-900/40 p-12 text-center rounded-2xl border border-slate-200 dark:border-slate-800 space-y-4 max-w-lg mx-auto">
          <Sparkles className="h-12 w-12 text-slate-300 dark:text-slate-700 mx-auto" />
          <h4 className="font-extrabold text-slate-800 dark:text-slate-200 text-base">Select Your Inputs</h4>
          <p className="text-xs text-slate-400 dark:text-slate-500 leading-relaxed">
            Please pick a resume profile and a target job from the configuration card above to analyze skill gaps, generate cover letters, and tailor your content.
          </p>
        </div>
      ) : (
        <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700 shadow-sm overflow-hidden flex flex-col min-h-[500px]">
          {/* Tabs header */}
          <div className="bg-slate-50/50 dark:bg-slate-900/30 border-b border-slate-200 dark:border-slate-700 px-6 flex overflow-x-auto gap-4">
            <button
              onClick={() => setActiveTab('skill-gap')}
              className={`py-3.5 px-1 font-bold text-xs uppercase tracking-wider border-b-2 transition duration-200 cursor-pointer whitespace-nowrap ${
                activeTab === 'skill-gap'
                  ? 'border-violet-600 text-violet-600 dark:border-violet-400 dark:text-violet-400'
                  : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-300'
              }`}
            >
              Skill Gap Analyzer
            </button>
            <button
              onClick={() => setActiveTab('tailor')}
              className={`py-3.5 px-1 font-bold text-xs uppercase tracking-wider border-b-2 transition duration-200 cursor-pointer whitespace-nowrap ${
                activeTab === 'tailor'
                  ? 'border-violet-600 text-violet-600 dark:border-violet-400 dark:text-violet-400'
                  : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-300'
              }`}
            >
              Tailor Resume
            </button>
            <button
              onClick={() => setActiveTab('cover-letter')}
              className={`py-3.5 px-1 font-bold text-xs uppercase tracking-wider border-b-2 transition duration-200 cursor-pointer whitespace-nowrap ${
                activeTab === 'cover-letter'
                  ? 'border-violet-600 text-violet-600 dark:border-violet-400 dark:text-violet-400'
                  : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-300'
              }`}
            >
              Cover Letter
            </button>
            <button
              onClick={() => setActiveTab('referral')}
              className={`py-3.5 px-1 font-bold text-xs uppercase tracking-wider border-b-2 transition duration-200 cursor-pointer whitespace-nowrap ${
                activeTab === 'referral'
                  ? 'border-violet-600 text-violet-600 dark:border-violet-400 dark:text-violet-400'
                  : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-300'
              }`}
            >
              Referral Message
            </button>
          </div>

          {/* Workspace content */}
          <div className="p-6 flex-1 flex flex-col">
            {activeTab === 'skill-gap' && (
              <SkillGapTab
                selectedResumeId={effectiveResumeId}
                selectedJobId={effectiveJobId}
              />
            )}

            {activeTab === 'tailor' && (
              <TailorResumeTab
                selectedResumeId={effectiveResumeId}
                selectedJobId={effectiveJobId}
                activeJob={activeJob ? { company: activeJob.company, title: activeJob.title } : undefined}
              />
            )}

            {activeTab === 'cover-letter' && (
              <CoverLetterTab
                selectedResumeId={effectiveResumeId}
                selectedJobId={effectiveJobId}
                jobs={jobs}
                activeJob={activeJob ? { company: activeJob.company, title: activeJob.title } : undefined}
              />
            )}

            {activeTab === 'referral' && (
              <ReferralTab
                selectedResumeId={effectiveResumeId}
                selectedJobId={effectiveJobId}
              />
            )}
          </div>
        </div>
      )}
    </div>
  )
}

export default AICopilot
