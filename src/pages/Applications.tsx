import React, { useState } from 'react'
import { toast } from 'react-hot-toast'
import { 
  KanbanSquare, 
  Plus, 
  Trash2, 
  ExternalLink, 
  Clock, 
  Download, 
  Calendar, 
  Briefcase, 
  FileText, 
  MessageSquare,
  TrendingUp,
  Bookmark
} from 'lucide-react'
import { Button } from '@/components/Button'
import { Input, TextArea } from '@/components/Input'
import { Select } from '@/components/Select'
import { Badge } from '@/components/Badge'
import { Modal } from '@/components/Modal'
import { 
  useApplicationsQuery, 
  useCreateApplicationMutation, 
  useUpdateApplicationStatusMutation, 
  useDeleteApplicationMutation 
} from '@/hooks/useApplications'
import { useJobsQuery } from '@/hooks/useJobs'
import { useResumesQuery } from '@/hooks/useResumes'

const STATUS_COLUMNS = [
  { key: 'saved', label: 'Saved', color: 'border-t-amber-500 text-amber-600 bg-amber-50/50 dark:bg-amber-950/10' },
  { key: 'applied', label: 'Applied', color: 'border-t-blue-500 text-blue-600 bg-blue-50/50 dark:bg-blue-950/10' },
  { key: 'interviewing', label: 'Interviewing', color: 'border-t-purple-500 text-purple-600 bg-purple-50/50 dark:bg-purple-950/10' },
  { key: 'offered', label: 'Offered', color: 'border-t-emerald-500 text-emerald-600 bg-emerald-50/50 dark:bg-emerald-950/10' },
  { key: 'rejected', label: 'Rejected', color: 'border-t-rose-500 text-rose-600 bg-rose-50/50 dark:bg-rose-950/10' },
  { key: 'withdrawn', label: 'Withdrawn', color: 'border-t-slate-400 text-slate-500 bg-slate-50/50 dark:bg-slate-800/10' }
] as const

type AppStatus = typeof STATUS_COLUMNS[number]['key']

