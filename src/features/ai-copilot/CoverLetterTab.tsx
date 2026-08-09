import React, { useState } from 'react'
import { toast } from 'react-hot-toast'
import { Send, Check, Copy, Save, Mail, FileText, RefreshCw, Eye, Download, Trash2 } from 'lucide-react'
import { Button } from '@/components/Button'
import { TextArea } from '@/components/Input'
import { Modal } from '@/components/Modal'
import { DataTable } from '@/components/DataTable'
import { MarkdownPreview } from '@/components/MarkdownPreview'
import { useGenerateCoverLetterMutation } from '@/hooks/useAICopilot'
import {
  useCoverLettersQuery,
  useSaveCoverLetterMutation,
  useDeleteCoverLetterMutation,
} from '@/hooks/useCoverLetters'

interface CoverLetterTabProps {
  selectedResumeId: string
  selectedJobId: string
  jobs: Array<{ _id?: string; id?: string; title: string; company: string }>
  activeJob?: { company: string; title: string }
}

export const CoverLetterTab: React.FC<CoverLetterTabProps> = ({
  selectedResumeId,
  selectedJobId,
  jobs,
  activeJob,
}) => {
  const generateCoverLetterMutation = useGenerateCoverLetterMutation()
  const { data: savedCoverLetters = [], isLoading: isSavedLettersLoading } = useCoverLettersQuery()
  const saveCoverLetterMutation = useSaveCoverLetterMutation()
  const deleteCoverLetterMutation = useDeleteCoverLetterMutation()

  const [coverLetterPrompt, setCoverLetterPrompt] = useState('')
  const [coverLetterText, setCoverLetterText] = useState('')
  const [copiedCoverLetter, setCopiedCoverLetter] = useState(false)
  const [isSaveLetterModalOpen, setIsSaveLetterModalOpen] = useState(false)
  const [saveLetterTitle, setSaveLetterTitle] = useState('')
  const [selectedLetterId, setSelectedLetterId] = useState<string | null>(null)
  const [coverLetterViewMode, setCoverLetterViewMode] = useState<'edit' | 'preview'>('preview')

  const activeCoverLetter = savedCoverLetters.find((c) => (c._id || c.id) === selectedLetterId)

  const handleGenerateCoverLetter = () => {
    if (!selectedResumeId || !selectedJobId) return
    generateCoverLetterMutation.mutate(
      {
        resumeId: selectedResumeId,
        jobId: selectedJobId,
        customPrompt: coverLetterPrompt.trim() || undefined,
      },
      {
        onSuccess: (text) => {
          setCoverLetterText(text)
          setCoverLetterViewMode('preview')
          const companyStr = activeJob ? ` - ${activeJob.company}` : ''
          const roleStr = activeJob ? ` (${activeJob.title})` : ''
          setSaveLetterTitle(`Cover Letter${companyStr}${roleStr}`)
          toast.success('Cover letter generated!')
        },
        onError: (err) => {
          toast.error(err.message || 'Failed to generate cover letter.')
        },
      }
    )
  }

  const handleSaveCoverLetter = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedResumeId || !selectedJobId || !coverLetterText) return

    try {
      await saveCoverLetterMutation.mutateAsync({
        resumeId: selectedResumeId,
        jobId: selectedJobId,
        content: coverLetterText,
        title: saveLetterTitle.trim() || undefined,
      })
      toast.success('Cover letter saved to Manager!')
      setIsSaveLetterModalOpen(false)
    } catch (err) {
      const error = err as Error
      toast.error(error.message || 'Failed to save cover letter.')
    }
  }

  const handleDeleteCoverLetter = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this cover letter?')) return

    try {
      await deleteCoverLetterMutation.mutateAsync(id)
      toast.success('Cover letter deleted.')
      if (selectedLetterId === id) {
        setSelectedLetterId(null)
      }
    } catch (err) {
      const error = err as Error
      toast.error(error.message || 'Failed to delete cover letter.')
    }
  }

  const handleCopyText = (text: string, setCopiedFlag?: (val: boolean) => void) => {
    navigator.clipboard.writeText(text)
    if (setCopiedFlag) {
      setCopiedFlag(true)
      setTimeout(() => setCopiedFlag(false), 2000)
    }
    toast.success('Copied to clipboard!')
  }

  const saveLetterModalFooter = (
    <div className="flex items-center justify-end space-x-2">
      <Button
        type="button"
        variant="default"
        onClick={() => setIsSaveLetterModalOpen(false)}
        disabled={saveCoverLetterMutation.isPending}
        className="!py-1.5 !px-3 text-xs"
      >
        Cancel
      </Button>
      <Button
        type="submit"
        form="save-cover-letter-form"
        variant="primary"
        isLoading={saveCoverLetterMutation.isPending}
        className="!py-1.5 !px-3 text-xs"
      >
        Save Copy
      </Button>
    </div>
  )

  return (
    <div className="space-y-6 flex-1 flex flex-col">
      <div>
        <h4 className="font-extrabold text-slate-900 dark:text-white text-base">Write Professional Cover Letter</h4>
        <p className="text-slate-500 dark:text-slate-400 text-xs mt-0.5">
          Generates a cohesive letter matching your experience metrics to the primary objectives of the employer.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-stretch flex-1">
        {/* Inputs */}
        <div className="bg-slate-50/50 dark:bg-slate-900/10 p-5 rounded-2xl border border-slate-100 dark:border-slate-700 flex flex-col justify-between space-y-4">
          <div className="space-y-4">
            <h5 className="text-xs font-black uppercase tracking-wider text-slate-400">Generation Constraints</h5>

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
              <div className="flex items-center justify-between gap-4 flex-wrap">
                <div className="flex items-center gap-3">
                  <span className="text-xs font-black uppercase tracking-wider text-slate-400">Generated Letter</span>
                  <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-700/50 p-0.5 rounded-lg border border-slate-200/50 dark:border-slate-700">
                    <button
                      type="button"
                      onClick={() => setCoverLetterViewMode('preview')}
                      className={`px-2.5 py-0.5 text-[10px] font-bold rounded-md transition duration-150 cursor-pointer ${
                        coverLetterViewMode === 'preview'
                          ? 'bg-white dark:bg-slate-800 text-violet-600 dark:text-violet-400 shadow-sm'
                          : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-300'
                      }`}
                    >
                      Preview
                    </button>
                    <button
                      type="button"
                      onClick={() => setCoverLetterViewMode('edit')}
                      className={`px-2.5 py-0.5 text-[10px] font-bold rounded-md transition duration-150 cursor-pointer ${
                        coverLetterViewMode === 'edit'
                          ? 'bg-white dark:bg-slate-800 text-violet-600 dark:text-violet-400 shadow-sm'
                          : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-300'
                      }`}
                    >
                      Edit Source
                    </button>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    size="sm"
                    variant="secondary"
                    onClick={() => handleCopyText(coverLetterText, setCopiedCoverLetter)}
                    icon={copiedCoverLetter ? <Check className="h-3.5 w-3.5 text-emerald-500" /> : <Copy className="h-3.5 w-3.5" />}
                  >
                    {copiedCoverLetter ? 'Copied' : 'Copy'}
                  </Button>
                  <Button
                    size="sm"
                    variant="primary"
                    onClick={() => setIsSaveLetterModalOpen(true)}
                    icon={<Save className="h-3.5 w-3.5" />}
                    className="!bg-emerald-600 hover:!bg-emerald-700 dark:!bg-emerald-500 dark:hover:!bg-emerald-600 border-none"
                  >
                    Save to Manager
                  </Button>
                </div>
              </div>
              {coverLetterViewMode === 'edit' ? (
                <TextArea
                  className="font-sans text-xs flex-1 min-h-[300px] leading-relaxed bg-slate-900/5 dark:bg-slate-900/60"
                  value={coverLetterText}
                  onChange={(e) => setCoverLetterText(e.target.value)}
                  rows={14}
                />
              ) : (
                <MarkdownPreview content={coverLetterText} className="flex-1 min-h-[300px]" />
              )}
            </div>
          ) : (
            <div className="flex-1 border border-dashed border-slate-200 dark:border-slate-700 rounded-2xl flex flex-col items-center justify-center text-center p-8 bg-slate-50/20">
              <Mail className="h-10 w-10 text-slate-300 dark:text-slate-700 mb-2.5" />
              <span className="text-xs font-bold text-slate-500 dark:text-slate-400">No Cover Letter Generated</span>
              <p className="text-[11px] text-slate-400 dark:text-slate-500 max-w-sm mt-1">
                Configure specifications on the left to output a personalized application cover letter.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Saved Cover Letters Section */}
      <div className="border-t border-slate-200 dark:border-slate-700 pt-8 space-y-4">
        <div className="pb-2 text-left">
          <h3 className="text-lg font-bold text-slate-950 dark:text-white flex items-center">
            <FileText className="mr-2 h-5 w-5 text-violet-600" />
            Saved Cover Letters
          </h3>
          <p className="text-slate-500 dark:text-slate-400 text-xs mt-0.5">
            Review, inspect, or delete your saved cover letters generated by the AI Copilot.
          </p>
        </div>

        {isSavedLettersLoading ? (
          <div className="py-8 flex flex-col items-center justify-center space-y-2">
            <RefreshCw className="animate-spin h-6 w-6 text-violet-600" />
            <p className="text-[11px] text-slate-500 font-semibold">Retrieving cover letters...</p>
          </div>
        ) : savedCoverLetters.length === 0 ? (
          <div className="py-8 text-center text-slate-400 dark:text-slate-500 border border-dashed border-slate-200 dark:border-slate-700 rounded-2xl bg-slate-50/20">
            <Mail className="h-8 w-8 mx-auto text-slate-300 dark:text-slate-700 mb-2" />
            <p className="text-xs font-bold">No saved cover letters</p>
            <p className="text-xxs text-slate-400 mt-1">Generate a cover letter above and save it to the manager.</p>
          </div>
        ) : (
          <DataTable
            columns={[
              {
                header: 'Document Title',
                accessor: (row) => (
                  <button
                    onClick={() => setSelectedLetterId(row._id || row.id)}
                    className="text-left font-bold text-violet-650 hover:text-violet-500 hover:underline dark:text-violet-400 focus:outline-none cursor-pointer flex items-center"
                  >
                    <FileText className="mr-2 h-4 w-4 opacity-80" />
                    {row.title}
                  </button>
                ),
                sortable: true,
                sortKey: 'title',
              },
              {
                header: 'Target Job Context',
                accessor: (row) => {
                  const job = jobs.find((j) => (j._id || j.id) === row.jobId)
                  return job ? (
                    <span className="font-semibold text-slate-700 dark:text-slate-300">
                      {job.title} at {job.company}
                    </span>
                  ) : (
                    <span className="text-slate-400 italic">Unknown Job context</span>
                  )
                },
              },
              {
                header: 'Date Saved',
                accessor: (row) => (
                  <span className="text-slate-500 dark:text-slate-400 text-xs font-semibold">
                    {new Date(row.createdAt).toLocaleDateString(undefined, {
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric',
                    })}
                  </span>
                ),
                sortable: true,
                sortKey: 'createdAt',
              },
              {
                header: 'Actions',
                accessor: (row) => (
                  <div className="flex items-center space-x-2">
                    <Button
                      variant="default"
                      size="sm"
                      onClick={() => setSelectedLetterId(row._id || row.id)}
                      className="p-1.5 min-h-0"
                      title="Inspect letter"
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                    <a
                      href={`http://127.0.0.1:5000${row.fileUrl}`}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center p-1.5 bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-200 rounded-lg text-xs font-bold transition select-none disabled:opacity-50"
                      title="Download PDF"
                    >
                      <Download className="h-4 w-4" />
                    </a>
                    <Button
                      variant="danger"
                      size="sm"
                      onClick={() => handleDeleteCoverLetter(row._id || row.id)}
                      disabled={deleteCoverLetterMutation.isPending}
                      className="p-1.5 min-h-0"
                      title="Delete letter"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ),
              },
            ]}
            data={savedCoverLetters}
            pageSize={5}
            searchPlaceholder="Search saved letters..."
            searchKeys={['title']}
          />
        )}
      </div>

      {/* Save Cover Letter Modal */}
      <Modal
        isOpen={isSaveLetterModalOpen}
        onClose={() => setIsSaveLetterModalOpen(false)}
        title="Save Cover Letter"
        footer={saveLetterModalFooter}
        variant="default"
      >
        <form id="save-cover-letter-form" onSubmit={handleSaveCoverLetter} className="space-y-4">
          <input
            type="text"
            className="w-full p-2 border border-slate-200 dark:border-slate-700 rounded-lg text-xs"
            placeholder="e.g. Cover Letter - AWS role at Acme Corp"
            value={saveLetterTitle}
            onChange={(e) => setSaveLetterTitle(e.target.value)}
            required
            disabled={saveCoverLetterMutation.isPending}
          />
          <p className="text-slate-400 text-[11px]">
            Saving will register this cover letter under your saved templates and compile it as a print-optimized PDF document on disk.
          </p>
        </form>
      </Modal>

      {/* Inspect Cover Letter Modal */}
      <Modal
        isOpen={!!selectedLetterId}
        onClose={() => setSelectedLetterId(null)}
        title={activeCoverLetter ? `Inspect Cover Letter: ${activeCoverLetter.title}` : 'Loading...'}
        variant="default"
      >
        {activeCoverLetter ? (
          <div className="space-y-6 text-left">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-700">
              <span className="text-xs text-slate-400 dark:text-slate-400">
                Created: {new Date(activeCoverLetter.createdAt).toLocaleString()}
              </span>
              <a
                href={`http://127.0.0.1:5000${activeCoverLetter.fileUrl}`}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center text-xs font-bold text-violet-650 hover:text-violet-500 hover:underline dark:text-violet-400"
              >
                <Download className="mr-1 h-3.5 w-3.5" /> Download PDF
              </a>
            </div>

            <TextArea
              className="font-sans text-xs flex-1 min-h-[300px] leading-relaxed bg-slate-50 dark:bg-slate-900/60"
              value={activeCoverLetter.content}
              readOnly
              rows={14}
            />

            <div className="pt-4 border-t border-slate-200 dark:border-slate-700 flex justify-end">
              <Button
                variant="secondary"
                onClick={() => handleCopyText(activeCoverLetter.content)}
                icon={<Copy className="h-4 w-4" />}
              >
                Copy Content
              </Button>
            </div>
          </div>
        ) : (
          <p className="text-slate-500 text-center text-sm">Failed to retrieve cover letter details.</p>
        )}
      </Modal>
    </div>
  )
}

export default CoverLetterTab
