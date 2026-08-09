import React from 'react'
import { RefreshCw, AlertCircle, Check, BookOpen } from 'lucide-react'
import { Button } from '@/components/Button'
import { Badge } from '@/components/Badge'
import { useSkillGapQuery } from '@/hooks/useAICopilot'

interface SkillGapTabProps {
  selectedResumeId: string
  selectedJobId: string
}

export const SkillGapTab: React.FC<SkillGapTabProps> = ({ selectedResumeId, selectedJobId }) => {
  const {
    data: skillGapResponse,
    isLoading: isSkillGapLoading,
    error: skillGapError,
    refetch: refetchSkillGap,
  } = useSkillGapQuery(selectedResumeId || null, selectedJobId || null)

  return (
    <div className="space-y-6 flex-1 flex flex-col">
      <div className="flex items-center justify-between">
        <div>
          <h4 className="font-extrabold text-slate-900 dark:text-white text-base">Match Diagnostics & Recommendations</h4>
          <p className="text-slate-500 text-xs mt-0.5">Calculates keyword overlap and highlights missing core skills.</p>
        </div>
        <Button
          size="sm"
          variant="secondary"
          onClick={() => refetchSkillGap()}
          disabled={isSkillGapLoading}
          icon={<RefreshCw className={`h-3.5 w-3.5 ${isSkillGapLoading ? 'animate-spin' : ''}`} />}
        >
          Refresh
        </Button>
      </div>

      {isSkillGapLoading ? (
        <div className="flex-1 py-16 flex flex-col items-center justify-center space-y-3">
          <span className="animate-spin h-8 w-8 text-violet-650 rounded-full border-2 border-violet-100 border-t-violet-650" />
          <p className="text-xs text-slate-500 font-semibold">Running deep semantic model matching...</p>
        </div>
      ) : skillGapError ? (
        <div className="p-4 bg-red-50 border border-red-200 rounded-xl text-red-700 text-xs flex items-start gap-2.5">
          <AlertCircle className="h-4.5 w-4.5 flex-shrink-0 text-red-650" />
          <div>
            <span className="font-bold">Error analyzing match gap.</span>
            <p className="mt-1 font-semibold">{skillGapError.message || 'Make sure the backend is running and valid contexts are uploaded.'}</p>
          </div>
        </div>
      ) : skillGapResponse ? (
        <div className="space-y-6">
          {/* Score section */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 items-center">
            <div className="bg-slate-50/50 dark:bg-slate-900/20 p-6 rounded-2xl border border-slate-100 dark:border-slate-700 flex flex-col items-center justify-center text-center">
              <div className="relative flex items-center justify-center">
                <svg className="w-24 h-24 transform -rotate-90">
                  <circle
                    className="text-slate-200 dark:text-slate-700"
                    strokeWidth="8"
                    stroke="currentColor"
                    fill="transparent"
                    r="38"
                    cx="48"
                    cy="48"
                  />
                  <circle
                    className="text-violet-650 dark:text-violet-500"
                    strokeWidth="8"
                    strokeDasharray={2 * Math.PI * 38}
                    strokeDashoffset={2 * Math.PI * 38 * (1 - skillGapResponse.score / 100)}
                    strokeLinecap="round"
                    stroke="currentColor"
                    fill="transparent"
                    r="38"
                    cx="48"
                    cy="48"
                  />
                </svg>
                <span className="absolute text-xl font-black text-slate-900 dark:text-white">
                  {skillGapResponse.score}%
                </span>
              </div>
              <span className="text-xxs font-extrabold tracking-wider uppercase text-slate-400 mt-3">Match Score</span>
              <Badge
                variant={skillGapResponse.score >= 80 ? 'offer' : 'applied'}
                className="mt-2 text-[10px]"
              >
                {skillGapResponse.score >= 80 ? 'High Compatibility' : 'Moderate Fit'}
              </Badge>
            </div>

            <div className="md:col-span-3 space-y-4">
              {/* Matched Skills */}
              <div className="space-y-2">
                <h5 className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                  <Check className="h-4 w-4 text-emerald-500" />
                  Matched Skills ({skillGapResponse.matchedSkills.length})
                </h5>
                <div className="flex flex-wrap gap-1.5">
                  {skillGapResponse.matchedSkills.length > 0 ? (
                    skillGapResponse.matchedSkills.map((s: string, idx: number) => (
                      <Badge key={idx} variant="offer" className="!py-0.5 !px-2.5 text-[11px] font-medium">
                        {s}
                      </Badge>
                    ))
                  ) : (
                    <span className="text-xs text-slate-400 italic">No skills overlap identified.</span>
                  )}
                </div>
              </div>

              {/* Missing Skills */}
              <div className="space-y-2">
                <h5 className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                  <AlertCircle className="h-4 w-4 text-amber-500" />
                  Missing Skills ({skillGapResponse.missingSkills.length})
                </h5>
                <div className="flex flex-wrap gap-1.5">
                  {skillGapResponse.missingSkills.length > 0 ? (
                    skillGapResponse.missingSkills.map((s: string, idx: number) => (
                      <Badge key={idx} variant="warning" className="!py-0.5 !px-2.5 text-[11px] font-medium border-amber-200 text-amber-700 bg-amber-50 dark:bg-amber-950/20 dark:text-amber-400 dark:border-amber-900/40">
                        {s}
                      </Badge>
                    ))
                  ) : (
                    <span className="text-xs text-slate-400 italic">Perfect matching! No gaps found.</span>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Recommendations */}
          <div className="border-t border-slate-100 dark:border-slate-700 pt-5 space-y-3">
            <h5 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
              <BookOpen className="h-4 w-4 text-violet-650" />
              Optimization & Learning Roadmap
            </h5>
            <ul className="space-y-2.5">
              {skillGapResponse.recommendations && skillGapResponse.recommendations.length > 0 ? (
                skillGapResponse.recommendations.map((rec: string, i: number) => (
                  <li key={i} className="text-xs font-semibold text-slate-600 dark:text-slate-300 flex items-start gap-2">
                    <span className="h-4.5 w-4.5 rounded-full bg-violet-50 dark:bg-violet-950/40 text-violet-650 dark:text-violet-400 font-extrabold flex items-center justify-center text-[10px] flex-shrink-0 mt-0.5">
                      {i + 1}
                    </span>
                    <span>{rec}</span>
                  </li>
                ))
              ) : (
                <span className="text-xs text-slate-400 italic">Everything is in alignment! No adjustments recommended.</span>
              )}
            </ul>
          </div>
        </div>
      ) : (
        <div className="py-12 text-center text-slate-400">
          <Check className="h-10 w-10 mx-auto text-slate-300 mb-2" />
          <p className="text-xs font-bold">Diagnostics ready to run.</p>
          <p className="text-xxs text-slate-400 mt-1">Select refresh or configure contexts to begin analysis.</p>
        </div>
      )}
    </div>
  )
}

export default SkillGapTab
