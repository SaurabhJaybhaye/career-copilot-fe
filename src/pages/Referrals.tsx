import React, { useState } from 'react'
import { toast } from 'react-hot-toast'
import { 
  Users, 
  UserPlus, 
  Trash2, 
  Mail, 
  Linkedin, 
  Copy, 
  Check, 
  MessageSquare,
  Sparkles,
  Edit2
} from 'lucide-react'
import { Button } from '@/components/Button'
import { Input, TextArea } from '@/components/Input'
import { Select } from '@/components/Select'
import { Badge } from '@/components/Badge'
import { Modal } from '@/components/Modal'
import { DataTable } from '@/components/DataTable'
import { 
  useReferralsQuery, 
  useCreateReferralMutation, 
  useUpdateReferralStatusMutation, 
  useDeleteReferralMutation 
} from '@/hooks/useReferrals'
import { useJobsQuery } from '@/hooks/useJobs'
import type { Referral } from '@/hooks/useReferrals'

const OUTREACH_STATUSES = [
  { key: 'pending', label: 'Pending', variant: 'applied' as const },
  { key: 'referred', label: 'Referred', variant: 'offer' as const },
  { key: 'declined', label: 'Declined', variant: 'interview' as const }
] as const

type ReferralStatus = typeof OUTREACH_STATUSES[number]['key']

