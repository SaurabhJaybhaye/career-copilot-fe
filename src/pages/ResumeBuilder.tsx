import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-hot-toast'
import { 
  FileText, 
  Upload, 
  Trash2, 
  Eye, 
  Award, 
  Cpu, 
  Globe, 
  Download, 
  Check, 
  Loader2, 
  Sparkles,
  Plus,
  Briefcase,
  GraduationCap,
  FolderGit2,
  Link2,
  Mail
} from 'lucide-react'
import { Button } from '@/components/Button'
import { Input, TextArea } from '@/components/Input'
import { Badge } from '@/components/Badge'
import { Modal } from '@/components/Modal'
import { DataTable } from '@/components/DataTable'
import { 
  useResumesQuery, 
  useUploadResumeMutation, 
  useUpdateResumeMutation, 
  useDeleteResumeMutation,
  useDeleteResumesBulkMutation,
} from '@/hooks/useResumes'
import type { Resume } from '@/hooks/useResumes'

// Tag Manager helper component for editing list tags in verification form
interface TagManagerProps {
  label: string
  tags: string[]
  setTags: React.Dispatch<React.SetStateAction<string[]>>
  badgeVariant: 'offer' | 'interview' | 'applied' | 'warning'
}

const TagManager: React.FC<TagManagerProps> = ({ label, tags, setTags, badgeVariant }) => {
  const [input, setInput] = useState('')
  
  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault()
    const val = input.trim()
    if (val && !tags.includes(val)) {
      setTags([...tags, val])
      setInput('')
    }
  }
  
  const handleRemove = (tagToRemove: string) => {
    setTags(tags.filter(t => t !== tagToRemove))
  }
  
  return (
    <div className="space-y-2 text-left bg-slate-50/50 dark:bg-slate-900/10 p-4 border border-slate-100 dark:border-slate-700 rounded-2xl">
      <label className="block text-xs font-black text-slate-500 dark:text-slate-400 uppercase tracking-wider">{label}</label>
      <div className="flex flex-wrap gap-1.5 p-2 bg-white dark:bg-slate-900/30 border border-slate-100 dark:border-slate-700 rounded-xl min-h-[40px]">
        {tags.map((tag, i) => (
          <Badge key={i} variant={badgeVariant} className="flex items-center gap-1">
            {tag}
            <button
              type="button"
              onClick={() => handleRemove(tag)}
              className="hover:text-red-500 font-bold ml-1 cursor-pointer focus:outline-none text-[10px]"
            >
              &times;
            </button>
          </Badge>
        ))}
        {tags.length === 0 && <span className="text-[11px] text-slate-400 italic flex items-center">No tags added.</span>}
      </div>
      <div className="flex gap-2">
        <Input
          placeholder={`Add a new ${label.toLowerCase()}...`}
          value={input}
          onChange={e => setInput(e.target.value)}
          className="!py-1 !px-2.5 text-xs flex-1"
        />
        <Button type="button" onClick={handleAdd} variant="secondary" size="sm" className="!py-1 !px-3 text-xs">
          Add
        </Button>
      </div>
    </div>
  )
}

