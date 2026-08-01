import React, { useState } from 'react'
import { Briefcase, MapPin, DollarSign, ExternalLink, Sparkles, ChevronDown, ChevronUp, Zap, FileText, AlertCircle, Calendar, Clock } from 'lucide-react'
import { Button } from './Button'
import type { ScrapedJobItem } from '@/hooks/useJobs'

export interface ExternalJobCardProps {
  job: ScrapedJobItem
  portal?: 'linkedin' | 'indeed'
  onMatchResumes?: (jobId: string) => void
  onTailorResume?: (jobId: string) => void
}

export const ExternalJobCard: React.FC<ExternalJobCardProps> = ({
  job,
  portal = 'linkedin',
  onMatchResumes,
  onTailorResume,
}) => {
  const [showInsights, setShowInsights] = useState(true)
  const [showFullDescription, setShowFullDescription] = useState(false)

  const isLinkedIn = (job.url && job.url.includes('linkedin.com')) || portal === 'linkedin'
  const isIndeed = (job.url && job.url.includes('indeed.com')) || portal === 'indeed'

  const rawDate = job.postedAt || job.createdAt
  let formattedDateStr = ''
  if (rawDate) {
    const d = new Date(rawDate)
    if (!isNaN(d.getTime())) {
      formattedDateStr = `${d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} at ${d.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true })}`
    } else {
      formattedDateStr = String(rawDate)
    }
  }

  return (
    <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200/80 dark:border-slate-700 shadow-sm hover:shadow-md transition duration-200 p-5 text-left flex flex-col justify-between space-y-4">
      {/* Top Header & Badges */}
      <div className="space-y-3">
        <div className="flex items-start justify-between gap-3">
          <div className="space-y-1">
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className="text-base font-extrabold text-slate-900 dark:text-white hover:text-violet-600 dark:hover:text-violet-400 transition">
                {job.title}
              </h3>
            </div>
            <div className="flex items-center text-sm font-semibold text-slate-600 dark:text-slate-300 gap-1.5">
              <Briefcase className="h-4 w-4 text-violet-650 opacity-80" />
              <span>{job.company}</span>
            </div>
          </div>

          {/* Badges Container */}
          <div className="flex items-center gap-1.5 flex-shrink-0 flex-wrap justify-end">
            {/* Easy Apply Badge */}
            {job.isEasyApply && (
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800/50">
                <Zap className="w-3 h-3 mr-1 fill-emerald-500 text-emerald-500" /> Easy Apply
              </span>
            )}

            {/* Portal Source Badge */}
            {isLinkedIn && (
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-50 text-blue-700 dark:bg-blue-950/50 dark:text-blue-300 border border-blue-200 dark:border-blue-800/50">
                LinkedIn
              </span>
            )}
            {isIndeed && (
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-indigo-50 text-indigo-700 dark:bg-indigo-950/50 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800/50">
                Indeed
              </span>
            )}
          </div>
        </div>

        {/* Location, Salary & Posted Date */}
        <div className="flex flex-wrap items-center gap-4 text-xs font-semibold text-slate-500 dark:text-slate-400">
          <span className="flex items-center gap-1">
            <MapPin className="h-3.5 w-3.5 text-slate-400" />
            {job.location || 'Remote'}
          </span>
          {job.salary && (
            <span className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-bold">
              <DollarSign className="h-3.5 w-3.5" />
              {job.salary}
            </span>
          )}
          {formattedDateStr && (
            <span className="flex items-center gap-1 text-slate-500 dark:text-slate-400 font-medium">
              <Calendar className="h-3.5 w-3.5 text-violet-650 opacity-70" />
              Posted {formattedDateStr}
            </span>
          )}
        </div>

        {/* Skills Chips */}
        {job.skills && job.skills.length > 0 && (
          <div className="space-y-1.5 pt-1">
            <div className="text-[11px] font-extrabold text-slate-400 dark:text-slate-400 uppercase tracking-wider">
              Required Skills
            </div>
            <div className="flex flex-wrap gap-1.5">
              {job.skills.map((skill, index) => (
                <span
                  key={index}
                  className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-violet-50 text-violet-700 dark:bg-violet-950/40 dark:text-violet-300 border border-violet-100 dark:border-violet-800/40"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Technologies & Domains Chips (If available) */}
        {((job.technologies && job.technologies.length > 0) || (job.domains && job.domains.length > 0)) && (
          <div className="flex flex-wrap gap-1.5 pt-0.5">
            {job.technologies?.map((tech, idx) => (
              <span key={`tech-${idx}`} className="px-2 py-0.5 rounded text-[11px] font-medium bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300">
                {tech}
              </span>
            ))}
            {job.domains?.map((domain, idx) => (
              <span key={`domain-${idx}`} className="px-2 py-0.5 rounded text-[11px] font-medium bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300">
                {domain}
              </span>
            ))}
          </div>
        )}

        {/* Notes & Insights Callout */}
        {job.insights && job.insights.length > 0 && (
          <div className="rounded-xl border border-amber-200/80 bg-amber-50/50 dark:bg-amber-950/20 dark:border-amber-800/40 overflow-hidden text-xs">
            <button
              type="button"
              onClick={() => setShowInsights(!showInsights)}
              className="w-full px-3.5 py-2.5 flex items-center justify-between font-bold text-amber-800 dark:text-amber-300 hover:bg-amber-100/50 dark:hover:bg-amber-900/30 transition text-left"
            >
              <span className="flex items-center gap-1.5">
                <AlertCircle className="h-4 w-4 text-amber-600 dark:text-amber-400" />
                AI Job Insights ({job.insights.length})
              </span>
              {showInsights ? <ChevronUp className="h-3.5 w-3.5" /> : <ChevronDown className="h-3.5 w-3.5" />}
            </button>

            {showInsights && (
              <ul className="px-3.5 pb-3 pt-1 space-y-1 text-amber-900 dark:text-amber-200 border-t border-amber-200/50 dark:border-amber-800/30">
                {job.insights.map((insight, idx) => (
                  <li key={idx} className="flex items-start gap-1.5">
                    <span className="text-amber-500 font-bold">•</span>
                    <span>{insight}</span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}

        {/* Expandable Description Details */}
        {job.description && (
          <div className="text-xs text-slate-600 dark:text-slate-400 space-y-1">
            <p className={showFullDescription ? '' : 'line-clamp-3'}>{job.description}</p>
            <button
              type="button"
              onClick={() => setShowFullDescription(!showFullDescription)}
              className="text-violet-650 dark:text-violet-400 font-semibold hover:underline"
            >
              {showFullDescription ? 'Show less' : 'Read full description'}
            </button>
          </div>
        )}
      </div>

      {/* Action Footer */}
      <div className="pt-3 border-t border-slate-100 dark:border-slate-700/80 flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          {/* Apply Direct Link */}
          {job.url && (
            <a
              href={job.url}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-extrabold text-white bg-slate-900 hover:bg-slate-800 dark:bg-violet-650 dark:hover:bg-violet-600 transition shadow-sm"
            >
              <ExternalLink className="h-3.5 w-3.5" /> Apply Direct
            </a>
          )}
        </div>

        <div className="flex items-center gap-2">
          {/* Match Resumes Button */}
          {onMatchResumes && (
            <Button
              variant="secondary"
              size="sm"
              onClick={() => onMatchResumes(job._id)}
              className="!py-1.5 !px-3 text-xs flex items-center gap-1"
            >
              <FileText className="h-3.5 w-3.5 text-violet-600" /> Match Resumes
            </Button>
          )}

          {/* Tailor Resume Button */}
          {onTailorResume && (
            <Button
              variant="primary"
              size="sm"
              onClick={() => onTailorResume(job._id)}
              className="!py-1.5 !px-3 text-xs flex items-center gap-1"
            >
              <Sparkles className="h-3.5 w-3.5" /> Tailor Resume
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}