export const Referrals: React.FC = () => {
  const { data: referrals = [], isLoading: isListLoading } = useReferralsQuery()
  const { data: jobs = [] } = useJobsQuery()

  const createReferralMutation = useCreateReferralMutation()
  const updateStatusMutation = useUpdateReferralStatusMutation()
  const deleteReferralMutation = useDeleteReferralMutation()

  // Drawers controls
  const [isAddOpen, setIsAddOpen] = useState(false)
  const [isEditOpen, setIsEditOpen] = useState(false)
  const [isAIHelperOpen, setIsAIHelperOpen] = useState(false)
  
  // Active/selected item controls
  const [selectedReferralId, setSelectedReferralId] = useState<string | null>(null)

  // Add/Edit Form states
  const [jobId, setJobId] = useState('')
  const [referrerName, setReferrerName] = useState('')
  const [referrerEmail, setReferrerEmail] = useState('')
  const [referrerContact, setReferrerContact] = useState('')
  const [status, setStatus] = useState<ReferralStatus>('pending')
  const [notes, setNotes] = useState('')

  // AI Message helper template states
  const [activeTemplateTab, setActiveTemplateTab] = useState<'linkedin' | 'email' | 'casual'>('linkedin')
  const [copiedText, setCopiedText] = useState(false)

  // Find active items
  const activeReferral = referrals.find(r => (r._id || r.id) === selectedReferralId)

  // Handle opening add drawer
  const openAddDrawer = () => {
    setJobId('')
    setReferrerName('')
    setReferrerEmail('')
    setReferrerContact('')
    setStatus('pending')
    setNotes('')
    setIsAddOpen(true)
  }

  // Handle opening edit drawer
  const openEditDrawer = (ref: Referral) => {
    setSelectedReferralId(ref._id || ref.id || null)
    setJobId(ref.jobId?._id || ref.jobId?.id || '')
    setReferrerName(ref.referrerName)
    setReferrerEmail(ref.referrerEmail || '')
    setReferrerContact(ref.referrerContact || '')
    setStatus(ref.status)
    setNotes(ref.notes || '')
    setIsEditOpen(true)
  }

  // Handle closing edit drawer
  const closeEditDrawer = () => {
    setIsEditOpen(false)
    setSelectedReferralId(null)
    setJobId('')
    setReferrerName('')
    setReferrerEmail('')
    setReferrerContact('')
    setStatus('pending')
    setNotes('')
  }

  // Submit new referral handler
  const handleAddSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!jobId || !referrerName.trim()) {
      toast.error('Target Job and Referrer Name are required.')
      return
    }

    try {
      await createReferralMutation.mutateAsync({
        jobId,
        referrerName: referrerName.trim(),
        referrerEmail: referrerEmail.trim() || undefined,
        referrerContact: referrerContact.trim() || undefined,
        status,
        notes: notes.trim() || undefined,
      })
      toast.success('Referral contact registered successfully!')
      setIsAddOpen(false)
    } catch (err: any) {
      toast.error(err.message || 'Failed to add referral.')
    }
  }

  // Submit edit referral handler
  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedReferralId || !referrerName.trim()) return

    try {
      await updateStatusMutation.mutateAsync({
        id: selectedReferralId,
        status,
        notes: notes.trim(),
      })
      toast.success('Referral log updated successfully!')
      closeEditDrawer()
    } catch (err: any) {
      toast.error(err.message || 'Failed to update referral details.')
    }
  }

  // Delete referral contact handler
  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to remove this referral tracking record?')) return

    try {
      await deleteReferralMutation.mutateAsync(id)
      toast.success('Referral tracking removed.')
    } catch (err: any) {
      toast.error(err.message || 'Failed to remove referral.')
    }
  }

  // AI template copy mechanism
  const getAIOutreachMessage = (ref: Referral) => {
    const name = ref.referrerName
    const jobTitle = ref.jobId?.title || '[Job Title]'
    const company = ref.jobId?.company || '[Company Name]'
    const jobUrl = ref.jobId?.url || '[Job URL]'
    const myName = 'Candidate' // Default username fallback

    const templates = {
      linkedin: `Hi ${name},\nI hope you're doing well! I'm reaching out because I noticed an open role for a ${jobTitle} at ${company} and would love to learn more about the team. If you're open to it, could you review my background for a potential referral? Here is the link to the role: ${jobUrl}\nThanks so much!\n- ${myName}`,
      email: `Subject: Referral Request: ${jobTitle} - ${myName}\n\nHi ${name},\n\nI hope this email finds you well.\n\nI am writing to express my interest in the ${jobTitle} position at ${company}. Having reviewed the requirements, I believe my background aligns well with the team's goals. I would be very grateful if you could refer me for this role.\n\nYou can view the role description here: ${jobUrl}. Please let me know if you would like me to share my resume or any further details.\n\nThank you for your time and assistance!\n\nSincerely,\n${myName}`,
      casual: `Hey ${name},\nHope everything is going great on your end!\n\nI saw that ${company} is hiring for a ${jobTitle} and immediately thought of reaching out. I'd love to apply and was wondering if you might be comfortable referring me?\n\nNo worries if not, but let me know if you want to chat about it!\n\nBest,\n- ${myName}`
    }

    return templates[activeTemplateTab]
  }

  const handleCopyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    setCopiedText(true)
    toast.success('Outreach message copied to clipboard!')
    setTimeout(() => setCopiedText(false), 2000)
  }

  // DataTable columns configuration
  const columns = [
    {
      header: 'Referrer Name & Info',
      accessor: (row: Referral) => (
        <div className="text-left">
          <div className="font-bold text-slate-900 dark:text-white flex items-center">
            {row.referrerName}
          </div>
          <div className="flex items-center gap-2 mt-1">
            {row.referrerEmail && (
              <a 
                href={`mailto:${row.referrerEmail}`}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition"
                title={row.referrerEmail}
              >
                <Mail className="h-3.5 w-3.5" />
              </a>
            )}
            {row.referrerContact && (
              <a 
                href={row.referrerContact}
                target="_blank"
                rel="noreferrer"
                className="text-slate-400 hover:text-blue-500 transition"
                title="LinkedIn Profile"
              >
                <Linkedin className="h-3.5 w-3.5" />
              </a>
            )}
          </div>
        </div>
      ),
      sortable: true,
      sortKey: 'referrerName' as keyof Referral
    },
    {
      header: 'Target Role & Company',
      accessor: (row: Referral) => (
        <div className="text-left font-semibold">
          <div className="text-slate-900 dark:text-white text-xs">{row.jobId?.title || 'Unknown Title'}</div>
          <div className="text-slate-500 dark:text-slate-400 text-xxs mt-0.5">{row.jobId?.company || 'Unknown Company'}</div>
        </div>
      ),
      sortable: true,
      sortKey: 'jobId' as any
    },
    {
      header: 'Tracking Notes',
      accessor: (row: Referral) => (
        <span className="text-slate-500 dark:text-slate-400 text-xs line-clamp-1 max-w-[200px] text-left">
          {row.notes || 'No custom notes logged.'}
        </span>
      )
    },
    {
      header: 'Status',
      accessor: (row: Referral) => {
        const match = OUTREACH_STATUSES.find(s => s.key === row.status)
        return (
          <Badge variant={match?.variant || 'applied'} className="capitalize">
            {row.status}
          </Badge>
        )
      }
    },
    {
      header: 'Actions',
      accessor: (row: Referral) => (
        <div className="flex items-center space-x-2">
          <Button
            variant="primary"
            size="sm"
            onClick={() => {
              setSelectedReferralId(row._id || row.id || null)
              setIsAIHelperOpen(true)
            }}
            className="!py-1.5 !px-3 text-xs flex items-center gap-1 bg-violet-650 hover:bg-violet-755 border-none"
            title="Generate message templates"
          >
            <Sparkles className="h-3.5 w-3.5" /> AI Messaging
          </Button>
          <Button
            variant="secondary"
            size="sm"
            onClick={() => openEditDrawer(row)}
            className="p-1.5 min-h-0"
            title="Edit notes & status"
          >
            <Edit2 className="h-3.5 w-3.5" />
          </Button>
          <Button
            variant="danger"
            size="sm"
            onClick={() => handleDelete(row._id || row.id || '')}
            disabled={deleteReferralMutation.isPending}
            className="p-1.5 min-h-0"
            title="Remove referrer"
          >
            <Trash2 className="h-3.5 w-3.5" />
          </Button>
        </div>
      )
    }
  ]

  // Modals Header Action elements
  const addReferralFooter = (
    <div className="flex items-center space-x-2">
      <Button
        type="button"
        variant="default"
        onClick={() => setIsAddOpen(false)}
        disabled={createReferralMutation.isPending}
        className="!py-1.5 !px-3 text-xs"
      >
        Cancel
      </Button>
      <Button
        type="submit"
        form="add-ref-form"
        variant="primary"
        isLoading={createReferralMutation.isPending}
        className="!py-1.5 !px-3 text-xs"
      >
        Add Referrer
      </Button>
    </div>
  )

  const editReferralFooter = (
    <div className="flex items-center space-x-2">
      <Button
        type="button"
        variant="default"
        onClick={closeEditDrawer}
        disabled={updateStatusMutation.isPending}
        className="!py-1.5 !px-3 text-xs"
      >
        Cancel
      </Button>
      <Button
        type="submit"
        form="edit-ref-form"
        variant="primary"
        isLoading={updateStatusMutation.isPending}
        className="!py-1.5 !px-3 text-xs"
      >
        Update Log
      </Button>
    </div>
  )

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-5 border-b border-slate-200 dark:border-slate-700 gap-4">
        <div className="text-left">
          <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white flex items-center">
            <Users className="mr-2.5 h-8 w-8 text-violet-650" />
            Referrals
          </h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1">
            Track employee outreach requests, log progress states, and utilize AI template generators.
          </p>
        </div>
        <Button
          variant="primary"
          onClick={openAddDrawer}
          className="flex items-center self-start sm:self-auto"
        >
          <UserPlus className="mr-1.5 h-5 w-5" /> Add Contact
        </Button>
      </div>

      <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-100 dark:border-slate-700 shadow-sm">
        {isListLoading ? (
          <div className="py-16 flex flex-col items-center justify-center space-y-3">
            <span className="animate-spin h-8 w-8 text-violet-650 rounded-full border-2 border-violet-100 border-t-violet-650" />
            <p className="text-xs text-slate-500 font-semibold">Retrieving referral logs...</p>
          </div>
        ) : referrals.length === 0 ? (
          <div className="py-16 text-center text-slate-400 dark:text-slate-500 max-w-md mx-auto">
            <Users className="h-12 w-12 mx-auto text-slate-300 mb-3" />
            <h4 className="font-extrabold text-slate-900 dark:text-white text-base">No Referrals Registered</h4>
            <p className="text-xs text-slate-500 max-w-sm mt-1.5 leading-relaxed">
              Log employee networks to manage outreach template copies, update statuses, and track pipeline conversions.
            </p>
            <Button
              variant="primary"
              size="sm"
              onClick={openAddDrawer}
              className="mt-4"
            >
              Log First Referrer
            </Button>
          </div>
        ) : (
          <DataTable
            columns={columns}
            data={referrals}
            pageSize={10}
            searchPlaceholder="Search referrers, companies, or jobs..."
            searchKeys={['referrerName', 'referrerEmail', 'notes']}
          />
        )}
      </div>

      {/* Add Referrer Drawer */}
      <Modal
        isOpen={isAddOpen}
        onClose={() => setIsAddOpen(false)}
        title="Add Referrer Contact"
        footer={addReferralFooter}
        variant="default"
      >
        <form id="add-ref-form" onSubmit={handleAddSubmit} className="space-y-4 text-left">
          {jobs.length === 0 ? (
            <div className="p-4 bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-900/30 text-amber-800 dark:text-amber-300 rounded-xl text-xs">
              Please register a target job posting first in Job Matches to associate referrers.
            </div>
          ) : (
            <Select
              label="Select Associated Job Posting"
              value={jobId}
              onChange={(e) => setJobId(e.target.value)}
              options={[
                { value: '', label: '-- Choose target job description --' },
                ...jobs.map(j => ({ value: j._id || j.id || '', label: `${j.title} (${j.company})` }))
              ]}
              required
            />
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Referrer Full Name"
              placeholder="e.g. John Doe"
              value={referrerName}
              onChange={(e) => setReferrerName(e.target.value)}
              required
            />
            <Input
              label="Referrer Email"
              placeholder="e.g. johndoe@company.com"
              type="email"
              value={referrerEmail}
              onChange={(e) => setReferrerEmail(e.target.value)}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="LinkedIn Profile URL"
              placeholder="e.g. https://linkedin.com/in/..."
              value={referrerContact}
              onChange={(e) => setReferrerContact(e.target.value)}
            />
            <Select
              label="Outreach Status"
              value={status}
              onChange={(e) => setStatus(e.target.value as ReferralStatus)}
              options={[
                { value: 'pending', label: 'Pending Request' },
                { value: 'referred', label: 'Referred Successfully' },
                { value: 'declined', label: 'Declined' },
              ]}
            />
          </div>

          <TextArea
            label="Outreach Notes"
            placeholder="Log internal comments, e.g. met John at a local meetup. LinkedIn request sent."
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            rows={4}
          />
        </form>
      </Modal>

      {/* Edit Referrer Notes/Status Drawer */}
      <Modal
        isOpen={isEditOpen}
        onClose={closeEditDrawer}
        title={`Update Log: ${referrerName}`}
        footer={editReferralFooter}
        variant="default"
      >
        <form id="edit-ref-form" onSubmit={handleEditSubmit} className="space-y-4 text-left">
          <div className="p-3 bg-slate-50 dark:bg-slate-900/40 border border-slate-100 dark:border-slate-800 rounded-xl space-y-1 text-xs">
            <p className="font-bold text-slate-800 dark:text-slate-300">
              Referrer Contact details
            </p>
            <p className="text-slate-500 dark:text-slate-400">
              Name: <span className="font-semibold text-slate-700 dark:text-slate-200">{referrerName}</span>
            </p>
            {referrerEmail && (
              <p className="text-slate-500 dark:text-slate-400">
                Email: <span className="font-semibold text-slate-700 dark:text-slate-200">{referrerEmail}</span>
              </p>
            )}
            {referrerContact && (
              <p className="text-slate-500 dark:text-slate-400">
                LinkedIn: <a href={referrerContact} target="_blank" rel="noreferrer" className="text-violet-650 hover:underline">{referrerContact}</a>
              </p>
            )}
          </div>

          <Select
            label="Outreach Status"
            value={status}
            onChange={(e) => setStatus(e.target.value as ReferralStatus)}
            options={[
              { value: 'pending', label: 'Pending Request' },
              { value: 'referred', label: 'Referred Successfully' },
              { value: 'declined', label: 'Declined' },
            ]}
          />

          <TextArea
            label="Outreach Notes"
            placeholder="Update latest comments, e.g. John checked with HR; referral submitted."
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            rows={5}
          />
        </form>
      </Modal>

      {/* AI Outreach Template Generator Drawer */}
      <Modal
        isOpen={isAIHelperOpen}
        onClose={() => {
          setIsAIHelperOpen(false)
          setSelectedReferralId(null)
        }}
        title="AI Outreach Message Assistant"
        variant="default"
      >
        {activeReferral ? (
          <div className="space-y-5 text-left">
            <div className="flex items-center space-x-2 text-xs font-bold text-slate-500 pb-3 border-b border-slate-200 dark:border-slate-700">
              <span>Generating outreach templates for</span>
              <Badge variant="applied" className="capitalize text-xxs font-extrabold bg-slate-200/50 border-none text-slate-700">
                {activeReferral.referrerName}
              </Badge>
            </div>

            {/* Template select tabs */}
            <div className="flex border-b border-slate-200 dark:border-slate-700">
              {(['linkedin', 'email', 'casual'] as const).map((tab) => (
                <button
                  key={tab}
                  onClick={() => {
                    setActiveTemplateTab(tab)
                    setCopiedText(false)
                  }}
                  className={`py-2 px-4 text-xs font-extrabold capitalize cursor-pointer transition select-none ${
                    activeTemplateTab === tab
                      ? 'border-b-2 border-violet-500 text-violet-600 dark:text-violet-400'
                      : 'text-slate-400 hover:text-slate-600'
                  }`}
                >
                  {tab === 'linkedin' ? 'LinkedIn' : tab === 'email' ? 'Email' : 'Casual Message'}
                </button>
              ))}
            </div>

            {/* Message Preview Box */}
            <div className="relative bg-slate-50 dark:bg-slate-900/40 p-4.5 rounded-2xl border border-slate-200 dark:border-slate-700 space-y-3">
              <pre className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed font-sans whitespace-pre-wrap select-all">
                {getAIOutreachMessage(activeReferral)}
              </pre>

              <div className="flex justify-end pt-3.5 border-t border-slate-200/50 dark:border-slate-700/50">
                <Button
                  variant="primary"
                  size="sm"
                  onClick={() => handleCopyToClipboard(getAIOutreachMessage(activeReferral))}
                  className="flex items-center gap-1.5 !py-1.5 !px-3 text-xs bg-violet-650 hover:bg-violet-755 border-none"
                >
                  {copiedText ? (
                    <>
                      <Check className="h-3.5 w-3.5 text-emerald-400" /> Copied!
                    </>
                  ) : (
                    <>
                      <Copy className="h-3.5 w-3.5" /> Copy Message
                    </>
                  )}
                </Button>
              </div>
            </div>

            <div className="pt-2 text-xxs text-slate-500 flex items-start gap-1">
              <MessageSquare className="h-3 w-3 text-violet-500 flex-shrink-0 mt-0.5" />
              <span>
                Tip: Copy and paste the message into LinkedIn Messages or your email client. Make sure to customize the placeholder fields before sending.
              </span>
            </div>

            {/* Close button action */}
            <div className="pt-3.5 border-t border-slate-200 dark:border-slate-700 flex justify-end">
              <Button 
                onClick={() => {
                  setIsAIHelperOpen(false)
                  setSelectedReferralId(null)
                }} 
                variant="default"
              >
                Close Assistant
              </Button>
            </div>
          </div>
        ) : (
          <p className="text-slate-500 text-center text-sm py-4">Failed to load referral details.</p>
        )}
      </Modal>
    </div>
  )
}