export const ResumeBuilder: React.FC = () => {
  const navigate = useNavigate()
  const { data: resumes = [], isLoading: isListLoading } = useResumesQuery()
  const uploadResumeMutation = useUploadResumeMutation()
  const updateResumeMutation = useUpdateResumeMutation()
  const deleteResumeMutation = useDeleteResumeMutation()
  const deleteResumesBulkMutation = useDeleteResumesBulkMutation()

  const [title, setTitle] = useState('')
  const [file, setFile] = useState<File | null>(null)
  const [selectedResumeId, setSelectedResumeId] = useState<string | null>(null)
  const [selectedResumeIds, setSelectedResumeIds] = useState<string[]>([])

  // Manage custom upload phase loader messages
  const [uploadPhase, setUploadPhase] = useState<'extracting' | 'parsing'>('extracting')
  const [verifyingResume, setVerifyingResume] = useState<Resume | null>(null)

  // Local form states for verification
  const [editTitle, setEditTitle] = useState('')
  const [editName, setEditName] = useState('')
  const [editEmail, setEditEmail] = useState('')
  const [editPhone, setEditPhone] = useState('')
  const [editLocation, setEditLocation] = useState('')
  const [editLinks, setEditLinks] = useState<string[]>([])
  const [editSummary, setEditSummary] = useState('')
  const [editSkills, setEditSkills] = useState<string[]>([])
  const [editTechs, setEditTechs] = useState<string[]>([])
  const [editDomains, setEditDomains] = useState<string[]>([])

  const [editExperience, setEditExperience] = useState<Array<{
    jobTitle: string
    company: string
    duration: string
    achievements: string[]
  }>>([])

  const [editEducation, setEditEducation] = useState<Array<{
    degree: string
    school: string
    fieldOfStudy: string
    duration: string
  }>>([])

  const [editProjects, setEditProjects] = useState<Array<{
    title: string
    description: string
    technologies: string[]
  }>>([])

  const [newLinkInput, setNewLinkInput] = useState('')

  // Set timeout to switch phases
  React.useEffect(() => {
    let timer: any
    if (uploadResumeMutation.isPending) {
      setUploadPhase('extracting')
      timer = setTimeout(() => {
        setUploadPhase('parsing')
      }, 5000)
    } else {
      setUploadPhase('extracting')
    }
    return () => clearTimeout(timer)
  }, [uploadResumeMutation.isPending])

  const computeResumeStrength = () => {
    let score = 0
    const checklist = [
      { id: 'title', label: 'Document label specified', isCompleted: editTitle.trim().length > 0, scoreVal: 10 },
      { id: 'name', label: 'Contact full name provided', isCompleted: editName.trim().length > 0, scoreVal: 10 },
      { id: 'email', label: 'Valid email address entered', isCompleted: editEmail.trim().includes('@'), scoreVal: 10 },
      { id: 'phone', label: 'Phone contact provided', isCompleted: editPhone.trim().length >= 7, scoreVal: 10 },
      { id: 'links', label: 'At least 1 profile link included', isCompleted: editLinks.length > 0, scoreVal: 10 },
      { id: 'summary', label: 'Professional summary written', isCompleted: editSummary.trim().length > 20, scoreVal: 15 },
      { id: 'experience', label: 'At least 1 job experience added', isCompleted: editExperience.length > 0, scoreVal: 15 },
      { id: 'education', label: 'At least 1 school/degree added', isCompleted: editEducation.length > 0, scoreVal: 10 },
      { id: 'projects', label: 'At least 1 project added', isCompleted: editProjects.length > 0, scoreVal: 10 },
    ]
    
    checklist.forEach(item => {
      if (item.isCompleted) score += item.scoreVal
    })
    
    return { score, checklist }
  }

  const startVerification = (resume: Resume) => {
    const activeId = resume._id || resume.id
    const normalizedResume = { ...resume, id: activeId }
    setVerifyingResume(normalizedResume)
    setEditTitle(resume.title || '')
    
    const info = resume.structuredData?.personalInfo || {}
    setEditName(info.name || '')
    setEditEmail(info.email || '')
    setEditPhone(info.phone || '')
    setEditLocation(info.location || '')
    setEditLinks(info.links || [])
    
    setEditSummary(resume.structuredData?.summary || '')
    setEditSkills(resume.skills || [])
    setEditTechs(resume.technologies || [])
    setEditDomains(resume.domains || [])
    
    setEditExperience(resume.structuredData?.workExperience || [])
    setEditEducation(resume.structuredData?.education || [])
    setEditProjects(resume.structuredData?.projects || [])
  }

  // Read active resume directly from the list
  const activeResume = resumes.find((r) => (r._id || r.id) === selectedResumeId)
  const isDetailsLoading = false

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
      const parsedResume = await uploadResumeMutation.mutateAsync({
        file,
        title: title.trim() || undefined,
      })
      toast.success('Resume uploaded and parsed!')
      setFile(null)
      setTitle('')
      // Clear file input element
      const fileInput = document.getElementById('resume-file-input') as HTMLInputElement
      if (fileInput) fileInput.value = ''
      
      if (parsedResume) {
        startVerification(parsedResume)
      }
    } catch (err: any) {
      toast.error(err.message || 'Failed to upload and parse resume.')
    }
  }

  const handleSaveAndFinalize = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!verifyingResume) return

    try {
      await updateResumeMutation.mutateAsync({
        id: verifyingResume.id,
        title: editTitle.trim() || undefined,
        skills: editSkills,
        technologies: editTechs,
        domains: editDomains,
        structuredData: {
          personalInfo: {
            name: editName,
            email: editEmail,
            phone: editPhone,
            location: editLocation,
            links: editLinks,
          },
          summary: editSummary,
          workExperience: editExperience,
          education: editEducation,
          projects: editProjects,
        }
      })
      toast.success('Profile and resume data finalized successfully!')
      setVerifyingResume(null)
    } catch (err: any) {
      toast.error(err.message || 'Failed to finalize resume updates.')
    }
  }

  const handleCancelAndDiscard = async () => {
    if (!verifyingResume) return
    if (!window.confirm('Are you sure you want to discard this uploaded resume? This will delete the uploaded file.')) return

    try {
      await deleteResumeMutation.mutateAsync(verifyingResume.id)
      toast.success('Resume draft discarded.')
      setVerifyingResume(null)
    } catch (err: any) {
      toast.error(err.message || 'Failed to delete resume draft.')
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

  const handleBulkDeleteResumes = async (selectedIds: string[], clearSelection: () => void) => {
    if (!window.confirm(`Are you sure you want to delete ${selectedIds.length} selected resume(s)?`)) return

    try {
      await deleteResumesBulkMutation.mutateAsync(selectedIds)
      toast.success(`${selectedIds.length} resume(s) deleted successfully.`)
      clearSelection()
      if (selectedResumeId && selectedIds.includes(selectedResumeId)) {
        setSelectedResumeId(null)
      }
    } catch (err: any) {
      toast.error(err.message || 'Failed to delete selected resumes.')
    }
  }

  // Links List utilities
  const handleAddLink = (e: React.FormEvent) => {
    e.preventDefault()
    const val = newLinkInput.trim()
    if (val && !editLinks.includes(val)) {
      setEditLinks([...editLinks, val])
      setNewLinkInput('')
    }
  }

  const handleRemoveLink = (link: string) => {
    setEditLinks(editLinks.filter(l => l !== link))
  }

  // Work Experience Utilities
  const addExperienceItem = () => {
    setEditExperience([...editExperience, { jobTitle: '', company: '', duration: '', achievements: [] }])
  }

  const removeExperienceItem = (index: number) => {
    setEditExperience(editExperience.filter((_, i) => i !== index))
  }

  const updateExperienceItem = (index: number, key: string, val: any) => {
    setEditExperience(editExperience.map((item, i) => i === index ? { ...item, [key]: val } : item))
  }

  const [achievementInputs, setAchievementInputs] = useState<Record<number, string>>({})
  const addAchievement = (expIndex: number) => {
    const text = achievementInputs[expIndex]?.trim()
    if (!text) return
    setEditExperience(editExperience.map((item, i) => {
      if (i === expIndex) {
        return { ...item, achievements: [...item.achievements, text] }
      }
      return item
    }))
    setAchievementInputs({ ...achievementInputs, [expIndex]: '' })
  }

  const removeAchievement = (expIndex: number, achIndex: number) => {
    setEditExperience(editExperience.map((item, i) => {
      if (i === expIndex) {
        return { ...item, achievements: item.achievements.filter((_, aIdx) => aIdx !== achIndex) }
      }
      return item
    }))
  }

  // Education Utilities
  const addEducationItem = () => {
    setEditEducation([...editEducation, { degree: '', school: '', fieldOfStudy: '', duration: '' }])
  }

  const removeEducationItem = (index: number) => {
    setEditEducation(editEducation.filter((_, i) => i !== index))
  }

  const updateEducationItem = (index: number, key: string, val: any) => {
    setEditEducation(editEducation.map((item, i) => i === index ? { ...item, [key]: val } : item))
  }

  // Projects Utilities
  const addProjectItem = () => {
    setEditProjects([...editProjects, { title: '', description: '', technologies: [] }])
  }

  const removeProjectItem = (index: number) => {
    setEditProjects(editProjects.filter((_, i) => i !== index))
  }

  const updateProjectItem = (index: number, key: string, val: any) => {
    setEditProjects(editProjects.map((item, i) => i === index ? { ...item, [key]: val } : item))
  }

  const [projectTechInputs, setProjectTechInputs] = useState<Record<number, string>>({})
  const addProjectTech = (projIndex: number) => {
    const text = projectTechInputs[projIndex]?.trim()
    if (!text) return
    setEditProjects(editProjects.map((item, i) => {
      if (i === projIndex) {
        return { ...item, technologies: [...item.technologies, text] }
      }
      return item
    }))
    setProjectTechInputs({ ...projectTechInputs, [projIndex]: '' })
  }

  const removeProjectTech = (projIndex: number, techIndex: number) => {
    setEditProjects(editProjects.map((item, i) => {
      if (i === projIndex) {
        return { ...item, technologies: item.technologies.filter((_, tIdx) => tIdx !== techIndex) }
      }
      return item
    }))
  }

  // DataTable columns definition
  const columns = [
    {
      header: 'Resume Title',
      accessor: (row: Resume) => (
        <button
          onClick={() => setSelectedResumeId(row._id || row.id)}
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
            onClick={() => handleMakeDefault(row._id || row.id)}
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
            onClick={() => setSelectedResumeId(row._id || row.id)}
            className="p-1.5 min-h-0"
            title="Inspect keywords"
          >
            <Eye className="h-4 w-4" />
          </Button>
          <Button
            variant="danger"
            size="sm"
            onClick={() => handleDelete(row._id || row.id)}
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

  // If in Verify & Save Wizard Mode
  if (verifyingResume) {
    return (
      <div className="space-y-6 text-left">
        <div className="pb-5 border-b border-slate-200 dark:border-slate-700 flex items-center justify-between flex-wrap gap-4">
          <div>
            <h1 className="text-2xl font-black text-slate-900 dark:text-white flex items-center gap-2">
              <Sparkles className="h-7 w-7 text-violet-650 animate-pulse" />
              Verify & Save Profile Data
            </h1>
            <p className="text-slate-500 dark:text-slate-400 text-xs mt-1">
              Gemini has successfully extracted resume segments. Review the pre-filled fields below, adjust if needed, and finalize.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button
              type="button"
              variant="default"
              onClick={handleCancelAndDiscard}
              disabled={updateResumeMutation.isPending || deleteResumeMutation.isPending}
            >
              Cancel & Discard
            </Button>
            <Button
              type="submit"
              form="verify-resume-form"
              variant="primary"
              isLoading={updateResumeMutation.isPending}
              icon={<Check className="h-4 w-4" />}
            >
              Save & Finalize
            </Button>
          </div>
        </div>

        <form id="verify-resume-form" onSubmit={handleSaveAndFinalize} className="space-y-6">
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 items-start">
            
            {/* Column 1: Contact, Summary & Tags */}
            <div className="space-y-6">
              
              {/* Card: Resume Strength Score & Checklist */}
              <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-100 dark:border-slate-700 shadow-sm space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center">
                      <Award className="mr-2 h-4.5 w-4.5 text-violet-650" />
                      Resume Completeness Score
                    </h3>
                    <p className="text-xxs text-slate-400 dark:text-slate-400 mt-1">
                      Improve your score to ensure applicant tracking systems (ATS) can parse your profile fully.
                    </p>
                  </div>
                  {/* SVG Circle Gauge */}
                  <div className="relative flex items-center justify-center h-16 w-16 flex-shrink-0">
                    <svg className="w-full h-full transform -rotate-90">
                      <circle
                        cx="32"
                        cy="32"
                        r="26"
                        className="text-slate-100 dark:text-slate-700 stroke-current"
                        strokeWidth="5"
                        fill="transparent"
                      />
                      <circle
                        cx="32"
                        cy="32"
                        r="26"
                        className="text-violet-650 dark:text-violet-400 stroke-current transition-all duration-300"
                        strokeWidth="5"
                        strokeDasharray={2 * Math.PI * 26}
                        strokeDashoffset={2 * Math.PI * 26 * (1 - computeResumeStrength().score / 100)}
                        strokeLinecap="round"
                        fill="transparent"
                      />
                    </svg>
                    <span className="absolute text-sm font-black text-slate-800 dark:text-white">
                      {computeResumeStrength().score}%
                    </span>
                  </div>
                </div>

                {/* Progress bar line */}
                <div className="w-full bg-slate-100 dark:bg-slate-700 h-1.5 rounded-full overflow-hidden">
                  <div
                    className="bg-violet-650 h-full transition-all duration-500"
                    style={{ width: `${computeResumeStrength().score}%` }}
                  />
                </div>

                {/* Checklist items */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2 pt-2 border-t border-slate-50 dark:border-slate-700">
                  {computeResumeStrength().checklist.map((item) => (
                    <div key={item.id} className="flex items-center gap-2 text-xxs font-medium text-slate-600 dark:text-slate-300">
                      <span className={`flex-shrink-0 h-4.5 w-4.5 rounded-full flex items-center justify-center border transition ${
                        item.isCompleted
                           ? 'bg-emerald-50 border-emerald-200 text-emerald-600 dark:bg-emerald-950/20 dark:border-emerald-800'
                          : 'bg-slate-50 border-slate-200 text-slate-400 dark:bg-slate-900/30 dark:border-slate-800'
                      }`}>
                        {item.isCompleted ? <Check className="h-3 w-3" /> : <span className="h-1.5 w-1.5 rounded-full bg-slate-300 dark:bg-slate-700" />}
                      </span>
                      <span className={item.isCompleted ? 'line-through text-slate-400' : ''}>
                        {item.label}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Card: Document Title */}
              <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-100 dark:border-slate-700 shadow-sm space-y-4">
                <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center border-b pb-2.5 border-slate-50 dark:border-slate-700">
                  <FileText className="mr-2 h-4.5 w-4.5 text-violet-650" />
                  Document Profile Info
                </h3>
                <Input
                  label="Document Label / Title"
                  placeholder="e.g. Senior Software Architect Resume"
                  value={editTitle}
                  onChange={e => setEditTitle(e.target.value)}
                  required
                />
              </div>

              {/* Card: Contact Info */}
              <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-100 dark:border-slate-700 shadow-sm space-y-4">
                <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center border-b pb-2.5 border-slate-50 dark:border-slate-700">
                  <Mail className="mr-2 h-4.5 w-4.5 text-violet-650" />
                  Contact Information
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Input
                    label="Full Name"
                    placeholder="Jane Doe"
                    value={editName}
                    onChange={e => setEditName(e.target.value)}
                  />
                  <Input
                    label="Email Address"
                    placeholder="jane.doe@example.com"
                    type="email"
                    value={editEmail}
                    onChange={e => setEditEmail(e.target.value)}
                  />
                  <Input
                    label="Phone Number"
                    placeholder="+1-555-0199"
                    value={editPhone}
                    onChange={e => setEditPhone(e.target.value)}
                  />
                  <Input
                    label="Location"
                    placeholder="San Francisco, CA"
                    value={editLocation}
                    onChange={e => setEditLocation(e.target.value)}
                  />
                </div>
                
                {/* Links Lists */}
                <div className="space-y-2 pt-2">
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-200 uppercase tracking-wider">Profile Links</label>
                  <div className="flex flex-wrap gap-1.5 p-2 bg-slate-50/50 dark:bg-slate-900/10 border border-slate-100 dark:border-slate-700 rounded-xl">
                    {editLinks.map((link, idx) => (
                      <Badge key={idx} variant="applied" className="flex items-center gap-1.5">
                        <Link2 className="h-3 w-3" />
                        {link}
                        <button type="button" onClick={() => handleRemoveLink(link)} className="text-red-500 hover:text-red-700 font-bold text-[10px]">&times;</button>
                      </Badge>
                    ))}
                    {editLinks.length === 0 && <span className="text-[11px] text-slate-400 italic">No links added.</span>}
                  </div>
                  <div className="flex gap-2">
                    <Input
                      placeholder="Add profile URL (e.g. Github, LinkedIn)..."
                      value={newLinkInput}
                      onChange={e => setNewLinkInput(e.target.value)}
                      className="!py-1 !px-2.5 text-xs flex-1"
                    />
                    <Button type="button" onClick={handleAddLink} variant="secondary" size="sm" className="!py-1 !px-3 text-xs">
                      Add Link
                    </Button>
                  </div>
                </div>
              </div>

              {/* Card: Summary */}
              <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-100 dark:border-slate-700 shadow-sm space-y-4">
                <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center border-b pb-2.5 border-slate-50 dark:border-slate-700">
                  <Award className="mr-2 h-4.5 w-4.5 text-violet-650" />
                  Professional Summary
                </h3>
                <TextArea
                  placeholder="Tell us about your career summary..."
                  value={editSummary}
                  onChange={e => setEditSummary(e.target.value)}
                  rows={4}
                />
              </div>

              {/* Tag managers */}
              <div className="space-y-4">
                <TagManager label="Extracted Skills" tags={editSkills} setTags={setEditSkills} badgeVariant="offer" />
                <TagManager label="Extracted Technologies" tags={editTechs} setTags={setEditTechs} badgeVariant="interview" />
                <TagManager label="Extracted Industry Domains" tags={editDomains} setTags={setEditDomains} badgeVariant="applied" />
              </div>

            </div>

            {/* Column 2: Experience, Projects & Education */}
            <div className="space-y-6">
              
              {/* Card: Work Experience */}
              <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-100 dark:border-slate-700 shadow-sm space-y-4">
                <div className="flex items-center justify-between border-b pb-2.5 border-slate-100 dark:border-slate-700 flex-wrap gap-2">
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center">
                    <Briefcase className="mr-2 h-4.5 w-4.5 text-violet-650" />
                    Work Experience
                  </h3>
                  <Button type="button" onClick={addExperienceItem} variant="secondary" size="sm" className="flex items-center gap-1 !py-1 !px-2.5 text-xs">
                    <Plus className="h-3.5 w-3.5" /> Add Job
                  </Button>
                </div>

                <div className="space-y-4 max-h-[400px] overflow-y-auto pr-1">
                  {editExperience.map((exp, expIdx) => (
                    <div key={expIdx} className="p-4 border border-slate-100 dark:border-slate-700 rounded-xl relative space-y-3 bg-slate-50/20">
                      <button
                        type="button"
                        onClick={() => removeExperienceItem(expIdx)}
                        className="absolute top-3 right-3 text-red-500 hover:text-red-700 p-1"
                        title="Remove work experience"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pr-6">
                        <Input
                          label="Job Title"
                          placeholder="Software Engineer"
                          value={exp.jobTitle}
                          onChange={e => updateExperienceItem(expIdx, 'jobTitle', e.target.value)}
                          className="!py-1 !px-2.5 text-xs"
                        />
                        <Input
                          label="Company"
                          placeholder="Acme Corp"
                          value={exp.company}
                          onChange={e => updateExperienceItem(expIdx, 'company', e.target.value)}
                          className="!py-1 !px-2.5 text-xs"
                        />
                        <Input
                          label="Duration"
                          placeholder="June 2022 - Present"
                          value={exp.duration}
                          onChange={e => updateExperienceItem(expIdx, 'duration', e.target.value)}
                          className="!py-1 !px-2.5 text-xs"
                        />
                      </div>

                      {/* Achievements Bullets */}
                      <div className="space-y-2">
                        <label className="block text-xxs font-extrabold text-slate-400 uppercase tracking-wider">Key Achievements</label>
                        <ul className="list-disc pl-5 space-y-1">
                          {exp.achievements?.map((ach, achIdx) => (
                            <li key={achIdx} className="text-xs text-slate-600 dark:text-slate-300 relative group pr-6">
                              {ach}
                              <button
                                type="button"
                                onClick={() => removeAchievement(expIdx, achIdx)}
                                className="text-red-500 hover:text-red-700 font-bold ml-1 cursor-pointer select-none text-[10px]"
                              >
                                &times;
                              </button>
                            </li>
                          ))}
                        </ul>
                        <div className="flex gap-2">
                          <Input
                            placeholder="Add achievement bullet..."
                            value={achievementInputs[expIdx] || ''}
                            onChange={e => setAchievementInputs({ ...achievementInputs, [expIdx]: e.target.value })}
                            className="!py-1 !px-2.5 text-xs flex-1"
                          />
                          <Button
                            type="button"
                            onClick={() => addAchievement(expIdx)}
                            variant="secondary"
                            size="sm"
                            className="!py-1 !px-3 text-xs"
                          >
                            Add Bullet
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                  {editExperience.length === 0 && (
                    <p className="text-xs text-slate-400 italic text-center py-4">No work experience items added yet.</p>
                  )}
                </div>
              </div>

              {/* Card: Projects */}
              <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-100 dark:border-slate-700 shadow-sm space-y-4">
                <div className="flex items-center justify-between border-b pb-2.5 border-slate-50 dark:border-slate-700 flex-wrap gap-2">
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center">
                    <FolderGit2 className="mr-2 h-4.5 w-4.5 text-violet-650" />
                    Projects
                  </h3>
                  <Button type="button" onClick={addProjectItem} variant="secondary" size="sm" className="flex items-center gap-1 !py-1 !px-2.5 text-xs">
                    <Plus className="h-3.5 w-3.5" /> Add Project
                  </Button>
                </div>

                <div className="space-y-4 max-h-[300px] overflow-y-auto pr-1">
                  {editProjects.map((proj, projIdx) => (
                    <div key={projIdx} className="p-4 border border-slate-100 dark:border-slate-700 rounded-xl relative space-y-3 bg-slate-50/20">
                      <button
                        type="button"
                        onClick={() => removeProjectItem(projIdx)}
                        className="absolute top-3 right-3 text-red-500 hover:text-red-700 p-1"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>

                      <div className="pr-6">
                        <Input
                          label="Project Title"
                          placeholder="Analytics Dashboard"
                          value={proj.title}
                          onChange={e => updateProjectItem(projIdx, 'title', e.target.value)}
                          className="!py-1 !px-2.5 text-xs"
                        />
                      </div>
                      <TextArea
                        placeholder="Project description..."
                        value={proj.description}
                        onChange={e => updateProjectItem(projIdx, 'description', e.target.value)}
                        className="text-xs"
                        rows={2}
                      />

                      {/* Project Tech stack tags */}
                      <div className="space-y-1.5">
                        <label className="block text-xxs font-extrabold text-slate-400 uppercase tracking-wider">Technologies Used</label>
                        <div className="flex flex-wrap gap-1 p-1 bg-slate-500/5 dark:bg-slate-900/20 rounded-lg min-h-[30px]">
                          {proj.technologies?.map((tech, techIdx) => (
                            <Badge key={techIdx} variant="interview" className="text-[10px] !py-0.2 !px-1.5 flex items-center gap-1">
                              {tech}
                              <button type="button" onClick={() => removeProjectTech(projIdx, techIdx)} className="text-red-500 hover:text-red-700 font-bold">&times;</button>
                            </Badge>
                          ))}
                        </div>
                        <div className="flex gap-2">
                          <Input
                            placeholder="Add technology..."
                            value={projectTechInputs[projIdx] || ''}
                            onChange={e => setProjectTechInputs({ ...projectTechInputs, [projIdx]: e.target.value })}
                            className="!py-0.8 !px-2 text-xs flex-1"
                          />
                          <Button
                            type="button"
                            onClick={() => addProjectTech(projIdx)}
                            variant="secondary"
                            size="sm"
                            className="!py-0.8 !px-2.5 text-xs"
                          >
                            Add
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                  {editProjects.length === 0 && (
                    <p className="text-xs text-slate-400 italic text-center py-4">No project items added yet.</p>
                  )}
                </div>
              </div>

              {/* Card: Education */}
              <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-100 dark:border-slate-700 shadow-sm space-y-4">
                <div className="flex items-center justify-between border-b pb-2.5 border-slate-100 dark:border-slate-700 flex-wrap gap-2">
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center">
                    <GraduationCap className="mr-2 h-4.5 w-4.5 text-violet-650" />
                    Education
                  </h3>
                  <Button type="button" onClick={addEducationItem} variant="secondary" size="sm" className="flex items-center gap-1 !py-1 !px-2.5 text-xs">
                    <Plus className="h-3.5 w-3.5" /> Add School
                  </Button>
                </div>

                <div className="space-y-4 max-h-[300px] overflow-y-auto pr-1">
                  {editEducation.map((edu, eduIdx) => (
                    <div key={eduIdx} className="p-4 border border-slate-100 dark:border-slate-700 rounded-xl relative space-y-3 bg-slate-50/20">
                      <button
                        type="button"
                        onClick={() => removeEducationItem(eduIdx)}
                        className="absolute top-3 right-3 text-red-500 hover:text-red-755 p-1"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pr-6">
                        <Input
                          label="Degree/Certificate"
                          placeholder="Bachelor of Science"
                          value={edu.degree}
                          onChange={e => updateEducationItem(eduIdx, 'degree', e.target.value)}
                          className="!py-1 !px-2.5 text-xs"
                        />
                        <Input
                          label="School"
                          placeholder="State University"
                          value={edu.school}
                          onChange={e => updateEducationItem(eduIdx, 'school', e.target.value)}
                          className="!py-1 !px-2.5 text-xs"
                        />
                        <Input
                          label="Field of Study"
                          placeholder="Computer Science"
                          value={edu.fieldOfStudy}
                          onChange={e => updateEducationItem(eduIdx, 'fieldOfStudy', e.target.value)}
                          className="!py-1 !px-2.5 text-xs"
                        />
                        <Input
                          label="Duration / Years"
                          placeholder="2016 - 2020"
                          value={edu.duration}
                          onChange={e => updateEducationItem(eduIdx, 'duration', e.target.value)}
                          className="!py-1 !px-2.5 text-xs"
                        />
                      </div>
                    </div>
                  ))}
                  {editEducation.length === 0 && (
                    <p className="text-xs text-slate-400 italic text-center py-4">No education items added yet.</p>
                  )}
                </div>
              </div>

            </div>

          </div>
        </form>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Premium Upload Loading Screen Overlay */}
      {uploadResumeMutation.isPending && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md z-50 flex flex-col items-center justify-center space-y-4">
          <div className="relative flex items-center justify-center">
            <Sparkles className="h-12 w-12 text-violet-500 animate-pulse" />
            <span className="absolute animate-ping h-16 w-16 rounded-full border-2 border-violet-500 opacity-40" />
          </div>
          <p className="text-white text-base font-black tracking-wide">
            {uploadPhase === 'extracting' ? 'Extracting text from PDF...' : 'Gemini is analyzing structure and parsing sections...'}
          </p>
          <span className="animate-spin h-6 w-6 text-violet-400 rounded-full border-2 border-slate-700 border-t-violet-400" />
        </div>
      )}

      <div className="pb-5 border-b border-slate-200 dark:border-slate-700 text-left">
        <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white">Resume Manager</h1>
        <p className="text-slate-500 dark:text-slate-400 mt-1">
          Upload resumes (PDF/DOCX) to extract core tech stacks, and select which document acts as your default profile target.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Side: Upload Panel */}
        <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-100 dark:border-slate-700 shadow-sm h-fit space-y-4">
          <h3 className="text-lg font-bold text-slate-950 dark:text-white flex items-center">
            <Upload className="mr-2 h-5 w-5 text-violet-650" />
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
                  className="px-4 py-2 bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-200 text-slate-700 dark:text-slate-200 rounded-lg text-xs font-bold cursor-pointer transition select-none disabled:opacity-50"
                >
                  Browse File
                </label>
                <span className="text-xxs text-slate-400 dark:text-slate-400 mt-2 block">
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
              <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center">
                <FileText className="mr-2 h-5 w-5 text-violet-650" />
                Your Stored Resumes
              </h3>
            </div>

            {isListLoading ? (
              <div className="py-12 flex flex-col items-center justify-center space-y-3">
                <Loader2 className="animate-spin h-8 w-8 text-violet-600" />
                <p className="text-xs text-slate-500 font-semibold">Retrieving resumes...</p>
              </div>
            ) : resumes.length === 0 ? (
              <div className="py-12 text-center text-slate-400 dark:text-slate-500 border border-dashed border-slate-200 dark:border-slate-700 rounded-2xl bg-slate-50/20">
                <FileText className="h-10 w-10 mx-auto text-slate-300 mb-2" />
                <p className="text-xs font-bold">No resumes registered.</p>
                <p className="text-xxs text-slate-400 mt-1">Upload a resume file to parse your profile data.</p>
              </div>
            ) : (
              <DataTable
                columns={columns}
                data={resumes}
                pageSize={5}
                searchPlaceholder="Search resumes..."
                searchKeys={['title']}
                selectable
                selectedIds={selectedResumeIds}
                onSelectionChange={setSelectedResumeIds}
                getRowId={(row) => row._id || row.id || ''}
                renderBulkActions={(selectedIds, clearSelection) => (
                  <Button
                    variant="danger"
                    size="sm"
                    isLoading={deleteResumesBulkMutation.isPending}
                    onClick={() => handleBulkDeleteResumes(selectedIds, clearSelection)}
                    className="flex items-center gap-1.5 px-3 py-2 text-xs font-bold"
                  >
                    <Trash2 className="h-4 w-4" /> Delete Selected ({selectedIds.length})
                  </Button>
                )}
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
              <span className="text-xs text-slate-400 dark:text-slate-400">
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
                  <span className="text-xs text-slate-400 italic">No skills extracted.</span>
                )}
              </div>
            </div>

            {/* Extracted Technologies */}
            <div className="space-y-2">
              <h4 className="text-xs font-extrabold text-slate-500 dark:text-slate-400 uppercase tracking-wider flex items-center">
                <Cpu className="mr-1.5 h-4 w-4 text-violet-500" /> Technologies
              </h4>
              <div className="flex flex-wrap gap-1.5">
                {activeResume.technologies && activeResume.technologies.length > 0 ? (
                  activeResume.technologies.map((tag, i) => (
                    <Badge key={i} variant="interview">{tag}</Badge>
                  ))
                ) : (
                  <span className="text-xs text-slate-400 italic">No tech keywords extracted.</span>
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
                  <span className="text-xs text-slate-400 italic">No domains extracted.</span>
                )}
              </div>
            </div>

            {/* AI Action */}
            <div className="pt-4 border-t border-slate-200 dark:border-slate-700 flex justify-end">
              <Button
                variant="primary"
                onClick={() => {
                  navigate(`/copilot?resumeId=${selectedResumeId}`)
                }}
                className="flex items-center gap-1.5"
              >
                <Sparkles className="h-4 w-4" /> Optimize with AI
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
export default ResumeBuilder;