export const Applications: React.FC = () => {
  const { data: applications = [], isLoading: isListLoading } = useApplicationsQuery()
  const { data: jobs = [] } = useJobsQuery()
  const { data: resumes = [] } = useResumesQuery()

  const createApplicationMutation = useCreateApplicationMutation()
  const updateStatusMutation = useUpdateApplicationStatusMutation()
  const deleteApplicationMutation = useDeleteApplicationMutation()

  // Modal / Drawer state controls
  const [isAddOpen, setIsAddOpen] = useState(false)
  const [selectedAppId, setSelectedAppId] = useState<string | null>(null)

  // Filter states
  const [searchQuery, setSearchQuery] = useState('')
  const [filterResumeId, setFilterResumeId] = useState('')
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')

  const filteredApplications = applications.filter((app) => {
    const job = app.jobId
    const resume = app.resumeId
    const appTime = new Date(app.appliedAt || app.createdAt).getTime()

    const matchesSearch =
      searchQuery.trim() === '' ||
      job?.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      job?.company?.toLowerCase().includes(searchQuery.toLowerCase())

    const matchesResume =
      filterResumeId === '' ||
      (resume && (resume._id || resume.id) === filterResumeId)

    const matchesStartDate =
      !startDate || appTime >= new Date(startDate + 'T00:00:00').getTime()

    const matchesEndDate =
      !endDate || appTime <= new Date(endDate + 'T23:59:59').getTime()

    return matchesSearch && matchesResume && matchesStartDate && matchesEndDate
  })

  // Filter jobs to exclude those that are already tracked as applications
  const appliedJobIds = new Set(
    applications.map(app => (app.jobId?._id || app.jobId?.id))
  )

  const availableJobs = jobs.filter(
    job => !appliedJobIds.has(job._id || job.id)
  )

  const filteredAvailableJobs = availableJobs.filter((job) => {
    return (
      searchQuery.trim() === '' ||
      job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      job.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (job.location && job.location.toLowerCase().includes(searchQuery.toLowerCase()))
    )
  })

  // Add Application Form fields
  const [jobId, setJobId] = useState('')
  const [resumeId, setResumeId] = useState('')
  const [status, setStatus] = useState<AppStatus>('applied')
  const [appliedAt, setAppliedAt] = useState(new Date().toISOString().split('T')[0])
  const [note, setNote] = useState('')

  // Inspector Drawer notes update
  const [newNote, setNewNote] = useState('')
  const [isAddingNote, setIsAddingNote] = useState(false)

  // Drag and drop states
  const [draggedAppId, setDraggedAppId] = useState<string | null>(null)
  const [activeOverCol, setActiveOverCol] = useState<string | null>(null)

  // Find active application from list
  const activeApp = applications.find(a => (a._id || a.id) === selectedAppId)

  // Add Application submit handler
  const handleAddSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!jobId) {
      toast.error('Please select a target job posting.')
      return
    }

    try {
      await createApplicationMutation.mutateAsync({
        jobId,
        resumeId: resumeId || null,
        status,
        appliedAt: status === 'saved' ? null : (appliedAt ? new Date(appliedAt).toISOString() : null),
        note: note.trim() || null,
      })
      toast.success('Job application tracking registered!')
      setIsAddOpen(false)
      // Reset form
      setJobId('')
      setResumeId('')
      setStatus('applied')
      setAppliedAt(new Date().toISOString().split('T')[0])
      setNote('')
    } catch (err: any) {
      toast.error(err.message || 'Failed to register application.')
    }
  }

  // Drag and drop event handlers
  const handleDragStart = (e: React.DragEvent, id: string) => {
    setDraggedAppId(id)
    e.dataTransfer.setData('text/plain', id)
    e.dataTransfer.effectAllowed = 'move'
  }

  const handleDragEnd = () => {
    setDraggedAppId(null)
    setActiveOverCol(null)
  }

  const handleDragOver = (e: React.DragEvent, colKey: AppStatus) => {
    e.preventDefault()
    if (draggedAppId) {
      setActiveOverCol(colKey)
    }
  }

  const handleDragLeave = () => {
    setActiveOverCol(null)
  }

  const handleDrop = async (e: React.DragEvent, targetStatus: AppStatus) => {
    e.preventDefault()
    const id = e.dataTransfer.getData('text/plain') || draggedAppId
    setDraggedAppId(null)
    setActiveOverCol(null)

    if (!id) return

    // Handle untracked saved jobs dragged from Saved column to another column
    if (id.startsWith('job-')) {
      const targetJobId = id.replace('job-', '')
      try {
        await createApplicationMutation.mutateAsync({
          jobId: targetJobId,
          status: targetStatus,
          appliedAt: targetStatus === 'saved' ? null : new Date().toISOString(),
          note: `Tracked application in ${targetStatus} stage from Saved Jobs`,
        })
        toast.success(`Job application tracked in ${targetStatus} phase!`)
      } catch (err: any) {
        toast.error(err.message || 'Failed to track application.')
      }
      return
    }

    const app = applications.find(a => (a._id || a.id) === id)
    if (!app) return

    // If dropped in the same status column, bypass API
    if (app.status === targetStatus) return

    try {
      await updateStatusMutation.mutateAsync({
        id,
        status: targetStatus,
        note: `Moved application status from ${app.status} to ${targetStatus}`,
      })
      toast.success(`Pipeline updated to ${targetStatus}!`)
    } catch (err: any) {
      toast.error(err.message || 'Failed to update application status.')
    }
  }

  // Update notes/add timeline event in inspector
  const handleAddNoteSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedAppId || !activeApp || !newNote.trim()) return

    setIsAddingNote(true)
    try {
      await updateStatusMutation.mutateAsync({
        id: selectedAppId,
        status: activeApp.status,
        note: newNote.trim(),
      })
      toast.success('Application comment/note updated!')
      setNewNote('')
    } catch (err: any) {
      toast.error(err.message || 'Failed to update note.')
    } finally {
      setIsAddingNote(false)
    }
  }

  // Delete application handler
  const handleDeleteApp = async () => {
    if (!selectedAppId) return
    if (!window.confirm('Are you sure you want to delete this job application tracker?')) return

    try {
      await deleteApplicationMutation.mutateAsync(selectedAppId)
      toast.success('Application tracking removed.')
      setSelectedAppId(null)
    } catch (err: any) {
      toast.error(err.message || 'Failed to remove application.')
    }
  }

  // Modals Header Action elements
  const addApplicationFooter = (
    <div className="flex items-center space-x-2">
      <Button
        type="button"
        variant="default"
        onClick={() => setIsAddOpen(false)}
        disabled={createApplicationMutation.isPending}
        className="!py-1.5 !px-3 text-xs"
      >
        Cancel
      </Button>
      <Button
        type="submit"
        form="add-app-form"
        variant="primary"
        isLoading={createApplicationMutation.isPending}
        className="!py-1.5 !px-3 text-xs"
      >
        Track Application
      </Button>
    </div>
  )

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-5 border-b border-slate-200 dark:border-slate-700 gap-4">
        <div className="text-left">
          <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white flex items-center">
            <KanbanSquare className="mr-2.5 h-8 w-8 text-violet-650" />
            Application Tracker
          </h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1">
            Track saved target jobs, drag cards to update application phases, manage linked CVs, and log notes.
          </p>
        </div>
        <Button
          variant="primary"
          onClick={() => setIsAddOpen(true)}
          className="flex items-center self-start sm:self-auto"
        >
          <Plus className="mr-1.5 h-5 w-5" /> Add Application
        </Button>
      </div>

      {isListLoading ? (
        <div className="py-24 flex flex-col items-center justify-center space-y-3 bg-white dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700 shadow-sm">
          <span className="animate-spin h-8 w-8 text-violet-650 rounded-full border-2 border-violet-100 border-t-violet-650" />
          <p className="text-xs text-slate-500 font-semibold">Retrieving job applications pipeline...</p>
        </div>
      ) : applications.length === 0 && jobs.length === 0 ? (
        <div className="py-20 text-center text-slate-400 dark:text-slate-500 max-w-md mx-auto">
          <Briefcase className="h-12 w-12 mx-auto text-slate-300 mb-3" />
          <h4 className="font-extrabold text-slate-900 dark:text-white text-base">No Applications Tracked Yet</h4>
          <p className="text-xs text-slate-500 mt-1.5 leading-relaxed">
            Choose a target job description and link your customized CV to track pipeline stages and interview schedules.
          </p>
          <Button
            variant="primary"
            size="sm"
            onClick={() => setIsAddOpen(true)}
            className="mt-4"
          >
            Add Your First Application
          </Button>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Filters Bar */}
          <div className="bg-white dark:bg-slate-800 p-4 rounded-2xl border border-slate-100 dark:border-slate-700 shadow-sm flex flex-col lg:flex-row gap-4 items-center justify-between">
            <div className="flex-1 w-full max-w-sm">
              <Input 
                placeholder="Search company or role title..." 
                value={searchQuery} 
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full text-xs font-semibold"
              />
            </div>
            
            <div className="w-full lg:w-auto flex flex-col sm:flex-row gap-4 items-center flex-shrink-0">
              <div className="w-full sm:w-48">
                <Select
                  value={filterResumeId}
                  onChange={(e) => setFilterResumeId(e.target.value)}
                  options={[
                    { value: '', label: 'All Linked Resumes' },
                    ...resumes.map(r => ({ value: r._id || r.id || '', label: r.title }))
                  ]}
                  className="text-xs font-semibold"
                />
              </div>

              <div className="flex items-center space-x-2 w-full sm:w-auto">
                <Input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="text-xs font-semibold w-full sm:w-36"
                  title="Applied start date filter"
                />
                <span className="text-slate-400 text-xs font-bold">to</span>
                <Input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="text-xs font-semibold w-full sm:w-36"
                  title="Applied end date filter"
                />
              </div>

              {(searchQuery || filterResumeId || startDate || endDate) && (
                <Button
                  variant="default"
                  size="sm"
                  onClick={() => {
                    setSearchQuery('')
                    setFilterResumeId('')
                    setStartDate('')
                    setEndDate('')
                  }}
                  className="!py-1.5 !px-2.5 text-xs flex-shrink-0"
                >
                  Clear
                </Button>
              )}
            </div>
          </div>

          {/* Kanban Board Columns Container */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 overflow-x-auto pb-6 select-none">
            {STATUS_COLUMNS.map((col) => {
              const colApps = filteredApplications.filter(a => a.status === col.key)
              const isSavedCol = col.key === 'saved'
              const colAvailableJobs = isSavedCol ? filteredAvailableJobs : []
              const totalCount = colApps.length + colAvailableJobs.length
              const isHovered = activeOverCol === col.key

              return (
                <div 
                  key={col.key} 
                  onDragOver={(e) => handleDragOver(e, col.key)}
                  onDragLeave={handleDragLeave}
                  onDrop={(e) => handleDrop(e, col.key)}
                  className={`bg-slate-50 dark:bg-slate-900/30 p-4 rounded-2xl border-t-4 flex flex-col h-full min-h-[600px] transition-all duration-200 border border-slate-100 dark:border-slate-800/80 ${col.color} ${
                    isHovered 
                      ? 'ring-2 ring-violet-500 border-violet-500 dark:bg-violet-950/10' 
                      : 'shadow-sm'
                  }`}
                >
                  {/* Column Title Header */}
                  <div className="flex items-center justify-between pb-3.5 border-b border-slate-100 dark:border-slate-800/60 mb-4">
                    <span className="text-sm font-extrabold text-slate-800 dark:text-slate-200">
                      {col.label}
                    </span>
                    <Badge variant="applied" className="!py-0.5 !px-2 text-xxs font-extrabold bg-slate-200/60 text-slate-700 dark:bg-slate-800 dark:text-slate-300 border-none">
                      {totalCount}
                    </Badge>
                  </div>

                  {/* Cards stack */}
                  <div className="flex-1 flex flex-col space-y-3.5 overflow-y-auto">
                    {totalCount === 0 ? (
                      <div className="flex-1 flex flex-col items-center justify-center border-2 border-dashed border-slate-200 dark:border-slate-800/80 rounded-2xl p-4 text-center min-h-[120px]">
                        <span className="text-xxs text-slate-400 dark:text-slate-500 font-semibold tracking-wide uppercase">Empty Phase</span>
                      </div>
                    ) : (
                      <>
                        {/* Untracked Saved Jobs (rendered in Saved column) */}
                        {isSavedCol && colAvailableJobs.map((job) => {
                          const jobIdStr = job._id || job.id || ''
                          const dragId = `job-${jobIdStr}`

                          return (
                            <div
                              key={dragId}
                              draggable
                              onDragStart={(e) => handleDragStart(e, dragId)}
                              onDragEnd={handleDragEnd}
                              onClick={() => {
                                setJobId(jobIdStr)
                                setStatus('saved')
                                setIsAddOpen(true)
                              }}
                              className="bg-white dark:bg-slate-800/80 p-3.5 rounded-xl border border-amber-200 dark:border-amber-900/40 shadow-sm cursor-grab active:cursor-grabbing hover:shadow-md hover:border-amber-300 dark:hover:border-amber-700 transition duration-150 text-left flex flex-col justify-between space-y-3.5"
                            >
                              <div>
                                <div className="flex items-center justify-between gap-1">
                                  <span className="text-[10px] font-extrabold text-amber-700 bg-amber-50 dark:bg-amber-950/40 px-2 py-0.5 rounded-lg border border-amber-200 dark:border-amber-900/30 truncate max-w-[120px]">
                                    {job.company || 'Saved Job'}
                                  </span>
                                  <span className="inline-flex items-center text-[10px] font-bold text-amber-600 dark:text-amber-400">
                                    <Bookmark className="w-3 h-3 mr-0.5 fill-amber-400 text-amber-500" /> Saved
                                  </span>
                                </div>
                                <h4 className="text-xs font-bold text-slate-900 dark:text-white mt-2 line-clamp-2 leading-tight">
                                  {job.title}
                                </h4>
                              </div>

                              <div className="pt-2.5 border-t border-slate-100 dark:border-slate-700 flex flex-col space-y-1.5">
                                <div className="flex items-center justify-between text-[10px] text-slate-400 font-semibold">
                                  <span className="flex items-center">
                                    <Briefcase className="mr-1 h-3 w-3" />
                                    {job.location || 'Remote'}
                                  </span>
                                  {job.salary && (
                                    <span className="font-bold text-slate-500 dark:text-slate-300">
                                      {job.salary}
                                    </span>
                                  )}
                                </div>
                                <Button
                                  variant="primary"
                                  size="sm"
                                  onClick={(e) => {
                                    e.stopPropagation()
                                    setJobId(jobIdStr)
                                    setStatus('applied')
                                    setIsAddOpen(true)
                                  }}
                                  className="!py-1 !px-2 text-[10px] w-full mt-1"
                                >
                                  <Plus className="w-3 h-3 mr-1" /> Track Application
                                </Button>
                              </div>
                            </div>
                          )
                        })}

                        {/* Tracked Applications */}
                        {colApps.map((app) => {
                          const id = app._id || app.id || ''
                          const job = app.jobId
                          const resume = app.resumeId

                          return (
                            <div
                              key={id}
                              draggable
                              onDragStart={(e) => handleDragStart(e, id)}
                              onDragEnd={handleDragEnd}
                              onClick={() => setSelectedAppId(id)}
                              className="bg-white dark:bg-slate-800/80 p-3.5 rounded-xl border border-slate-200 dark:border-slate-700/60 shadow-sm cursor-grab active:cursor-grabbing hover:shadow-md hover:border-slate-300 dark:hover:border-slate-600 transition duration-150 text-left flex flex-col justify-between space-y-3.5"
                            >
                              <div>
                                <span className="text-[10px] font-extrabold text-violet-600 bg-violet-50 dark:bg-violet-950/20 px-2 py-0.5 rounded-lg border border-violet-100 dark:border-violet-900/30">
                                  {job?.company || 'Unknown Company'}
                                </span>
                                <h4 className="text-xs font-bold text-slate-900 dark:text-white mt-2 line-clamp-2 leading-tight">
                                  {job?.title || 'Unknown Title'}
                                </h4>
                              </div>

                              <div className="pt-2.5 border-t border-slate-100 dark:border-slate-700 flex flex-col space-y-1.5">
                                {resume && (
                                  <div className="flex items-center text-[10px] text-slate-500 dark:text-slate-400 font-semibold">
                                    <FileText className="mr-1 h-3 w-3 text-purple-400" />
                                    <span className="truncate max-w-[150px]">{resume.title}</span>
                                  </div>
                                )}
                                <div className="flex items-center justify-between text-[10px] text-slate-400 font-semibold">
                                  <span className="flex items-center">
                                    <Calendar className="mr-1 h-3 w-3" />
                                    {app.appliedAt ? new Date(app.appliedAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric' }) : 'Saved'}
                                  </span>
                                  {job?.salary && (
                                    <span className="font-bold text-slate-500 dark:text-slate-300">
                                      {job.salary}
                                    </span>
                                  )}
                                </div>
                              </div>
                            </div>
                          )
                        })}
                      </>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}

      {/* Register Application Drawer */}
      <Modal
        isOpen={isAddOpen}
        onClose={() => setIsAddOpen(false)}
        title="Track Job Application"
        footer={addApplicationFooter}
        variant="default"
      >
        <form id="add-app-form" onSubmit={handleAddSubmit} className="space-y-4 text-left">
          {availableJobs.length === 0 ? (
            <div className="p-4 bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-900/30 text-amber-800 dark:text-amber-300 rounded-xl text-xs flex items-center space-x-2">
              <Clock className="h-5 w-5 flex-shrink-0" />
              <span>
                All registered target jobs are currently tracked in the pipeline. Please create a new target job inside the Job Matches module first.
              </span>
            </div>
          ) : (
            <Select
              label="Select Target Job Description"
              value={jobId}
              onChange={(e) => setJobId(e.target.value)}
              options={[
                { value: '', label: '-- Choose a tracked target job --' },
                ...availableJobs.map(j => ({ value: j._id || j.id || '', label: `${j.title} (${j.company})` }))
              ]}
              required
            />
          )}

          <Select
            label="Linked Resume (Optional)"
            value={resumeId}
            onChange={(e) => setResumeId(e.target.value)}
            options={[
              { value: '', label: '-- Select profile CV (Optional) --' },
              ...resumes.map(r => ({ value: r._id || r.id || '', label: r.title }))
            ]}
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Select
              label="Status Stage"
              value={status}
              onChange={(e) => setStatus(e.target.value as AppStatus)}
              options={STATUS_COLUMNS.map(col => ({ value: col.key, label: col.label }))}
            />
            <Input
              label="Applied Date"
              type="date"
              value={appliedAt}
              onChange={(e) => setAppliedAt(e.target.value)}
            />
          </div>

          <TextArea
            label="Initial Application Comment"
            placeholder="e.g. Applied via LinkedIn Easy Apply. Referral request sent to engineering lead."
            value={note}
            onChange={(e) => setNote(e.target.value)}
            rows={4}
          />
        </form>
      </Modal>

      {/* Application Inspector Drawer */}
      <Modal
        isOpen={!!selectedAppId}
        onClose={() => setSelectedAppId(null)}
        title={activeApp ? `Application: ${activeApp.jobId?.title}` : 'Loading application details...'}
        variant="default"
      >
        {activeApp ? (
          <div className="space-y-6 text-left">
            {/* Top header details */}
            <div className="pb-4.5 border-b border-slate-100 dark:border-slate-700 flex flex-col space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-extrabold text-violet-650 bg-violet-50 dark:bg-violet-950/20 px-2.5 py-0.5 rounded-lg border border-violet-100 dark:border-violet-900/30">
                  {activeApp.jobId?.company}
                </span>
                <Badge variant={activeApp.status === 'offered' ? 'offer' : activeApp.status === 'rejected' ? 'interview' : 'applied'} className="capitalize font-bold">
                  {activeApp.status}
                </Badge>
              </div>

              <div className="flex flex-wrap items-center gap-3 text-xxs font-bold text-slate-500 mt-2">
                {activeApp.jobId?.location && (
                  <span className="flex items-center">
                    <Briefcase className="mr-1 h-3.5 w-3.5" /> {activeApp.jobId.location}
                  </span>
                )}
                {activeApp.jobId?.salary && (
                  <span className="flex items-center">
                    <TrendingUp className="mr-1 h-3.5 w-3.5" /> {activeApp.jobId.salary}
                  </span>
                )}
                <span className="flex items-center">
                  <Calendar className="mr-1 h-3.5 w-3.5" /> {activeApp.appliedAt ? `Applied ${new Date(activeApp.appliedAt).toLocaleDateString()}` : 'Saved'}
                </span>
              </div>

              {activeApp.jobId?.url && (
                <a
                  href={activeApp.jobId.url}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center self-start text-xs font-bold text-violet-650 hover:text-violet-500 hover:underline dark:text-violet-400 mt-1"
                >
                  <ExternalLink className="mr-1 h-3.5 w-3.5" /> View Original Posting
                </a>
              )}
            </div>

            {/* Linked Resume */}
            {activeApp.resumeId ? (
              <div className="p-3 bg-slate-50 dark:bg-slate-900/40 rounded-xl border border-slate-100 dark:border-slate-800/80 flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <FileText className="h-5 w-5 text-violet-650" />
                  <div className="text-left">
                    <p className="text-xs font-bold text-slate-900 dark:text-white leading-tight">
                      Linked Resume
                    </p>
                    <p className="text-[10px] text-slate-400 mt-0.5 leading-none">
                      {activeApp.resumeId.title}
                    </p>
                  </div>
                </div>
                <a
                  href={`http://127.0.0.1:5000${activeApp.resumeId.fileUrl}`}
                  target="_blank"
                  rel="noreferrer"
                  className="p-2 bg-white hover:bg-slate-100 dark:bg-slate-800 dark:hover:bg-slate-700 rounded-lg text-slate-500 dark:text-slate-300 transition"
                  title="Download linked CV"
                >
                  <Download className="h-4 w-4" />
                </a>
              </div>
            ) : (
              <div className="text-xs text-slate-400 italic p-3 bg-slate-50 dark:bg-slate-900/20 rounded-xl text-center">
                No customized resume linked to this application.
              </div>
            )}

            {/* Application Stages Timeline */}
            <div className="space-y-3">
              <h4 className="text-xs font-extrabold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                Pipeline Timeline & Comments
              </h4>
              <div className="space-y-4 max-h-[220px] overflow-y-auto pr-1">
                {activeApp.timeline && activeApp.timeline.length > 0 ? (
                  activeApp.timeline.map((event, idx) => (
                    <div key={idx} className="flex items-start space-x-2.5">
                      <div className="flex-shrink-0 bg-violet-100 dark:bg-violet-950/40 p-1.5 rounded-lg border border-violet-200/50 dark:border-violet-900/30 text-violet-650 mt-0.5">
                        <Clock className="h-3.5 w-3.5" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <span className="text-[11px] font-extrabold text-slate-800 dark:text-slate-200 capitalize">
                            Phase: {event.status}
                          </span>
                          <span className="text-[9px] font-semibold text-slate-400">
                            {new Date(event.updatedAt).toLocaleString(undefined, { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                          </span>
                        </div>
                        <p className="text-xs text-slate-600 dark:text-slate-300 mt-1 leading-relaxed bg-slate-50/50 dark:bg-slate-900/20 p-2 rounded-lg border border-slate-100 dark:border-slate-800/80">
                          {event.note || 'Status updated.'}
                        </p>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-xs text-slate-400 italic">No timeline history recorded.</p>
                )}
              </div>
            </div>

            {/* Note addition update form */}
            <form onSubmit={handleAddNoteSubmit} className="space-y-3 pt-3 border-t border-slate-100 dark:border-slate-700">
              <TextArea
                label="Add Comment / Log Progress"
                placeholder="Log notes about screening, recruiter calls, technical rounds, or schedule updates..."
                value={newNote}
                onChange={(e) => setNewNote(e.target.value)}
                rows={3}
                required
              />
              <div className="flex justify-between items-center">
                <Button
                  type="button"
                  variant="danger"
                  onClick={handleDeleteApp}
                  disabled={deleteApplicationMutation.isPending}
                  className="flex items-center gap-1.5 !py-1.5 !px-3 text-xs"
                >
                  <Trash2 className="h-3.5 w-3.5" /> Delete Application
                </Button>
                <Button
                  type="submit"
                  variant="primary"
                  isLoading={isAddingNote}
                  className="flex items-center gap-1.5 !py-1.5 !px-3 text-xs"
                >
                  <MessageSquare className="h-3.5 w-3.5" /> Add Comment
                </Button>
              </div>
            </form>
          </div>
        ) : (
          <p className="text-slate-500 text-center text-sm">Failed to retrieve application details.</p>
        )}
      </Modal>
    </div>
  )
}
