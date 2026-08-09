import React, { useState } from 'react'
import { toast } from 'react-hot-toast'
import { Sparkles, Copy, Save, FileText } from 'lucide-react'
import { Button } from '@/components/Button'
import { TextArea } from '@/components/Input'
import { Badge } from '@/components/Badge'
import { Modal } from '@/components/Modal'
import { MarkdownPreview } from '@/components/MarkdownPreview'
import { useTailorResumeMutation, useSaveTailoredResumeMutation } from '@/hooks/useAICopilot'

interface TailorResumeTabProps {
  selectedResumeId: string
  selectedJobId: string
  activeJob?: { company: string; title: string }
}

export const TailorResumeTab: React.FC<TailorResumeTabProps> = ({
  selectedResumeId,
  selectedJobId,
  activeJob,
}) => {
  const tailorResumeMutation = useTailorResumeMutation()
  const saveTailoredResumeMutation = useSaveTailoredResumeMutation()

  const [tailorPrompt, setTailorPrompt] = useState('')
  const [tailoredText, setTailoredText] = useState('')
  const [tailoredSkills, setTailoredSkills] = useState<string[]>([])
  const [tailoredTech, setTailoredTech] = useState<string[]>([])
  const [tailoredDomains, setTailoredDomains] = useState<string[]>([])
  const [isSaveModalOpen, setIsSaveModalOpen] = useState(false)
  const [saveTitle, setSaveTitle] = useState('')
  const [tailorViewMode, setTailorViewMode] = useState<'edit' | 'preview'>('preview')

  const handleTailorResume = () => {
    if (!selectedResumeId || !selectedJobId) return
    tailorResumeMutation.mutate(
      {
        resumeId: selectedResumeId,
        jobId: selectedJobId,
        customPrompt: tailorPrompt.trim() || undefined,
      },
      {
        onSuccess: (res) => {
          setTailoredText(res.tailoredContent)
          setTailoredSkills(res.skills || [])
          setTailoredTech(res.technologies || [])
          setTailoredDomains(res.domains || [])
          setTailorViewMode('preview')

          const companyStr = activeJob ? ` - ${activeJob.company}` : ''
          const roleStr = activeJob ? ` (${activeJob.title})` : ''
          setSaveTitle(`Tailored Resume${companyStr}${roleStr}`)

          toast.success('Tailored resume drafted successfully!')
        },
        onError: (err) => {
          toast.error(err.message || 'Failed to tailor resume.')
        },
      }
    )
  }

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
        domains: tailoredDomains,
      })
      toast.success('Tailored resume saved to your Resume Manager!')
      setIsSaveModalOpen(false)
    } catch (err) {
      const error = err as Error
      toast.error(error.message || 'Failed to save tailored resume.')
    }
  }

  const handleCopyText = (text: string) => {
    navigator.clipboard.writeText(text)
    toast.success('Copied to clipboard!')
  }

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

  return (
    <div className="space-y-6 flex-1 flex flex-col">
      <div>
        <h4 className="font-extrabold text-slate-900 dark:text-white text-base">Optimize CV Keywords with AI</h4>
        <p className="text-slate-500 dark:text-slate-400 text-xs mt-0.5">
          Generate customized wording adjustments that target the specific hiring constraints of this role.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-stretch flex-1">
        {/* Prompt controls */}
        <div className="bg-slate-50/50 dark:bg-slate-900/10 p-5 rounded-2xl border border-slate-100 dark:border-slate-700 flex flex-col justify-between space-y-4">
          <div className="space-y-4">
            <h5 className="text-xs font-black uppercase tracking-wider text-slate-400">Tailor Parameters</h5>

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
              <div className="flex items-center justify-between gap-4 flex-wrap">
                <div className="flex items-center gap-3">
                  <span className="text-xs font-black uppercase tracking-wider text-slate-400">Draft Result</span>
                  <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-700/50 p-0.5 rounded-lg border border-slate-200/50 dark:border-slate-700">
                    <button
                      type="button"
                      onClick={() => setTailorViewMode('preview')}
                      className={`px-2.5 py-0.5 text-[10px] font-bold rounded-md transition duration-150 cursor-pointer ${
                        tailorViewMode === 'preview'
                          ? 'bg-white dark:bg-slate-800 text-violet-600 dark:text-violet-400 shadow-sm'
                          : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-300'
                      }`}
                    >
                      Preview
                    </button>
                    <button
                      type="button"
                      onClick={() => setTailorViewMode('edit')}
                      className={`px-2.5 py-0.5 text-[10px] font-bold rounded-md transition duration-150 cursor-pointer ${
                        tailorViewMode === 'edit'
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
                    onClick={() => handleCopyText(tailoredText)}
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

              {tailorViewMode === 'edit' ? (
                <TextArea
                  className="font-mono text-xs flex-1 min-h-[300px] bg-slate-900/5 text-slate-800 dark:bg-slate-900/60 dark:text-slate-100"
                  value={tailoredText}
                  onChange={(e) => setTailoredText(e.target.value)}
                  rows={14}
                />
              ) : (
                <MarkdownPreview content={tailoredText} className="flex-1 min-h-[300px]" />
              )}

              {/* Extracted Metadata Preview */}
              {(tailoredSkills.length > 0 || tailoredTech.length > 0 || tailoredDomains.length > 0) && (
                <div className="p-4 bg-slate-50 dark:bg-slate-900/40 rounded-xl border border-slate-100 dark:border-slate-700 text-xs space-y-2">
                  <span className="font-extrabold text-slate-700 dark:text-slate-300">Parsed Tags to Register:</span>
                  {tailoredSkills.length > 0 && (
                    <div className="flex flex-wrap items-center gap-1 mt-1">
                      <span className="font-semibold text-slate-400 mr-1">Skills:</span>
                      {tailoredSkills.map((s, idx) => (
                        <Badge key={idx} variant="offer" className="text-[10px]">
                          {s}
                        </Badge>
                      ))}
                    </div>
                  )}
                  {tailoredTech.length > 0 && (
                    <div className="flex flex-wrap items-center gap-1 mt-1">
                      <span className="font-semibold text-slate-400 mr-1">Tech:</span>
                      {tailoredTech.map((t, idx) => (
                        <Badge key={idx} variant="interview" className="text-[10px]">
                          {t}
                        </Badge>
                      ))}
                    </div>
                  )}
                  {tailoredDomains.length > 0 && (
                    <div className="flex flex-wrap items-center gap-1 mt-1">
                      <span className="font-semibold text-slate-400 mr-1">Domains:</span>
                      {tailoredDomains.map((d, idx) => (
                        <Badge key={idx} variant="applied" className="text-[10px]">
                          {d}
                        </Badge>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          ) : (
            <div className="flex-1 border border-dashed border-slate-200 dark:border-slate-700 rounded-2xl flex flex-col items-center justify-center text-center p-8 bg-slate-50/20">
              <FileText className="h-10 w-10 text-slate-300 dark:text-slate-700 mb-2.5" />
              <span className="text-xs font-bold text-slate-500 dark:text-slate-400">No Custom Draft Created Yet</span>
              <p className="text-[11px] text-slate-400 dark:text-slate-500 max-w-sm mt-1">
                Click "Draft Tailored CV" on the left panel to execute keywords alignment and generate updated copy.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Save Tailored Resume Modal */}
      <Modal
        isOpen={isSaveModalOpen}
        onClose={() => setIsSaveModalOpen(false)}
        title="Save Tailored Resume"
        footer={saveModalFooter}
        variant="default"
      >
        <form id="save-tailored-resume-form" onSubmit={handleSaveTailoredResume} className="space-y-4">
          <input
            type="text"
            className="w-full p-2 border border-slate-200 dark:border-slate-700 rounded-lg text-xs"
            placeholder="e.g. Tailored Resume - AWS role at Acme Corp"
            value={saveTitle}
            onChange={(e) => setSaveTitle(e.target.value)}
            required
            disabled={saveTailoredResumeMutation.isPending}
          />
          <p className="text-slate-400 text-[11px]">
            Saving will register this tailored CV as a new entry in your **Resume Manager**.
          </p>
        </form>
      </Modal>
    </div>
  )
}

export default TailorResumeTab
