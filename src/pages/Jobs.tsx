import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-hot-toast'
import { Briefcase, Plus, Trash2, Eye, AlertCircle, FileText, Check, ExternalLink, Edit, Sparkles, Globe, Search, Layers, Calendar, Clock } from 'lucide-react'
import { Button } from '@/components/Button'
import { Input, TextArea } from '@/components/Input'
import { Select } from '@/components/Select'
import { Badge } from '@/components/Badge'
import { Modal } from '@/components/Modal'
import { DataTable } from '@/components/DataTable'
import { ExternalJobSearchFilter } from '@/components/ExternalJobSearchFilter'
import { ExternalJobCard } from '@/components/ExternalJobCard'
import { 
  useJobsQuery, 
  useCreateJobMutation, 
  useUpdateJobMutation,
  useDeleteJobMutation,
  useDeleteJobsBulkMutation, 
  useMatchResumesMutation, 
  useFetchExternalJobsMutation,
} from '@/hooks/useJobs'
import type { Job, MatchResult, ScrapedJobItem, FetchExternalJobsPayload } from '@/hooks/useJobs'

export const Jobs: React.FC = () => {
  const navigate = useNavigate()
  const { data: jobs = [], isLoading: isListLoading } = useJobsQuery()
  const createJobMutation = useCreateJobMutation()
  const updateJobMutation = useUpdateJobMutation()
  const deleteJobMutation = useDeleteJobMutation()
  const deleteJobsBulkMutation = useDeleteJobsBulkMutation()
  const matchResumesMutation = useMatchResumesMutation()
  const fetchExternalJobsMutation = useFetchExternalJobsMutation()

  // Tab State: 'scraper' | 'tracked'
  const [activeTab, setActiveTab] = useState<'scraper' | 'tracked'>('scraper')

  // External Scraper state
  const [scrapedJobs, setScrapedJobs] = useState<ScrapedJobItem[]>([])
  const [hasSearchedExternal, setHasSearchedExternal] = useState(false)

  // Bulk selection state
  const [selectedJobIds, setSelectedJobIds] = useState<string[]>([])

  // State controls for manual intake
  const [isAddOpen, setIsAddOpen] = useState(false)
  const [isEditOpen, setIsEditOpen] = useState(false)
  const [editingJobId, setEditingJobId] = useState<string | null>(null)
  const [selectedJobId, setSelectedJobId] = useState<string | null>(null)
  
  // Add Job Form fields
  const [title, setTitle] = useState('')
  const [company, setCompany] = useState('')
  const [location, setLocation] = useState('')
  const [salary, setSalary] = useState('')
  const [url, setUrl] = useState('')
  const [status, setStatus] = useState<'active' | 'archived' | 'draft'>('active')
  const [description, setDescription] = useState('')

  // Diagnostics modal state
  const [matches, setMatches] = useState<MatchResult[]>([])
  const [selectedMatch, setSelectedMatch] = useState<MatchResult | null>(null)
  const [isMatchingLoading, setIsMatchingLoading] = useState(false)

  // Find active job details from either tracked jobs or scraped jobs list
  const activeJob = jobs.find(j => (j._id || j.id) === selectedJobId) || 
    (scrapedJobs.find(j => j._id === selectedJobId) as unknown as Job | undefined)

  // Automatically fetch matching resumes when selectedJobId changes
  useEffect(() => {
    if (selectedJobId) {
      setIsMatchingLoading(true)
      setSelectedMatch(null)
      setMatches([])
      matchResumesMutation.mutate(selectedJobId, {
        onSuccess: (data) => {
          setMatches(data)
          if (data.length > 0) {
            setSelectedMatch(data[0])
          }
          setIsMatchingLoading(false)
        },
        onError: (err: any) => {
          toast.error(err.message || 'Failed to calculate resume matches.')
          setIsMatchingLoading(false)
        }
      })
    }
  }, [selectedJobId])

  const handleFetchExternalJobs = async (payload: FetchExternalJobsPayload) => {
    try {
      const results = await fetchExternalJobsMutation.mutateAsync(payload)
      setScrapedJobs(results)
      setHasSearchedExternal(true)
      if (results.length > 0) {
        toast.success(`Scraped ${results.length} external job postings!`)
      } else {
        toast('No jobs found matching your search parameters.', { icon: '🔍' })
      }
    } catch (err: any) {
      toast.error('Failed to fetch jobs. Please check search parameters.')
    }
  }

  const handleTailorResume = (jobId: string) => {
    navigate(`/copilot?jobId=${jobId}`)
  }

  const handleMatchResumes = (jobId: string) => {
    setSelectedJobId(jobId)
  }

  const handleAddSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!title.trim() || !company.trim() || !description.trim()) {
      toast.error('Title, Company, and Job Description are required.')
      return
    }

    try {
      await createJobMutation.mutateAsync({
        title: title.trim(),
        company: company.trim(),
        location: location.trim() || undefined,
        salary: salary.trim() || undefined,
        url: url.trim() || undefined,
        status,
        description: description.trim(),
      })
      toast.success('Job details registered and parsed successfully!')
      setIsAddOpen(false)
      // Reset form
      setTitle('')
      setCompany('')
      setLocation('')
      setSalary('')
      setUrl('')
      setStatus('active')
      setDescription('')
    } catch (err: any) {
      toast.error(err.message || 'Failed to register job.')
    }
  }

  const closeAddModal = () => {
    setIsAddOpen(false)
    setTitle('')
    setCompany('')
    setLocation('')
    setSalary('')
    setUrl('')
    setStatus('active')
    setDescription('')
  }

  const closeEditModal = () => {
    setIsEditOpen(false)
    setEditingJobId(null)
    setTitle('')
    setCompany('')
    setLocation('')
    setSalary('')
    setUrl('')
    setStatus('active')
    setDescription('')
  }

  const handleEditClick = (id: string) => {
    const jobToEdit = jobs.find((j) => (j._id || j.id) === id)
    if (jobToEdit) {
      setEditingJobId(id)
      setTitle(jobToEdit.title)
      setCompany(jobToEdit.company)
      setLocation(jobToEdit.location || '')
      setSalary(jobToEdit.salary || '')
      setUrl(jobToEdit.url || '')
      setStatus(jobToEdit.status)
      setDescription(jobToEdit.description)
      setIsEditOpen(true)
    }
  }

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!editingJobId) return

    if (!title.trim() || !company.trim() || !description.trim()) {
      toast.error('Title, Company, and Job Description are required.')
      return
    }

    try {
      await updateJobMutation.mutateAsync({
        id: editingJobId,
        title: title.trim(),
        company: company.trim(),
        location: location.trim() || undefined,
        salary: salary.trim() || undefined,
        url: url.trim() || undefined,
        status,
        description: description.trim(),
      })
      toast.success('Job details updated successfully!')
      closeEditModal()
    } catch (err: any) {
      toast.error(err.message || 'Failed to update job details.')
    }
  }

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this job description entry?')) return

    try {
      await deleteJobMutation.mutateAsync(id)
      toast.success('Job description tracking removed.')
      if (selectedJobId === id) {
        setSelectedJobId(null)
      }
    } catch (err: any) {
      toast.error(err.message || 'Failed to delete job.')
    }
  }

  const handleBulkDeleteJobs = async (selectedIds: string[], clearSelection: () => void) => {
    if (!window.confirm(`Are you sure you want to delete ${selectedIds.length} selected job description(s)?`)) return

    try {
      await deleteJobsBulkMutation.mutateAsync(selectedIds)
      toast.success(`${selectedIds.length} job(s) deleted successfully.`)
      clearSelection()
      if (selectedJobId && selectedIds.includes(selectedJobId)) {
        setSelectedJobId(null)
      }
    } catch (err: any) {
      toast.error(err.message || 'Failed to delete selected jobs.')
    }
  }

  // DataTable columns for tracked jobs
  const columns = [
    {
      header: 'Job Title & Company',
      accessor: (row: Job) => (
        <div className="text-left">
          <div className="font-bold text-slate-900 dark:text-white flex items-center">
            <Briefcase className="mr-1.5 h-4 w-4 text-violet-650 opacity-70" />
            {row.title}
          </div>
          <div className="text-slate-500 dark:text-slate-400 text-xs font-semibold mt-0.5">{row.company}</div>
        </div>
      ),
      sortable: true,
      sortKey: 'title' as keyof Job
    },
    {
      header: 'Location',
      accessor: (row: Job) => (
        <span className="text-slate-600 dark:text-slate-300 text-xs font-bold">
          {row.location || 'Remote'}
        </span>
      ),
      sortable: true,
      sortKey: 'location' as keyof Job
    },
    {
      header: 'Salary Range',
      accessor: (row: Job) => (
        <span className="text-slate-600 dark:text-slate-300 text-xs font-semibold">
          {row.salary || 'Not specified'}
        </span>
      )
    },
    {
      header: 'Status',
      accessor: (row: Job) => {
        const variants = {
          active: 'offer' as const,
          draft: 'applied' as const,
          archived: 'interview' as const,
        }
        return (
          <Badge variant={variants[row.status] || 'applied'} className="capitalize">
            {row.status}
          </Badge>
        )
      }
    },
    {
      header: 'Posted Date & Time',
      accessor: (row: Job) => {
        const rawDate = row.postedAt || row.createdAt
        if (!rawDate) return <span className="text-slate-400 text-xs font-medium">N/A</span>

        const dateObj = new Date(rawDate)
        const isValidDate = !isNaN(dateObj.getTime())

        if (!isValidDate) {
          return (
            <div className="text-left">
              <span className="text-slate-700 dark:text-slate-300 text-xs font-semibold flex items-center gap-1">
                <Clock className="h-3.5 w-3.5 text-slate-400" />
                {String(rawDate)}
              </span>
            </div>
          )
        }

        const formattedDate = dateObj.toLocaleDateString('en-US', {
          month: 'short',
          day: 'numeric',
          year: 'numeric',
        })
        const formattedTime = dateObj.toLocaleTimeString('en-US', {
          hour: '2-digit',
          minute: '2-digit',
          hour12: true,
        })

        return (
          <div className="text-left flex flex-col whitespace-nowrap">
            <span className="text-slate-800 dark:text-slate-200 text-xs font-bold flex items-center gap-1">
              <Calendar className="h-3.5 w-3.5 text-violet-650 opacity-80" />
              {formattedDate}
            </span>
            <span className="text-slate-500 dark:text-slate-400 text-[11px] font-semibold flex items-center gap-1 mt-0.5">
              <Clock className="h-3 w-3 text-slate-400 opacity-75" />
              {formattedTime}
            </span>
          </div>
        )
      },
      sortable: true,
      sortKey: 'createdAt' as keyof Job
    },
    {
      header: 'Actions',
      accessor: (row: Job) => (
        <div className="flex items-center space-x-2">
          <Button
            variant="primary"
            size="sm"
            onClick={() => setSelectedJobId(row._id || row.id || null)}
            className="!py-1.5 !px-3 text-xs flex items-center gap-1"
            title="Inspect matches"
          >
            <Eye className="h-3.5 w-3.5" /> Match Diagnostics
          </Button>
          <Button
            variant="secondary"
            size="sm"
            onClick={() => handleEditClick(row._id || row.id || '')}
            className="p-1.5 min-h-0"
            title="Edit job details"
          >
            <Edit className="h-3.5 w-3.5" />
          </Button>
          <Button
            variant="danger"
            size="sm"
            onClick={() => handleDelete(row._id || row.id || '')}
            disabled={deleteJobMutation.isPending}
            className="p-1.5 min-h-0"
            title="Delete job description"
          >
            <Trash2 className="h-3.5 w-3.5" />
          </Button>
        </div>
      )
    }
  ]

  const addJobFooter = (
    <div className="flex items-center space-x-2">
      <Button
        type="button"
        variant="default"
        onClick={closeAddModal}
        disabled={createJobMutation.isPending}
        className="!py-1.5 !px-3 text-xs"
      >
        Cancel
      </Button>
      <Button
        type="submit"
        form="add-job-form"
        variant="primary"
        isLoading={createJobMutation.isPending}
        className="!py-1.5 !px-3 text-xs"
      >
        Parse & Save
      </Button>
    </div>
  )

  const editJobFooter = (
    <div className="flex items-center space-x-2">
      <Button
        type="button"
        variant="default"
        onClick={closeEditModal}
        disabled={updateJobMutation.isPending}
        className="!py-1.5 !px-3 text-xs"
      >
        Cancel
      </Button>
      <Button
        type="submit"
        form="edit-job-form"
        variant="primary"
        isLoading={updateJobMutation.isPending}
        className="!py-1.5 !px-3 text-xs"
      >
        Update Job
      </Button>
    </div>
  )

  return (
    <div className="space-y-6">
      {/* Header & Page Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-5 border-b border-slate-200 dark:border-slate-700 gap-4">
        <div className="text-left">
          <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white">Job Discovery & Diagnostics</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1">
            Search live job postings from LinkedIn & Indeed or manage target job requirements for AI resume tailoring and match scoring.
          </p>
        </div>
        <Button
          variant="primary"
          onClick={() => setIsAddOpen(true)}
          className="flex items-center self-start sm:self-auto"
        >
          <Plus className="mr-1.5 h-5 w-5" /> Add Target Job
        </Button>
      </div>

      {/* Navigation Tabs */}
      <div className="flex items-center border-b border-slate-200 dark:border-slate-700 gap-4">
        <button
          onClick={() => setActiveTab('scraper')}
          className={`pb-3 text-sm font-extrabold flex items-center gap-2 transition border-b-2 ${
            activeTab === 'scraper'
              ? 'border-violet-650 text-violet-650 dark:text-violet-400'
              : 'border-transparent text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200'
          }`}
        >
          <Globe className="h-4 w-4" /> Live Portal Job Scraper
        </button>

        <button
          onClick={() => setActiveTab('tracked')}
          className={`pb-3 text-sm font-extrabold flex items-center gap-2 transition border-b-2 ${
            activeTab === 'tracked'
              ? 'border-violet-650 text-violet-650 dark:text-violet-400'
              : 'border-transparent text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200'
          }`}
        >
          <Layers className="h-4 w-4" /> Tracked Target Jobs ({jobs.length})
        </button>
      </div>

      {/* Tab 1: Live Portal Job Scraper */}
      {activeTab === 'scraper' && (
        <div className="space-y-6">
          <ExternalJobSearchFilter
            onSearch={handleFetchExternalJobs}
            isLoading={fetchExternalJobsMutation.isPending}
          />

          {/* Skeleton Loader during Scraping */}
          {fetchExternalJobsMutation.isPending && (
            <div className="space-y-4">
              <div className="p-4 bg-violet-50/50 dark:bg-violet-950/20 border border-violet-100 dark:border-violet-900/40 rounded-2xl flex items-center justify-between text-left">
                <div className="flex items-center gap-3">
                  <span className="animate-spin h-6 w-6 text-violet-650 rounded-full border-2 border-violet-200 border-t-violet-650" />
                  <div>
                    <h4 className="text-sm font-bold text-slate-900 dark:text-white">Scraping External Job Portals...</h4>
                    <p className="text-xs text-slate-500">Connecting to Apify actors. This typically takes 3 to 10 seconds.</p>
                  </div>
                </div>
              </div>

              {/* Skeleton cards grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[1, 2, 3, 4].map((n) => (
                  <div key={n} className="bg-white dark:bg-slate-800 p-5 rounded-2xl border border-slate-200 dark:border-slate-700 animate-pulse space-y-4">
                    <div className="h-5 bg-slate-200 dark:bg-slate-700 rounded w-3/4" />
                    <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-1/2" />
                    <div className="flex gap-2">
                      <div className="h-6 bg-slate-200 dark:bg-slate-700 rounded-full w-16" />
                      <div className="h-6 bg-slate-200 dark:bg-slate-700 rounded-full w-20" />
                    </div>
                    <div className="h-12 bg-slate-100 dark:bg-slate-700/50 rounded-xl" />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Results Grid */}
          {!fetchExternalJobsMutation.isPending && hasSearchedExternal && (
            <div className="space-y-4">
              <div className="flex items-center justify-between text-left">
                <h3 className="text-sm font-extrabold text-slate-700 dark:text-slate-300">
                  Scraped Job Postings ({scrapedJobs.length})
                </h3>
              </div>

              {scrapedJobs.length === 0 ? (
                <div className="py-16 text-center text-slate-400 dark:text-slate-500 bg-white dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700 p-6">
                  <Search className="h-12 w-12 mx-auto text-slate-300 mb-3" />
                  <h4 className="font-extrabold text-slate-900 dark:text-white text-base">No Matching Jobs Found</h4>
                  <p className="text-xs text-slate-500 mt-1.5 max-w-sm mx-auto">
                    Try adjusting your job title keywords or location filters above to retrieve active postings.
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {scrapedJobs.map((job) => (
                    <ExternalJobCard
                      key={job._id}
                      job={job}
                      onMatchResumes={handleMatchResumes}
                      onTailorResume={handleTailorResume}
                    />
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Initial Onboarding Banner */}
          {!fetchExternalJobsMutation.isPending && !hasSearchedExternal && (
            <div className="bg-gradient-to-r from-violet-500/10 via-purple-500/10 to-indigo-500/10 dark:from-violet-950/30 dark:via-purple-950/30 dark:to-indigo-950/30 p-8 rounded-2xl border border-violet-100 dark:border-violet-800/40 text-center space-y-3">
              <Globe className="h-10 w-10 text-violet-650 mx-auto opacity-80" />
              <h3 className="text-base font-extrabold text-slate-900 dark:text-white">Ready to Scrape External Jobs</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 max-w-md mx-auto leading-relaxed">
                Enter your target job title in the search filter above to fetch live job postings from LinkedIn & Indeed. Scraped jobs will automatically include extracted skills, Easy Apply tags, and AI insights.
              </p>
            </div>
          )}
        </div>
      )}

      {/* Tab 2: Tracked Target Jobs */}
      {activeTab === 'tracked' && (
        <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-100 dark:border-slate-700 shadow-sm">
          {isListLoading ? (
            <div className="py-16 flex flex-col items-center justify-center space-y-3">
              <span className="animate-spin h-8 w-8 text-violet-650 rounded-full border-2 border-violet-100 border-t-violet-650" />
              <p className="text-xs text-slate-500 font-semibold">Retrieving tracked jobs...</p>
            </div>
          ) : jobs.length === 0 ? (
            <div className="py-16 text-center text-slate-400 dark:text-slate-500 max-w-md mx-auto">
              <Briefcase className="h-12 w-12 mx-auto text-slate-300 mb-3" />
              <h4 className="font-extrabold text-slate-900 dark:text-white text-base">No Jobs Tracked Yet</h4>
              <p className="text-xs text-slate-500 mt-1.5 leading-relaxed">
                Register job description requirements to compare keywords, calculate compatibility scores, and optimize your application targets.
              </p>
              <Button
                variant="primary"
                size="sm"
                onClick={() => setIsAddOpen(true)}
                className="mt-4"
              >
                Add Your First Job
              </Button>
            </div>
          ) : (
            <DataTable
              columns={columns}
              data={jobs}
              pageSize={10}
              searchPlaceholder="Search jobs, companies, or dates..."
              searchKeys={['title', 'company', 'location', 'postedAt', 'createdAt']}
              selectable
              selectedIds={selectedJobIds}
              onSelectionChange={setSelectedJobIds}
              getRowId={(row) => row._id || row.id || ''}
              renderBulkActions={(selectedIds, clearSelection) => (
                <Button
                  variant="danger"
                  size="sm"
                  isLoading={deleteJobsBulkMutation.isPending}
                  onClick={() => handleBulkDeleteJobs(selectedIds, clearSelection)}
                  className="flex items-center gap-1.5 px-3 py-2 text-xs font-bold"
                >
                  <Trash2 className="h-4 w-4" /> Delete Selected ({selectedIds.length})
                </Button>
              )}
            />
          )}
        </div>
      )}

      {/* Add Job Modal */}
      <Modal
        isOpen={isAddOpen}
        onClose={closeAddModal}
        title="Add Job Description"
        footer={addJobFooter}
        variant="default"
      >
        <form id="add-job-form" onSubmit={handleAddSubmit} className="space-y-4 text-left">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Job Role Title"
              placeholder="e.g. Senior Frontend Engineer"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
            <Input
              label="Company Name"
              placeholder="e.g. Acme Corporation"
              value={company}
              onChange={(e) => setCompany(e.target.value)}
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Input
              label="Location"
              placeholder="e.g. Remote / San Francisco, CA"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
            />
            <Input
              label="Salary Budget"
              placeholder="e.g. $120k - $150k"
              value={salary}
              onChange={(e) => setSalary(e.target.value)}
            />
            <Select
              label="Status"
              value={status}
              onChange={(e) => setStatus(e.target.value as any)}
              options={[
                { value: 'active', label: 'Active' },
                { value: 'draft', label: 'Draft' },
                { value: 'archived', label: 'Archived' },
              ]}
            />
          </div>

          <Input
            label="Job Posting URL"
            placeholder="e.g. https://linkedin.com/jobs/view/..."
            value={url}
            onChange={(e) => setUrl(e.target.value)}
          />

          <TextArea
            label="Job Description Details"
            placeholder="Paste the full job requirements, skills, and responsibility details here..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={6}
            required
          />
        </form>
      </Modal>

      {/* Edit Job Modal */}
      <Modal
        isOpen={isEditOpen}
        onClose={closeEditModal}
        title="Edit Job Description"
        footer={editJobFooter}
        variant="default"
      >
        <form id="edit-job-form" onSubmit={handleEditSubmit} className="space-y-4 text-left">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Job Role Title"
              placeholder="e.g. Senior Frontend Engineer"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
            <Input
              label="Company Name"
              placeholder="e.g. Acme Corporation"
              value={company}
              onChange={(e) => setCompany(e.target.value)}
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Input
              label="Location"
              placeholder="e.g. Remote / San Francisco, CA"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
            />
            <Input
              label="Salary Budget"
              placeholder="e.g. $120k - $150k"
              value={salary}
              onChange={(e) => setSalary(e.target.value)}
            />
            <Select
              label="Status"
              value={status}
              onChange={(e) => setStatus(e.target.value as any)}
              options={[
                { value: 'active', label: 'Active' },
                { value: 'draft', label: 'Draft' },
                { value: 'archived', label: 'Archived' },
              ]}
            />
          </div>

          <Input
            label="Job Posting URL"
            placeholder="e.g. https://linkedin.com/jobs/view/..."
            value={url}
            onChange={(e) => setUrl(e.target.value)}
          />

          <TextArea
            label="Job Description Details"
            placeholder="Paste the full job requirements, skills, and responsibility details here..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={6}
            required
          />
        </form>
      </Modal>

      {/* Match Diagnostics Inspector Modal */}
      <Modal
        isOpen={!!selectedJobId}
        onClose={() => setSelectedJobId(null)}
        title={activeJob ? `Match Diagnostics: ${activeJob.title} (${activeJob.company})` : 'Calculating Match Metrics...'}
        variant="default"
      >
        {isMatchingLoading ? (
          <div className="py-16 flex flex-col items-center justify-center space-y-3">
            <span className="animate-spin h-8 w-8 text-violet-650 rounded-full border-2 border-violet-100 border-t-violet-650" />
            <p className="text-xs text-slate-500 font-semibold">Running Match Heuristics...</p>
          </div>
        ) : activeJob && matches.length === 0 ? (
          <div className="py-8 text-center space-y-3">
            <AlertCircle className="h-8 w-8 text-slate-400 mx-auto" />
            <p className="text-sm text-slate-500 font-semibold">No resumes registered to test compatibility.</p>
            <p className="text-xs text-slate-400">Please upload a resume in Resume Manager first.</p>
            <Button onClick={() => setSelectedJobId(null)} variant="default">
              Close Diagnostics
            </Button>
          </div>
        ) : activeJob && selectedMatch ? (
          <div className="space-y-6 text-left">
            {/* Top overview summary */}
            {activeJob.url && (
              <div className="pb-3 border-b border-slate-100 dark:border-slate-700 flex justify-between items-center">
                <span className="text-xs text-slate-500">Requirements parsed successfully</span>
                <a
                  href={activeJob.url}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center text-xs font-bold text-violet-650 hover:text-violet-500 hover:underline dark:text-violet-400"
                >
                  <ExternalLink className="mr-1 h-3.5 w-3.5" /> View Posting
                </a>
              </div>
            )}

            {/* Resume Selection Cards Grid */}
            <div className="space-y-2">
              <h4 className="text-xs font-extrabold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                Select Tested Resume
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {matches.map((item) => {
                  const isSelected = selectedMatch.resumeId === item.resumeId
                  const isRecommended = item.score >= 80

                  return (
                    <button
                      key={item.resumeId}
                      onClick={() => setSelectedMatch(item)}
                      className={`p-3.5 rounded-xl border text-left flex flex-col justify-between transition cursor-pointer select-none ${
                        isSelected 
                          ? 'border-violet-500 bg-violet-50/20 dark:bg-violet-950/20 ring-1 ring-violet-500' 
                          : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:bg-slate-50/50 dark:hover:bg-slate-700/30'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <span className="text-xs font-bold text-slate-900 dark:text-white line-clamp-1">
                          {item.resumeTitle}
                        </span>
                        <Badge variant={isRecommended ? 'offer' : 'applied'} className="!py-0.5 !px-1.5 text-xxs flex-shrink-0">
                          {item.score}%
                        </Badge>
                      </div>

                      <div className="mt-2.5 flex items-center justify-between">
                        <span className="text-[10px] text-slate-400 dark:text-slate-400 font-semibold">
                          Recommendation:
                        </span>
                        <span className={`text-[10px] font-extrabold ${isRecommended ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-500'}`}>
                          {item.recommendationStatus === 'RECOMMENDED' ? 'Recommended' : 'Review Fit'}
                        </span>
                      </div>
                    </button>
                  )
                })}
              </div>
            </div>

            {/* Keyword Match Diagnostics Details */}
            <div className="bg-slate-50 dark:bg-slate-900/40 p-4.5 rounded-2xl border border-slate-100 dark:border-slate-700 space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-900 dark:text-white flex items-center">
                  <FileText className="mr-1.5 h-4.5 w-4.5 text-violet-650 opacity-85" />
                  Score Diagnostics: {selectedMatch.resumeTitle}
                </span>
                <Badge variant={selectedMatch.score >= 80 ? 'offer' : 'applied'}>
                  {selectedMatch.score}% Match Rate
                </Badge>
              </div>

              {/* Matched Skills */}
              <div className="space-y-1.5">
                <h5 className="text-xxs font-extrabold text-slate-500 dark:text-slate-400 uppercase tracking-wider flex items-center">
                  <Check className="mr-1 h-3.5 w-3.5 text-emerald-500" /> Matched Skills ({selectedMatch.matchedSkills.length})
                </h5>
                <div className="flex flex-wrap gap-1">
                  {selectedMatch.matchedSkills.length > 0 ? (
                    selectedMatch.matchedSkills.map((skill, idx) => (
                      <Badge key={idx} variant="offer" className="!text-[10px] !py-0.5 !px-2">
                        {skill}
                      </Badge>
                    ))
                  ) : (
                    <span className="text-xs text-slate-400 italic">No skills matched.</span>
                  )}
                </div>
              </div>

              {/* Missing Skills */}
              <div className="space-y-1.5">
                <h5 className="text-xxs font-extrabold text-slate-500 dark:text-slate-400 uppercase tracking-wider flex items-center">
                  <AlertCircle className="mr-1 h-3.5 w-3.5 text-slate-400 dark:text-slate-500" /> Missing Skills ({selectedMatch.missingSkills.length})
                </h5>
                <div className="flex flex-wrap gap-1">
                  {selectedMatch.missingSkills.length > 0 ? (
                    selectedMatch.missingSkills.map((skill, idx) => (
                      <Badge key={idx} variant="interview" className="!text-[10px] !py-0.5 !px-2 bg-slate-100 hover:bg-slate-200 text-slate-600 dark:bg-slate-800 dark:hover:bg-slate-700 dark:text-slate-300 border-none">
                        {skill}
                      </Badge>
                    ))
                  ) : (
                    <span className="text-xs text-slate-400 italic">No missing skills detected! Perfect match.</span>
                  )}
                </div>
              </div>
            </div>

            {/* AI Action */}
            <div className="pt-4 border-t border-slate-200 dark:border-slate-700 flex justify-end">
              <Button
                variant="primary"
                onClick={() => {
                  navigate(`/copilot?jobId=${selectedJobId}&resumeId=${selectedMatch.resumeId}`)
                }}
                className="flex items-center gap-1.5"
              >
                <Sparkles className="h-4 w-4" /> Open in AI Copilot
              </Button>
            </div>
          </div>
        ) : (
          <p className="text-slate-500 text-center text-sm py-8">Failed to calculate compatibility diagnostics.</p>
        )}
      </Modal>
    </div>
  )
}
