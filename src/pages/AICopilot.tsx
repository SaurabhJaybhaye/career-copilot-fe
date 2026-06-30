import React, { useState, useEffect } from 'react'
import { useSearchParams, Link } from 'react-router-dom'
import { toast } from 'react-hot-toast'
import { 
  Sparkles, 
  Brain, 
  FileText, 
  Briefcase, 
  Check, 
  Copy, 
  RefreshCw, 
  AlertCircle, 
  Save,
  Send,
  Linkedin,
  Mail,
  MessageSquare,
  BookOpen
} from 'lucide-react'
import { Button } from '@/components/Button'
import { Input, TextArea } from '@/components/Input'
import { Select } from '@/components/Select'
import { Badge } from '@/components/Badge'
import { Modal } from '@/components/Modal'
import { useResumesQuery } from '@/hooks/useResumes'
import { useJobsQuery } from '@/hooks/useJobs'
import { 
  useTailorResumeMutation, 
  useSaveTailoredResumeMutation, 
  useGenerateCoverLetterMutation, 
  useGenerateReferralMutation, 
  useSkillGapQuery 
} from '@/hooks/useAICopilot'

export const AICopilot: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams()
  const paramResumeId = searchParams.get('resumeId')
  const paramJobId = searchParams.get('jobId')

  // Data queries
  const { data: resumes = [], isLoading: isResumesLoading } = useResumesQuery()
  const { data: jobs = [], isLoading: isJobsLoading } = useJobsQuery()

  // State controls
  const [selectedResumeId, setSelectedResumeId] = useState<string>('')
  const [selectedJobId, setSelectedJobId] = useState<string>('')
  const [activeTab, setActiveTab] = useState<'skill-gap' | 'tailor' | 'cover-letter' | 'referral'>('skill-gap')

  // Sync state from query parameters once data is loaded
  useEffect(() => {
    if (paramResumeId && resumes.some(r => (r._id || r.id) === paramResumeId)) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setSelectedResumeId(paramResumeId)
    } else if (resumes.length > 0 && !selectedResumeId && !paramResumeId) {
      // Auto-select default resume if no parameter
      const defaultResume = resumes.find(r => r.isDefault)
      if (defaultResume) {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setSelectedResumeId(defaultResume._id || defaultResume.id)
      } else if (resumes[0]) {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setSelectedResumeId(resumes[0]._id || resumes[0].id)
      }
    }
  }, [paramResumeId, resumes, selectedResumeId])

  useEffect(() => {
    if (paramJobId && jobs.some(j => (j._id || j.id) === paramJobId)) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setSelectedJobId(paramJobId)
    } else if (jobs.length > 0 && !selectedJobId && !paramJobId) {
      // Auto-select first job
      const firstJob = jobs[0]
      if (firstJob) {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setSelectedJobId(firstJob._id || firstJob.id || '')
      }
    }
  }, [paramJobId, jobs, selectedJobId])

  // Update query params when state changes manually
  const handleResumeSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const val = e.target.value
    setSelectedResumeId(val)
    setSearchParams(prev => {
      if (val) prev.set('resumeId', val)
      else prev.delete('resumeId')
      return prev
    })
  }

  const handleJobSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const val = e.target.value
    setSelectedJobId(val)
    setSearchParams(prev => {
      if (val) prev.set('jobId', val)
      else prev.delete('jobId')
      return prev
    })
  }

  const activeResume = resumes.find(r => (r._id || r.id) === selectedResumeId)
  const activeJob = jobs.find(j => (j._id || j.id) === selectedJobId)

  // AI Feature Mutations & Queries
  const tailorResumeMutation = useTailorResumeMutation()
  const saveTailoredResumeMutation = useSaveTailoredResumeMutation()
  const generateCoverLetterMutation = useGenerateCoverLetterMutation()
  const generateReferralMutation = useGenerateReferralMutation()

  // Skill Gap Query - runs automatically if both items are selected
  const { 
    data: skillGapResponse, 
    isLoading: isSkillGapLoading, 
    error: skillGapError,
    refetch: refetchSkillGap
  } = useSkillGapQuery(selectedResumeId || null, selectedJobId || null)

  // Tailor Resume State
  const [tailorPrompt, setTailorPrompt] = useState('')
  const [tailoredText, setTailoredText] = useState('')
  const [tailoredSkills, setTailoredSkills] = useState<string[]>([])
  const [tailoredTech, setTailoredTech] = useState<string[]>([])
  const [tailoredDomains, setTailoredDomains] = useState<string[]>([])
  const [isSaveModalOpen, setIsSaveModalOpen] = useState(false)
  const [saveTitle, setSaveTitle] = useState('')

  // Cover Letter State
  const [coverLetterPrompt, setCoverLetterPrompt] = useState('')
  const [coverLetterText, setCoverLetterText] = useState('')
  const [copiedCoverLetter, setCopiedCoverLetter] = useState(false)

  // Referral Outreach State
  const [referrerName, setReferrerName] = useState('')
  const [outreachPlatform, setOutreachPlatform] = useState('LinkedIn')
  const [outreachPrompt, setOutreachPrompt] = useState('')
  const [outreachText, setOutreachText] = useState('')
  const [copiedOutreach, setCopiedOutreach] = useState(false)

  // Trigger tailor resume
  const handleTailorResume = () => {
    if (!selectedResumeId || !selectedJobId) return
    tailorResumeMutation.mutate(
      {
        resumeId: selectedResumeId,
        jobId: selectedJobId,
        customPrompt: tailorPrompt.trim() || undefined
      },
      {
        onSuccess: (res) => {
          setTailoredText(res.tailoredContent)
          setTailoredSkills(res.skills || [])
          setTailoredTech(res.technologies || [])
          setTailoredDomains(res.domains || [])
          
          // Pre-populate save title
          const companyStr = activeJob ? ` - ${activeJob.company}` : ''
          const roleStr = activeJob ? ` (${activeJob.title})` : ''
          setSaveTitle(`Tailored Resume${companyStr}${roleStr}`)
          
          toast.success('Tailored resume drafted successfully!')
        },
        onError: (err) => {
          toast.error(err.message || 'Failed to tailor resume.')
        }
      }
    )
  }

  // Trigger saving tailored resume
  const handleSaveTailoredResume = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedResumeId || !selectedJobId || !tailoredText) return

    try {
      await saveTailoredResumeMutation.mutateAsync({
        resumeId: selectedResumeId,
        jobId: selectedJobId,
        tailoredContent: tailoredText,
        title: saveTitle.trim() || undefined,
        skills: tailoredSkills,
        technologies: tailoredTech,
        domains: tailoredDomains
      })
      toast.success('Tailored resume saved to your Resume Manager!')
      setIsSaveModalOpen(false)
    } catch (err) {
      const error = err as Error
      toast.error(error.message || 'Failed to save tailored resume.')
    }
  }

  // Trigger generate cover letter
  const handleGenerateCoverLetter = () => {
    if (!selectedResumeId || !selectedJobId) return
    generateCoverLetterMutation.mutate(
      {
        resumeId: selectedResumeId,
        jobId: selectedJobId,
        customPrompt: coverLetterPrompt.trim() || undefined
      },
      {
        onSuccess: (text) => {
          setCoverLetterText(text)
          toast.success('Cover letter generated!')
        },
        onError: (err) => {
          toast.error(err.message || 'Failed to generate cover letter.')
        }
      }
    )
  }

  // Trigger generate referral outreach
  const handleGenerateReferral = () => {
    if (!selectedResumeId || !selectedJobId) return
    generateReferralMutation.mutate(
      {
        resumeId: selectedResumeId,
        jobId: selectedJobId,
        referrerName: referrerName.trim() || undefined,
        platform: outreachPlatform,
        customPrompt: outreachPrompt.trim() || undefined
      },
      {
        onSuccess: (text) => {
          setOutreachText(text)
          toast.success('Referral message drafted!')
        },
        onError: (err) => {
          toast.error(err.message || 'Failed to draft referral message.')
        }
      }
    )
  }

  // Clipboard copy utilities
  const handleCopyText = (text: string, setCopiedFlag: React.Dispatch<React.SetStateAction<boolean>>) => {
    navigator.clipboard.writeText(text)
    setCopiedFlag(true)
    toast.success('Copied to clipboard!')
    setTimeout(() => setCopiedFlag(false), 2000)
  }

  // Map options for Select inputs
  const resumeOptions = resumes.map(r => ({
    value: r._id || r.id || '',
    label: r.title + (r.isDefault ? ' (Default)' : '')
  }))

  const jobOptions = jobs.map(j => ({
    value: j._id || j.id || '',
    label: `${j.title} at ${j.company}`
  }))

  const saveModalFooter = (
    <div className="flex items-center justify-end space-x-2">
      <Button
        type="button"
        variant="default"
        onClick={() => setIsSaveModalOpen(false)}
        disabled={saveTailoredResumeMutation.isPending}
        className="!py-1.5 !px-3 text-xs"
      >
        Cancel
      </Button>
      <Button
        type="submit"
        form="save-tailored-resume-form"
        variant="primary"
        isLoading={saveTailoredResumeMutation.isPending}
        className="!py-1.5 !px-3 text-xs"
      >
        Save Copy
      </Button>
    </div>
  )

  const isSelectionActive = !!selectedResumeId && !!selectedJobId

  return (
    <div className="space-y-6 text-left">
      {/* Page Header */}
      <div className="pb-5 border-b border-slate-200 dark:border-slate-700 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
            <Sparkles className="h-8 w-8 text-violet-600 animate-pulse" />
            AI Copilot Engine
          </h1>
          <p className="text-slate-550 dark:text-slate-400 mt-1">
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
                value={selectedResumeId}
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
                value={selectedJobId}
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
            <span className="text-slate-300 dark:text-slate-650">|</span>
            <span className="flex items-center gap-1">
              <Briefcase className="h-3.5 w-3.5" /> Target: {activeJob.title} ({activeJob.company})
            </span>
          </div>
        )}
      </div>

      {/* Main Feature Container */}
      {!isSelectionActive ? (
        <div className="bg-slate-50 dark:bg-slate-900/40 p-12 text-center rounded-2xl border border-slate-150 dark:border-slate-800 space-y-4 max-w-lg mx-auto">
          <Sparkles className="h-12 w-12 text-slate-300 dark:text-slate-750 mx-auto" />
          <h4 className="font-extrabold text-slate-800 dark:text-slate-200 text-base">Select Your Inputs</h4>
          <p className="text-xs text-slate-450 dark:text-slate-500 leading-relaxed">
            Please pick a resume profile and a target job from the configuration card above to analyze skill gaps, generate cover letters, and tailor your content.
          </p>
        </div>
      ) : (
        <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700 shadow-sm overflow-hidden flex flex-col min-h-[500px]">
          {/* Tabs header */}
          <div className="bg-slate-50/50 dark:bg-slate-900/30 border-b border-slate-150 dark:border-slate-700 px-6 flex overflow-x-auto gap-4">
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
            
            {/* TAB: SKILL GAP ANALYZER */}
            {activeTab === 'skill-gap' && (
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
                  <div className="p-4 bg-red-50 border border-red-200 rounded-xl text-red-750 text-xs flex items-start gap-2.5">
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
                              className="text-slate-150 dark:text-slate-700"
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
                        <span className="text-xxs font-extrabold tracking-wider uppercase text-slate-450 mt-3">Match Score</span>
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
                          <h5 className="text-xs font-bold text-slate-700 dark:text-slate-350 flex items-center gap-1.5">
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
                              <span className="text-xs text-slate-450 italic">No skills overlap identified.</span>
                            )}
                          </div>
                        </div>

                        {/* Missing Skills */}
                        <div className="space-y-2">
                          <h5 className="text-xs font-bold text-slate-700 dark:text-slate-350 flex items-center gap-1.5">
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
                              <span className="text-xs text-slate-450 italic">Perfect matching! No gaps found.</span>
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
                            <li key={i} className="text-xs font-semibold text-slate-600 dark:text-slate-350 flex items-start gap-2">
                              <span className="h-4.5 w-4.5 rounded-full bg-violet-50 dark:bg-violet-950/40 text-violet-650 dark:text-violet-400 font-extrabold flex items-center justify-center text-[10px] flex-shrink-0 mt-0.5">
                                {i + 1}
                              </span>
                              <span>{rec}</span>
                            </li>
                          ))
                        ) : (
                          <span className="text-xs text-slate-450 italic">Everything is in alignment! No adjustments recommended.</span>
                        )}
                      </ul>
                    </div>
                  </div>
                ) : (
                  <div className="py-12 text-center text-slate-400">
                    <Check className="h-10 w-10 mx-auto text-slate-300 mb-2" />
                    <p className="text-xs font-bold">Diagnostics ready to run.</p>
                    <p className="text-xxs text-slate-450 mt-1">Select refresh or configure contexts to begin analysis.</p>
                  </div>
                )}
              </div>
            )}

            {/* TAB: TAILOR RESUME */}
            {activeTab === 'tailor' && (
              <div className="space-y-6 flex-1 flex flex-col">
                <div>
                  <h4 className="font-extrabold text-slate-900 dark:text-white text-base">Optimize CV Keywords with AI</h4>
                  <p className="text-slate-550 dark:text-slate-400 text-xs mt-0.5">
                    Generate customized wording adjustments that target the specific hiring constraints of this role.
                  </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-stretch flex-1">
                  {/* Prompt controls */}
                  <div className="bg-slate-50/50 dark:bg-slate-900/10 p-5 rounded-2xl border border-slate-100 dark:border-slate-700 flex flex-col justify-between space-y-4">
                    <div className="space-y-4">
                      <h5 className="text-xs font-black uppercase tracking-wider text-slate-450">Tailor Parameters</h5>
                      
                      <TextArea
                        label="Special Wording / Focus Directives"
                        placeholder="e.g. Highlight cloud DevOps pipelines, emphasize team leadership scope..."
                        value={tailorPrompt}
                        onChange={(e) => setTailorPrompt(e.target.value)}
                        rows={6}
                        disabled={tailorResumeMutation.isPending}
                      />
                    </div>

                    <Button
                      variant="primary"
                      onClick={handleTailorResume}
                      isLoading={tailorResumeMutation.isPending}
                      disabled={!selectedResumeId || !selectedJobId}
                      className="w-full justify-center"
                      icon={<Sparkles className="h-4.5 w-4.5" />}
                    >
                      Draft Tailored CV
                    </Button>
                  </div>

                  {/* Output viewer */}
                  <div className="lg:col-span-2 flex flex-col space-y-4">
                    {tailoredText ? (
                      <div className="flex-1 flex flex-col space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-black uppercase tracking-wider text-slate-450">Draft Result (Markdown)</span>
                          <div className="flex items-center gap-2">
                            <Button
                              size="sm"
                              variant="secondary"
                              onClick={() => handleCopyText(tailoredText, () => {})}
                              icon={<Copy className="h-3.5 w-3.5" />}
                            >
                              Copy Draft
                            </Button>
                            <Button
                              size="sm"
                              variant="primary"
                              onClick={() => setIsSaveModalOpen(true)}
                              icon={<Save className="h-3.5 w-3.5" />}
                              className="!bg-emerald-600 hover:!bg-emerald-700 dark:!bg-emerald-500 dark:hover:!bg-emerald-600 border-none"
                            >
                              Save as New CV
                            </Button>
                          </div>
                        </div>

                        <TextArea
                          className="font-mono text-xs flex-1 min-h-[300px] bg-slate-900/5 text-slate-800 dark:bg-slate-900/60 dark:text-slate-100"
                          value={tailoredText}
                          onChange={(e) => setTailoredText(e.target.value)}
                          rows={14}
                        />
                        
                        {/* Extracted Metadata Preview */}
                        {(tailoredSkills.length > 0 || tailoredTech.length > 0) && (
                          <div className="p-4 bg-slate-50 dark:bg-slate-900/40 rounded-xl border border-slate-100 dark:border-slate-700 text-xs space-y-2">
                            <span className="font-extrabold text-slate-700 dark:text-slate-300">Parsed Tags to Register:</span>
                            {tailoredSkills.length > 0 && (
                              <div className="flex flex-wrap items-center gap-1 mt-1">
                                <span className="font-semibold text-slate-450 mr-1">Skills:</span>
                                {tailoredSkills.map((s, idx) => <Badge key={idx} variant="offer" className="text-[10px]">{s}</Badge>)}
                              </div>
                            )}
                            {tailoredTech.length > 0 && (
                              <div className="flex flex-wrap items-center gap-1 mt-1">
                                <span className="font-semibold text-slate-450 mr-1">Tech:</span>
                                {tailoredTech.map((t, idx) => <Badge key={idx} variant="interview" className="text-[10px]">{t}</Badge>)}
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    ) : (
                      <div className="flex-1 border border-dashed border-slate-200 dark:border-slate-750 rounded-2xl flex flex-col items-center justify-center text-center p-8 bg-slate-50/20">
                        <FileText className="h-10 w-10 text-slate-300 dark:text-slate-700 mb-2.5" />
                        <span className="text-xs font-bold text-slate-550 dark:text-slate-400">No Custom Draft Created Yet</span>
                        <p className="text-[11px] text-slate-450 dark:text-slate-500 max-w-sm mt-1">
                          Click "Draft Tailored CV" on the left panel to execute keywords alignment and generate updated copy.
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* TAB: COVER LETTER */}
            {activeTab === 'cover-letter' && (
              <div className="space-y-6 flex-1 flex flex-col">
                <div>
                  <h4 className="font-extrabold text-slate-900 dark:text-white text-base">Write Professional Cover Letter</h4>
                  <p className="text-slate-550 dark:text-slate-400 text-xs mt-0.5">
                    Generates a cohesive letter matching your experience metrics to the primary objectives of the employer.
                  </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-stretch flex-1">
                  {/* Inputs */}
                  <div className="bg-slate-50/50 dark:bg-slate-900/10 p-5 rounded-2xl border border-slate-100 dark:border-slate-700 flex flex-col justify-between space-y-4">
                    <div className="space-y-4">
                      <h5 className="text-xs font-black uppercase tracking-wider text-slate-450">Generation Constraints</h5>
                      
                      <TextArea
                        label="Special Tone / Format Instructions"
                        placeholder="e.g. Keep under 300 words, maintain energetic yet highly professional startup vibe..."
                        value={coverLetterPrompt}
                        onChange={(e) => setCoverLetterPrompt(e.target.value)}
                        rows={6}
                        disabled={generateCoverLetterMutation.isPending}
                      />
                    </div>

                    <Button
                      variant="primary"
                      onClick={handleGenerateCoverLetter}
                      isLoading={generateCoverLetterMutation.isPending}
                      disabled={!selectedResumeId || !selectedJobId}
                      className="w-full justify-center"
                      icon={<Send className="h-4.5 w-4.5" />}
                    >
                      Generate Letter
                    </Button>
                  </div>

                  {/* Viewer */}
                  <div className="lg:col-span-2 flex flex-col space-y-4">
                    {coverLetterText ? (
                      <div className="flex-1 flex flex-col space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-black uppercase tracking-wider text-slate-450">Generated Cover Letter</span>
                          <Button
                            size="sm"
                            variant="secondary"
                            onClick={() => handleCopyText(coverLetterText, setCopiedCoverLetter)}
                            icon={copiedCoverLetter ? <Check className="h-3.5 w-3.5 text-emerald-500" /> : <Copy className="h-3.5 w-3.5" />}
                          >
                            {copiedCoverLetter ? 'Copied' : 'Copy'}
                          </Button>
                        </div>
                        <TextArea
                          className="font-sans text-xs flex-1 min-h-[300px] leading-relaxed bg-slate-905/5 dark:bg-slate-900/60"
                          value={coverLetterText}
                          onChange={(e) => setCoverLetterText(e.target.value)}
                          rows={14}
                        />
                      </div>
                    ) : (
                      <div className="flex-1 border border-dashed border-slate-200 dark:border-slate-750 rounded-2xl flex flex-col items-center justify-center text-center p-8 bg-slate-50/20">
                        <Mail className="h-10 w-10 text-slate-300 dark:text-slate-700 mb-2.5" />
                        <span className="text-xs font-bold text-slate-550 dark:text-slate-400">No Cover Letter Generated</span>
                        <p className="text-[11px] text-slate-450 dark:text-slate-500 max-w-sm mt-1">
                          Configure specifications on the left to output a personalized application cover letter.
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* TAB: REFERRAL MESSAGE */}
            {activeTab === 'referral' && (
              <div className="space-y-6 flex-1 flex flex-col">
                <div>
                  <h4 className="font-extrabold text-slate-900 dark:text-white text-base">Generate Networking Referral Outreach</h4>
                  <p className="text-slate-550 dark:text-slate-400 text-xs mt-0.5">
                    Draft outreach messages requesting a warm referral from employee contacts.
                  </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-stretch flex-1">
                  {/* Inputs */}
                  <div className="bg-slate-50/50 dark:bg-slate-900/10 p-5 rounded-2xl border border-slate-100 dark:border-slate-700 flex flex-col justify-between space-y-4">
                    <div className="space-y-4">
                      <h5 className="text-xs font-black uppercase tracking-wider text-slate-450">Referrer Context</h5>
                      
                      <Input
                        label="Recipient Name"
                        placeholder="e.g. Sarah Jenkins"
                        value={referrerName}
                        onChange={(e) => setReferrerName(e.target.value)}
                        disabled={generateReferralMutation.isPending}
                      />

                      <Select
                        label="Target Platform"
                        value={outreachPlatform}
                        onChange={(e) => setOutreachPlatform(e.target.value)}
                        options={[
                          { value: 'LinkedIn', label: 'LinkedIn DM' },
                          { value: 'Email', label: 'Direct Email' },
                          { value: 'Cold Message', label: 'Cold Messaging' },
                        ]}
                      />

                      <TextArea
                        label="Contextual Instructions"
                        placeholder="e.g. Mention our mutual connection, mention that we both went to University of Michigan..."
                        value={outreachPrompt}
                        onChange={(e) => setOutreachPrompt(e.target.value)}
                        rows={4}
                        disabled={generateReferralMutation.isPending}
                      />
                    </div>

                    <Button
                      variant="primary"
                      onClick={handleGenerateReferral}
                      isLoading={generateReferralMutation.isPending}
                      disabled={!selectedResumeId || !selectedJobId}
                      className="w-full justify-center"
                      icon={<MessageSquare className="h-4.5 w-4.5" />}
                    >
                      Draft Message
                    </Button>
                  </div>

                  {/* Viewer */}
                  <div className="lg:col-span-2 flex flex-col space-y-4">
                    {outreachText ? (
                      <div className="flex-1 flex flex-col space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-black uppercase tracking-wider text-slate-450 flex items-center gap-1.5">
                            {outreachPlatform === 'LinkedIn' && <Linkedin className="h-4 w-4 text-blue-600" />}
                            {outreachPlatform === 'Email' && <Mail className="h-4 w-4 text-red-500" />}
                            {outreachPlatform === 'Cold Message' && <MessageSquare className="h-4 w-4 text-violet-500" />}
                            Outreach Template ({outreachPlatform})
                          </span>
                          <Button
                            size="sm"
                            variant="secondary"
                            onClick={() => handleCopyText(outreachText, setCopiedOutreach)}
                            icon={copiedOutreach ? <Check className="h-3.5 w-3.5 text-emerald-500" /> : <Copy className="h-3.5 w-3.5" />}
                          >
                            {copiedOutreach ? 'Copied' : 'Copy'}
                          </Button>
                        </div>
                        <TextArea
                          className="font-sans text-xs flex-1 min-h-[300px] leading-relaxed bg-slate-905/5 dark:bg-slate-900/60"
                          value={outreachText}
                          onChange={(e) => setOutreachText(e.target.value)}
                          rows={14}
                        />
                      </div>
                    ) : (
                      <div className="flex-1 border border-dashed border-slate-200 dark:border-slate-750 rounded-2xl flex flex-col items-center justify-center text-center p-8 bg-slate-50/20">
                        <MessageSquare className="h-10 w-10 text-slate-300 dark:text-slate-700 mb-2.5" />
                        <span className="text-xs font-bold text-slate-550 dark:text-slate-400">No Outreach Drafted</span>
                        <p className="text-[11px] text-slate-450 dark:text-slate-500 max-w-sm mt-1">
                          Define your recipient context and click "Draft Message" to create a high-conversion networking pitch.
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

          </div>
        </div>
      )}

      {/* Save Tailored Resume Modal */}
      <Modal
        isOpen={isSaveModalOpen}
        onClose={() => setIsSaveModalOpen(false)}
        title="Save Tailored Resume"
        footer={saveModalFooter}
        variant="default"
      >
        <form id="save-tailored-resume-form" onSubmit={handleSaveTailoredResume} className="space-y-4">
          <Input
            label="Resume Record Title"
            placeholder="e.g. Tailored Resume - AWS role at Acme Corp"
            value={saveTitle}
            onChange={(e) => setSaveTitle(e.target.value)}
            required
            disabled={saveTailoredResumeMutation.isPending}
          />
          <p className="text-slate-450 text-[11px]">
            Saving will register this tailored CV as a new entry in your **Resume Manager**. The parsed skills and technologies identified by the AI will be associated with the new document.
          </p>
        </form>
      </Modal>
    </div>
  )
}
export default AICopilot
