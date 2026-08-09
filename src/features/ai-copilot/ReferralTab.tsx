import React, { useState } from 'react'
import { toast } from 'react-hot-toast'
import { MessageSquare, Check, Copy, Linkedin, Mail } from 'lucide-react'
import { Button } from '@/components/Button'
import { Input, TextArea } from '@/components/Input'
import { Select } from '@/components/Select'
import { useGenerateReferralMutation } from '@/hooks/useAICopilot'

interface ReferralTabProps {
  selectedResumeId: string
  selectedJobId: string
}

export const ReferralTab: React.FC<ReferralTabProps> = ({ selectedResumeId, selectedJobId }) => {
  const generateReferralMutation = useGenerateReferralMutation()

  const [referrerName, setReferrerName] = useState('')
  const [outreachPlatform, setOutreachPlatform] = useState('LinkedIn')
  const [outreachPrompt, setOutreachPrompt] = useState('')
  const [outreachText, setOutreachText] = useState('')
  const [copiedOutreach, setCopiedOutreach] = useState(false)

  const handleGenerateReferral = () => {
    if (!selectedResumeId || !selectedJobId) return
    generateReferralMutation.mutate(
      {
        resumeId: selectedResumeId,
        jobId: selectedJobId,
        referrerName: referrerName.trim() || undefined,
        platform: outreachPlatform,
        customPrompt: outreachPrompt.trim() || undefined,
      },
      {
        onSuccess: (text) => {
          setOutreachText(text)
          toast.success('Referral message drafted!')
        },
        onError: (err) => {
          toast.error(err.message || 'Failed to draft referral message.')
        },
      }
    )
  }

  const handleCopyText = (text: string) => {
    navigator.clipboard.writeText(text)
    setCopiedOutreach(true)
    toast.success('Copied to clipboard!')
    setTimeout(() => setCopiedOutreach(false), 2000)
  }

  return (
    <div className="space-y-6 flex-1 flex flex-col">
      <div>
        <h4 className="font-extrabold text-slate-900 dark:text-white text-base">Generate Networking Referral Outreach</h4>
        <p className="text-slate-500 dark:text-slate-400 text-xs mt-0.5">
          Draft outreach messages requesting a warm referral from employee contacts.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-stretch flex-1">
        {/* Inputs */}
        <div className="bg-slate-50/50 dark:bg-slate-900/10 p-5 rounded-2xl border border-slate-100 dark:border-slate-700 flex flex-col justify-between space-y-4">
          <div className="space-y-4">
            <h5 className="text-xs font-black uppercase tracking-wider text-slate-400">Referrer Context</h5>

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
                <span className="text-xs font-black uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                  {outreachPlatform === 'LinkedIn' && <Linkedin className="h-4 w-4 text-blue-600" />}
                  {outreachPlatform === 'Email' && <Mail className="h-4 w-4 text-red-500" />}
                  {outreachPlatform === 'Cold Message' && <MessageSquare className="h-4 w-4 text-violet-500" />}
                  Outreach Template ({outreachPlatform})
                </span>
                <Button
                  size="sm"
                  variant="secondary"
                  onClick={() => handleCopyText(outreachText)}
                  icon={copiedOutreach ? <Check className="h-3.5 w-3.5 text-emerald-500" /> : <Copy className="h-3.5 w-3.5" />}
                >
                  {copiedOutreach ? 'Copied' : 'Copy'}
                </Button>
              </div>
              <TextArea
                className="font-sans text-xs flex-1 min-h-[300px] leading-relaxed bg-slate-900/5 dark:bg-slate-900/60"
                value={outreachText}
                onChange={(e) => setOutreachText(e.target.value)}
                rows={14}
              />
            </div>
          ) : (
            <div className="flex-1 border border-dashed border-slate-200 dark:border-slate-700 rounded-2xl flex flex-col items-center justify-center text-center p-8 bg-slate-50/20">
              <MessageSquare className="h-10 w-10 text-slate-300 dark:text-slate-700 mb-2.5" />
              <span className="text-xs font-bold text-slate-500 dark:text-slate-400">No Outreach Drafted</span>
              <p className="text-[11px] text-slate-400 dark:text-slate-500 max-w-sm mt-1">
                Define your recipient context and click "Draft Message" to create a high-conversion networking pitch.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default ReferralTab
