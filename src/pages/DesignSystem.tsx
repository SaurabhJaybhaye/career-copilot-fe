import React, { useState } from 'react'
import { toast } from 'react-hot-toast'
import { Play, Trash2, Send, Plus } from 'lucide-react'
import { Button } from '@/components/Button'
import { Input, PasswordInput, SearchInput, TextArea } from '@/components/Input'
import { Select, MultiSelect } from '@/components/Select'
import { Badge } from '@/components/Badge'
import { Modal } from '@/components/Modal'
import { DataTable } from '@/components/DataTable'
import type { Column } from '@/components/DataTable'

// Define data interface for mock applications
interface MockApplication {
  id: string
  company: string
  role: string
  status: 'applied' | 'interviewing' | 'offered' | 'rejected' | 'pending'
  appliedAt: string
  matchScore: number
}

export const DesignSystem: React.FC = () => {
  // Local states for inputs demo
  const [textVal, setTextVal] = useState('')
  const [errorVal, setErrorVal] = useState('')
  const [passwordVal, setPasswordVal] = useState('')
  const [searchVal, setSearchVal] = useState('')
  const [textAreaVal, setTextAreaVal] = useState('')

  // Local states for select dropdowns demo
  const [singleSelect, setSingleSelect] = useState('')
  const [selectedTechs, setSelectedTechs] = useState<string[]>([])

  // Modal open states
  const [isConfirmOpen, setIsConfirmOpen] = useState(false)
  const [isDeleteOpen, setIsDeleteOpen] = useState(false)
  const [isSuccessOpen, setIsSuccessOpen] = useState(false)
  const [selectedAppToDelete, setSelectedAppToDelete] = useState<MockApplication | null>(null)

  // Loading state triggers for buttons
  const [btnLoading, setBtnLoading] = useState(false)

  const triggerToast = () => {
    toast.success('Nice! Design System toast tested successfully!')
  }

  const triggerButtonLoading = () => {
    setBtnLoading(true)
    setTimeout(() => {
      setBtnLoading(false)
      toast.success('Button finished loading state!')
    }, 2000)
  }

  // Multi-select choices
  const techOptions = [
    { value: 'react', label: 'React.js' },
    { value: 'typescript', label: 'TypeScript' },
    { value: 'redux', label: 'Redux Toolkit' },
    { value: 'tailwind', label: 'Tailwind CSS' },
    { value: 'node', label: 'Node.js' },
    { value: 'graphql', label: 'GraphQL' },
  ]

  // Single select options
  const statusOptions = [
    { value: 'applied', label: 'Applied' },
    { value: 'interviewing', label: 'Interviewing' },
    { value: 'offered', label: 'Offered' },
    { value: 'rejected', label: 'Rejected' },
    { value: 'pending', label: 'Pending' },
  ]

  // Mock table data
  const [tableData, setTableData] = useState<MockApplication[]>([
    { id: '1', company: 'Google', role: 'Senior Frontend Engineer', status: 'interviewing', appliedAt: '2026-06-25', matchScore: 92 },
    { id: '2', company: 'Meta', role: 'Staff Product Engineer', status: 'offered', appliedAt: '2026-06-20', matchScore: 95 },
    { id: '3', company: 'Amazon', role: 'Software Dev II', status: 'applied', appliedAt: '2026-06-27', matchScore: 84 },
    { id: '4', company: 'Netflix', role: 'UI Engineer', status: 'rejected', appliedAt: '2026-06-15', matchScore: 78 },
    { id: '5', company: 'Stripe', role: 'Frontend Architect', status: 'pending', appliedAt: '2026-06-28', matchScore: 89 },
    { id: '6', company: 'Microsoft', role: 'TypeScript Developer', status: 'applied', appliedAt: '2026-06-22', matchScore: 87 },
    { id: '7', company: 'Airbnb', role: 'React specialist', status: 'interviewing', appliedAt: '2026-06-24', matchScore: 91 },
  ])

  const handleDeleteRow = (app: MockApplication) => {
    setSelectedAppToDelete(app)
    setIsDeleteOpen(true)
  }

  const confirmDeleteApplication = () => {
    if (selectedAppToDelete) {
      setTableData((prev) => prev.filter((a) => a.id !== selectedAppToDelete.id))
      toast.error(`Removed tracking for ${selectedAppToDelete.company}`)
      setIsDeleteOpen(false)
      setSelectedAppToDelete(null)
    }
  }

  // DataTable column mapping configurations
  const columns: Column<MockApplication>[] = [
    {
      header: 'Company',
      accessor: 'company',
      sortable: true,
    },
    {
      header: 'Role',
      accessor: 'role',
      sortable: true,
    },
    {
      header: 'Match Score',
      accessor: (row) => (
        <div className="flex items-center space-x-2">
          <span className={`font-bold ${row.matchScore >= 90 ? 'text-emerald-600 dark:text-emerald-400' : 'text-indigo-600 dark:text-indigo-400'}`}>
            {row.matchScore}%
          </span>
          <div className="w-16 bg-slate-200 dark:bg-slate-700 h-1.5 rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full ${row.matchScore >= 90 ? 'bg-emerald-500' : 'bg-indigo-500'}`}
              style={{ width: `${row.matchScore}%` }}
            />
          </div>
        </div>
      ),
      sortable: true,
      sortKey: 'matchScore',
    },
    {
      header: 'Applied Date',
      accessor: 'appliedAt',
      sortable: true,
    },
    {
      header: 'Status',
      accessor: (row) => <Badge variant={row.status}>{row.status}</Badge>,
      sortable: true,
      sortKey: 'status',
    },
    {
      header: 'Actions',
      accessor: (row) => (
        <Button
          variant="danger"
          size="sm"
          onClick={() => handleDeleteRow(row)}
          icon={<Trash2 className="h-3.5 w-3.5" />}
          className="px-2 py-1"
        />
      ),
    },
  ]

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 p-6 md:p-10 space-y-10 transition-colors duration-200">
      {/* Header Banner */}
      <div className="pb-6 border-b border-slate-200 dark:border-slate-700 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="text-left">
          <h1 className="text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">Design System Playground</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1">Review the application architecture theme patterns, styles, components, and responsive cards.</p>
        </div>
        <Button 
          onClick={triggerToast}
          variant="primary"
          icon={<Play className="h-4 w-4" />}
          className="self-start md:self-auto cursor-pointer"
        >
          Trigger Sample Toast
        </Button>
      </div>

      {/* Theme Colors */}
      <section className="space-y-4 text-left">
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Color Swatches</h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-4">
          <div className="space-y-1">
            <div className="h-16 rounded-xl bg-violet-650 shadow-sm border border-violet-700/10"></div>
            <span className="text-xs font-bold text-slate-800 dark:text-slate-200">Violet-650 (Primary)</span>
          </div>
          <div className="space-y-1">
            <div className="h-16 rounded-xl bg-violet-500 shadow-sm"></div>
            <span className="text-xs font-bold text-slate-800 dark:text-slate-200">Violet-500 (Primary Light)</span>
          </div>
          <div className="space-y-1">
            <div className="h-16 rounded-xl bg-blue-600 shadow-sm"></div>
            <span className="text-xs font-bold text-slate-800 dark:text-slate-200">Blue-600 (Info)</span>
          </div>
          <div className="space-y-1">
            <div className="h-16 rounded-xl bg-emerald-600 shadow-sm"></div>
            <span className="text-xs font-bold text-slate-800 dark:text-slate-200">Emerald-600 (Success)</span>
          </div>
          <div className="space-y-1">
            <div className="h-16 rounded-xl bg-amber-500 shadow-sm"></div>
            <span className="text-xs font-bold text-slate-800 dark:text-slate-200">Amber-550 (Warning)</span>
          </div>
          <div className="space-y-1">
            <div className="h-16 rounded-xl bg-slate-800 dark:bg-slate-700 shadow-sm"></div>
            <span className="text-xs font-bold text-slate-800 dark:text-slate-200">Slate Dark</span>
          </div>
        </div>
      </section>

      {/* Buttons Showcase */}
      <section className="space-y-4 text-left">
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Buttons Component</h2>
        <div className="p-6 bg-white dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700 space-y-6">
          <div className="flex flex-wrap items-center gap-4">
            <Button variant="primary">Primary Action</Button>
            <Button variant="secondary">Secondary Action</Button>
            <Button variant="danger">Danger Action</Button>
            <Button variant="default">Default Action</Button>
          </div>
          
          <div className="flex flex-wrap items-center gap-4 border-t border-slate-100 dark:border-slate-700 pt-4">
            <Button variant="primary" size="sm">Small</Button>
            <Button variant="primary" size="md">Medium</Button>
            <Button variant="primary" size="lg">Large</Button>
          </div>

          <div className="flex flex-wrap items-center gap-4 border-t border-slate-100 dark:border-slate-700 pt-4">
            <Button variant="primary" isLoading={btnLoading} onClick={triggerButtonLoading}>
              {btnLoading ? 'Processing...' : 'Click to Load'}
            </Button>
            <Button variant="secondary" disabled>Disabled button</Button>
            <Button variant="primary" icon={<Send className="h-4 w-4" />}>Icon Left</Button>
            <Button variant="secondary" icon={<Plus className="h-4 w-4" />} iconPosition="right">Icon Right</Button>
          </div>
        </div>
      </section>

      {/* Inputs Showcase */}
      <section className="space-y-4 text-left">
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Inputs & TextAreas</h2>
        <div className="p-6 bg-white dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700 grid grid-cols-1 md:grid-cols-2 gap-6">
          <Input
            label="Default Input Field"
            placeholder="Type anything..."
            value={textVal}
            onChange={(e) => setTextVal(e.target.value)}
            helperText="Provide standard user details."
          />

          <Input
            label="Input Field with Validation"
            placeholder="Type 'error' to check"
            value={errorVal}
            onChange={(e) => {
              setErrorVal(e.target.value)
            }}
            error={errorVal.toLowerCase() === 'error' ? 'Input triggers validation error!' : ''}
            helperText="Typing 'error' sets error messages dynamically."
          />

          <PasswordInput
            label="Password Input field"
            placeholder="••••••••"
            value={passwordVal}
            onChange={(e) => setPasswordVal(e.target.value)}
            helperText="Check eye icon show/hide mechanics."
          />

          <SearchInput
            label="Search input panel"
            placeholder="Lookup roles..."
            value={searchVal}
            onChange={(e) => setSearchVal(e.target.value)}
            helperText="Embeds visual lookup lens icon."
          />

          <div className="md:col-span-2">
            <TextArea
              label="Multiline Input Text Area"
              placeholder="Paste details..."
              value={textAreaVal}
              onChange={(e) => setTextAreaVal(e.target.value)}
              helperText="Fits cover letters and descriptions."
            />
          </div>
        </div>
      </section>

      {/* Select Box Showcase */}
      <section className="space-y-4 text-left">
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Dropdown Selects</h2>
        <div className="p-6 bg-white dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700 grid grid-cols-1 md:grid-cols-2 gap-6">
          <Select
            label="Single Dropdown Selector"
            options={statusOptions}
            value={singleSelect}
            onChange={(e) => setSingleSelect(e.target.value)}
            placeholder="Choose Application Status"
            helperText="Click items to lock choices."
          />

          <MultiSelect
            label="Multi Dropdown Selector"
            options={techOptions}
            selectedValues={selectedTechs}
            onChange={setSelectedTechs}
            placeholder="Select multiple languages"
            helperText="Allows multiple tags with instant close handles."
          />
        </div>
      </section>

      {/* Badges Showcase */}
      <section className="space-y-4 text-left">
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Badges & Chips</h2>
        <div className="p-6 bg-white dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700 space-y-4">
          <div className="flex flex-col space-y-2">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Application Stages</span>
            <div className="flex flex-wrap gap-3">
              <Badge variant="applied">Applied</Badge>
              <Badge variant="interviewing">Interviewing</Badge>
              <Badge variant="offered">Offered</Badge>
              <Badge variant="rejected">Rejected</Badge>
              <Badge variant="pending">Pending</Badge>
              <Badge variant="withdrawn">Withdrawn</Badge>
            </div>
          </div>
          <div className="flex flex-col space-y-2 border-t border-slate-100 dark:border-slate-700 pt-4">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Semantic States</span>
            <div className="flex flex-wrap gap-3">
              <Badge variant="success">Success</Badge>
              <Badge variant="warning">Warning</Badge>
              <Badge variant="info">Info</Badge>
              <Badge variant="danger">Danger</Badge>
              <Badge variant="default">Default</Badge>
            </div>
          </div>
        </div>
      </section>

      {/* Modals Trigger Demos */}
      <section className="space-y-4 text-left">
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Modals & Overlays</h2>
        <div className="p-6 bg-white dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700 flex flex-wrap gap-4">
          <Button variant="primary" onClick={() => setIsConfirmOpen(true)}>
            Confirmation Modal
          </Button>
          <Button variant="danger" onClick={() => setIsDeleteOpen(true)}>
            Danger Deletion Modal
          </Button>
          <Button variant="default" onClick={() => setIsSuccessOpen(true)}>
            Success Info Modal
          </Button>
        </div>
      </section>

      {/* Data Table Showcase */}
      <section className="space-y-4 text-left">
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Reusable Interactive Data Table</h2>
        <div className="p-6 bg-white dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700">
          <DataTable
            columns={columns}
            data={tableData}
            pageSize={4}
            searchPlaceholder="Search by company or role..."
            searchKeys={['company', 'role']}
            filterKey="status"
            filterOptions={[
              { label: 'Applied', value: 'applied' },
              { label: 'Interviewing', value: 'interviewing' },
              { label: 'Offered', value: 'offered' },
              { label: 'Rejected', value: 'rejected' },
              { label: 'Pending', value: 'pending' },
            ]}
            filterPlaceholder="All Application Statuses"
          />
        </div>
      </section>

      {/* Confirmation Modal Instance */}
      <Modal
        isOpen={isConfirmOpen}
        onClose={() => setIsConfirmOpen(false)}
        title="Register Application Entry"
        variant="default"
        footer={
          <>
            <Button variant="secondary" onClick={() => setIsConfirmOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" onClick={() => {
              toast.success('Confirmed successfully!')
              setIsConfirmOpen(false)
            }}>
              Confirm Submit
            </Button>
          </>
        }
      >
        <p>Would you like to lock this entry in? This schedules a reminder log for outreach details on your timeline.</p>
      </Modal>

      {/* Delete Application Modal Instance */}
      <Modal
        isOpen={isDeleteOpen}
        onClose={() => setIsDeleteOpen(false)}
        title={selectedAppToDelete ? `Delete ${selectedAppToDelete.company} Application` : 'Delete Application'}
        variant="danger"
        footer={
          <>
            <Button variant="secondary" onClick={() => {
              setIsDeleteOpen(false)
              setSelectedAppToDelete(null)
            }}>
              Keep Application
            </Button>
            <Button variant="danger" onClick={confirmDeleteApplication}>
              Delete Permanently
            </Button>
          </>
        }
      >
        <p>Are you absolutely sure you want to remove this application record? This action is permanent and cannot be undone.</p>
      </Modal>

      {/* Success Info Modal Instance */}
      <Modal
        isOpen={isSuccessOpen}
        onClose={() => setIsSuccessOpen(false)}
        title="Resume Parser Audit Completed"
        variant="success"
        footer={
          <Button variant="primary" onClick={() => setIsSuccessOpen(false)}>
            Ok, Great!
          </Button>
        }
      >
        <div className="space-y-3">
          <div className="p-4 bg-emerald-50 dark:bg-emerald-950/20 text-emerald-800 dark:text-emerald-300 border border-emerald-100 dark:border-emerald-900/30 rounded-xl text-xs leading-relaxed">
            Successfully analyzed resume keyword tags! High matching score (89%) aligned.
          </div>
          <p>The parser has successfully extracted 15 technology tags and matched them against your active job profiles. Recommended outreach template generated.</p>
        </div>
      </Modal>
    </div>
  )
}
