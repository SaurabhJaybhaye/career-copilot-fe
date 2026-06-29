import React, { useState } from 'react'
import { toast } from 'react-hot-toast'
import { FileText, Upload, Trash2, Eye, Award, Cpu, Globe, Download, Check, Loader2 } from 'lucide-react'
import { Button } from '@/components/Button'
import { Input } from '@/components/Input'
import { Badge } from '@/components/Badge'
import { Modal } from '@/components/Modal'
import { DataTable } from '@/components/DataTable'
import { 
  useResumesQuery, 
  useResumeDetailsQuery, 
  useUploadResumeMutation, 
  useUpdateResumeMutation, 
  useDeleteResumeMutation,
} from '@/hooks/useResumes'
import type { Resume } from '@/hooks/useResumes'

export const ResumeBuilder: React.FC = () => {
  const { data: resumes = [], isLoading: isListLoading } = useResumesQuery()
  const uploadResumeMutation = useUploadResumeMutation()
  const updateResumeMutation = useUpdateResumeMutation()
  const deleteResumeMutation = useDeleteResumeMutation()

  const [title, setTitle] = useState('')
  const [file, setFile] = useState<File | null>(null)
  const [selectedResumeId, setSelectedResumeId] = useState<string | null>(null)

  // Details query (enabled when selectedResumeId is set)
  const { data: activeResume, isLoading: isDetailsLoading } = useResumeDetailsQuery(selectedResumeId)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0])
    }
  }

  const handleUploadSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!file) {
      toast.error('Please choose a file to upload.')
      return
    }

    try {
      await uploadResumeMutation.mutateAsync({
        file,
        title: title.trim() || undefined,
      })
      toast.success('Resume uploaded and parsed successfully!')
      setFile(null)
      setTitle('')
      // Clear file input element
      const fileInput = document.getElementById('resume-file-input') as HTMLInputElement
      if (fileInput) fileInput.value = ''
    } catch (err: any) {
      toast.error(err.message || 'Failed to upload and parse resume.')
    }
  }

  const handleMakeDefault = async (id: string) => {
    try {
      await updateResumeMutation.mutateAsync({
        id,
        isDefault: true,
      })
      toast.success('Default resume updated!')
    } catch (err: any) {
      toast.error(err.message || 'Failed to set default resume.')
    }
  }

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this resume?')) return

    try {
      await deleteResumeMutation.mutateAsync(id)
      toast.success('Resume deleted.')
      if (selectedResumeId === id) {
        setSelectedResumeId(null)
      }
    } catch (err: any) {
      toast.error(err.message || 'Failed to delete resume.')
    }
  }

  // DataTable columns definition
  const columns = [
    {
      header: 'Resume Title',
      accessor: (row: Resume) => (
        <button
          onClick={() => setSelectedResumeId(row.id)}
          className="text-left font-bold text-violet-650 hover:text-violet-500 hover:underline dark:text-violet-400 focus:outline-none cursor-pointer flex items-center"
        >
          <FileText className="mr-2 h-4.5 w-4.5 opacity-80" />
          {row.title}
        </button>
      ),
      sortable: true,
      sortKey: 'title' as keyof Resume
    },
    {
      header: 'Upload Date',
      accessor: (row: Resume) => (
        <span className="text-slate-500 dark:text-slate-400 text-xs sm:text-sm font-semibold">
          {new Date(row.createdAt).toLocaleDateString(undefined, {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
          })}
        </span>
      ),
      sortable: true,
      sortKey: 'createdAt' as keyof Resume
    },
    {
      header: 'Status',
      accessor: (row: Resume) => (
        row.isDefault ? (
          <Badge variant="offer" className="flex items-center gap-1 w-fit">
            <Check className="h-3 w-3" /> Default
          </Badge>
        ) : (
          <Button
            variant="default"
            size="sm"
            onClick={() => handleMakeDefault(row.id)}
            disabled={updateResumeMutation.isPending}
            className="!py-1 !px-2.5 text-xs"
          >
            Make Default
          </Button>
        )
      )
    },
    {
      header: 'Actions',
      accessor: (row: Resume) => (
        <div className="flex items-center space-x-2">
          <Button
            variant="default"
            size="sm"
            onClick={() => setSelectedResumeId(row.id)}
            className="p-1.5 min-h-0"
            title="Inspect keywords"
          >
            <Eye className="h-4 w-4" />
          </Button>
          <Button
            variant="danger"
            size="sm"
            onClick={() => handleDelete(row.id)}
            disabled={deleteResumeMutation.isPending}
            className="p-1.5 min-h-0"
            title="Delete resume"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      )
    }
  ]

  return (
    <div className="space-y-6">
      <div className="pb-5 border-b border-slate-200 dark:border-slate-700 text-left">
        <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white">Resume Manager</h1>
        <p className="text-slate-550 dark:text-slate-400 mt-1">
          Upload resumes (PDF/DOCX) to extract core tech stacks, and select which document acts as your default profile target.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Side: Upload Panel */}
        <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-100 dark:border-slate-700 shadow-sm h-fit space-y-4">
          <h3 className="text-lg font-bold text-slate-950 dark:text-white flex items-center">
            <Upload className="mr-2 h-5 w-5 text-violet-550" />
            Upload New Resume
          </h3>
          
          <form onSubmit={handleUploadSubmit} className="space-y-4 text-left">
            <Input
              label="Resume Label/Title"
              placeholder="e.g. Senior React Architect"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              disabled={uploadResumeMutation.isPending}
            />

            <div className="space-y-1.5">
              <label className="block text-sm font-bold text-slate-700 dark:text-slate-200">
                Choose PDF or DOCX File
              </label>
              <div className="border-2 border-dashed border-slate-300 dark:border-slate-600 rounded-xl p-4 bg-slate-50/50 dark:bg-slate-900/10 flex flex-col items-center justify-center text-center">
                <input
                  id="resume-file-input"
                  type="file"
                  accept=".pdf,.docx,.doc"
                  onChange={handleFileChange}
                  disabled={uploadResumeMutation.isPending}
                  className="hidden"
                />
                <label
                  htmlFor="resume-file-input"
                  className="px-4 py-2 bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-650 text-slate-700 dark:text-slate-200 rounded-lg text-xs font-bold cursor-pointer transition select-none disabled:opacity-50"
                >
                  Browse File
                </label>
                <span className="text-xxs text-slate-450 dark:text-slate-400 mt-2 block">
                  {file ? file.name : 'No file selected (max 5MB)'}
                </span>
              </div>
            </div>

            <Button
              type="submit"
              variant="primary"
              className="w-full justify-center"
              isLoading={uploadResumeMutation.isPending}
            >
              Upload & Parse CV
            </Button>
          </form>
        </div>

        {/* Right Side: Resumes List Table */}
        <div className="lg:col-span-2 space-y-4">
          <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-100 dark:border-slate-700 shadow-sm">
            <div className="pb-4 mb-4 border-b border-slate-100 dark:border-slate-700 text-left">
              <h3 className="text-lg font-bold text-slate-950 dark:text-white flex items-center">
                <FileText className="mr-2 h-5 w-5 text-violet-555" />
                Your Stored Resumes
              </h3>
            </div>

            {isListLoading ? (
              <div className="py-12 flex flex-col items-center justify-center space-y-3">
                <Loader2 className="animate-spin h-8 w-8 text-violet-600" />
                <p className="text-xs text-slate-500 font-semibold">Retrieving resumes...</p>
              </div>
            ) : resumes.length === 0 ? (
              <div className="py-12 text-center text-slate-400 dark:text-slate-500">
                <FileText className="h-10 w-10 mx-auto text-slate-300 mb-2" />
                <p className="text-xs font-bold">No resumes registered.</p>
                <p className="text-xxs text-slate-450 mt-1">Upload a resume file to parse your profile data.</p>
              </div>
            ) : (
              <DataTable
                columns={columns}
                data={resumes}
                pageSize={5}
                searchPlaceholder="Search resumes..."
                searchKeys={['title']}
              />
            )}
          </div>
        </div>
      </div>

      {/* Resume Details Inspector Modal */}
      <Modal
        isOpen={!!selectedResumeId}
        onClose={() => setSelectedResumeId(null)}
        title={activeResume ? `Parsed Details: ${activeResume.title}` : 'Loading details...'}
        variant="default"
      >
        {isDetailsLoading ? (
          <div className="py-12 flex flex-col items-center justify-center space-y-3">
            <Loader2 className="animate-spin h-8 w-8 text-violet-600" />
            <p className="text-xs text-slate-500 font-semibold">Analyzing parsed keywords...</p>
          </div>
        ) : activeResume ? (
          <div className="space-y-6 text-left">
            {/* Metadata and file downloader */}
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-700">
              <span className="text-xs text-slate-450 dark:text-slate-400">
                Uploaded: {new Date(activeResume.createdAt).toLocaleString()}
              </span>
              <a
                href={`http://127.0.0.1:5000${activeResume.fileUrl}`}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center text-xs font-bold text-violet-650 hover:text-violet-500 hover:underline dark:text-violet-400"
              >
                <Download className="mr-1 h-3.5 w-3.5" /> Download Document
              </a>
            </div>

            {/* Extracted Core Skills */}
            <div className="space-y-2">
              <h4 className="text-xs font-extrabold text-slate-500 dark:text-slate-400 uppercase tracking-wider flex items-center">
                <Award className="mr-1.5 h-4 w-4 text-emerald-500" /> Core Skills
              </h4>
              <div className="flex flex-wrap gap-1.5">
                {activeResume.skills && activeResume.skills.length > 0 ? (
                  activeResume.skills.map((tag, i) => (
                    <Badge key={i} variant="offer">{tag}</Badge>
                  ))
                ) : (
                  <span className="text-xs text-slate-450 italic">No skills extracted.</span>
                )}
              </div>
            </div>

            {/* Extracted Technologies */}
            <div className="space-y-2">
              <h4 className="text-xs font-extrabold text-slate-500 dark:text-slate-400 uppercase tracking-wider flex items-center">
                <Cpu className="mr-1.5 h-4 w-4 text-purple-500" /> Technologies
              </h4>
              <div className="flex flex-wrap gap-1.5">
                {activeResume.technologies && activeResume.technologies.length > 0 ? (
                  activeResume.technologies.map((tag, i) => (
                    <Badge key={i} variant="interview">{tag}</Badge>
                  ))
                ) : (
                  <span className="text-xs text-slate-450 italic">No tech keywords extracted.</span>
                )}
              </div>
            </div>

            {/* Extracted Domains */}
            <div className="space-y-2">
              <h4 className="text-xs font-extrabold text-slate-500 dark:text-slate-400 uppercase tracking-wider flex items-center">
                <Globe className="mr-1.5 h-4 w-4 text-blue-500" /> Industry Domains
              </h4>
              <div className="flex flex-wrap gap-1.5">
                {activeResume.domains && activeResume.domains.length > 0 ? (
                  activeResume.domains.map((tag, i) => (
                    <Badge key={i} variant="applied">{tag}</Badge>
                  ))
                ) : (
                  <span className="text-xs text-slate-450 italic">No domains extracted.</span>
                )}
              </div>
            </div>

            {/* Modal action triggers */}
            <div className="pt-4 border-t border-slate-100 dark:border-slate-700 flex justify-end">
              <Button onClick={() => setSelectedResumeId(null)} variant="default">
                Close Inspector
              </Button>
            </div>
          </div>
        ) : (
          <p className="text-slate-500 text-center text-sm">Failed to retrieve resume details.</p>
        )}
      </Modal>
    </div>
  )
}
