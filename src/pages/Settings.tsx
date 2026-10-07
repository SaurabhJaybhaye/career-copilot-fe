import React, { useState, useEffect } from 'react'
import { toast } from 'react-hot-toast'
import { User as UserIcon, Moon, Sun, Bell, Loader2, Zap, Laptop, ShieldCheck } from 'lucide-react'
import { Button } from '@/components/Button'
import { Input } from '@/components/Input'
import { Select } from '@/components/Select'
import { useProfileQuery, useUpdateProfileMutation } from '@/hooks/useProfile'

export const Settings: React.FC = () => {
  const { data: profile, isLoading } = useProfileQuery()
  const updateProfileMutation = useUpdateProfileMutation()

  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [email, setEmail] = useState('')
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    return (localStorage.getItem('theme') as 'light' | 'dark') || 'light'
  })
  const [notificationsEnabled, setNotificationsEnabled] = useState(true)

  // Auto-Apply Profile State
  const [linkedinCookie, setLinkedinCookie] = useState('')
  const [phone, setPhone] = useState('')
  const [location, setLocation] = useState('')
  const [workAuthorization, setWorkAuthorization] = useState('US_CITIZEN')
  const [yearsOfExperience, setYearsOfExperience] = useState(3)
  const [browserHeadless, setBrowserHeadless] = useState(false)

  // Populate local states when backend query updates
  useEffect(() => {
    if (profile) {
      setFirstName(profile.firstName || '')
      setLastName(profile.lastName || '')
      setEmail(profile.email || '')
      if (profile.preferences) {
        setNotificationsEnabled(profile.preferences.notificationsEnabled !== false)
      }
      if (profile.autoApplyProfile) {
        setLinkedinCookie(profile.autoApplyProfile.linkedinCookie || '')
        setPhone(profile.autoApplyProfile.phone || '')
        setLocation(profile.autoApplyProfile.location || '')
        setWorkAuthorization(profile.autoApplyProfile.workAuthorization || 'US_CITIZEN')
        setYearsOfExperience(profile.autoApplyProfile.yearsOfExperience ?? 3)
        setBrowserHeadless(profile.autoApplyProfile.browserHeadless === true)
      }
    }
  }, [profile])

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!firstName.trim() || !lastName.trim()) {
      toast.error('First Name and Last Name are required.')
      return
    }

    try {
      await updateProfileMutation.mutateAsync({
        firstName,
        lastName,
      })
      toast.success('Profile details saved successfully!')
    } catch (err: any) {
      toast.error(err.message || 'Failed to save profile details.')
    }
  }

  const handleSaveAutoApplySettings = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      await updateProfileMutation.mutateAsync({
        autoApplyProfile: {
          linkedinCookie: linkedinCookie.trim(),
          phone: phone.trim(),
          location: location.trim(),
          workAuthorization,
          yearsOfExperience: Number(yearsOfExperience),
          browserHeadless,
        },
      })
      toast.success('Auto-Apply credentials and browser settings saved!')
    } catch (err: any) {
      toast.error(err.message || 'Failed to save auto-apply settings.')
    }
  }

  const toggleTheme = () => {
    const nextTheme = theme === 'light' ? 'dark' : 'light'
    const root = window.document.documentElement
    if (nextTheme === 'dark') {
      root.classList.add('dark')
    } else {
      root.classList.remove('dark')
    }
    localStorage.setItem('theme', nextTheme)
    setTheme(nextTheme)
    toast.success(`Switched to ${nextTheme === 'dark' ? 'Dark' : 'Light'} Mode`)
  }

  const handleSaveNotifications = async () => {
    try {
      await updateProfileMutation.mutateAsync({
        preferences: {
          notificationsEnabled,
        },
      })
      toast.success('Notification preferences updated!')
    } catch (err: any) {
      toast.error(err.message || 'Failed to update notification rules.')
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-[50vh] flex flex-col items-center justify-center space-y-4">
        <Loader2 className="animate-spin h-10 w-10 text-violet-600" />
        <p className="text-sm font-semibold text-slate-500">Loading settings profile...</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="pb-5 border-b border-slate-200 dark:border-slate-700 text-left">
        <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white">Settings</h1>
        <p className="text-slate-500 dark:text-slate-400 mt-1">Configure profile settings, auto-apply credentials, and application preferences.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Profile Card details */}
        <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-100 dark:border-slate-700 shadow-sm space-y-4 h-fit">
          <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center">
            <UserIcon className="mr-2 h-5 w-5 text-violet-650" />
            Profile Details
          </h3>
          
          <form onSubmit={handleSaveProfile} className="space-y-4">
            <Input
              label="First Name"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              disabled={updateProfileMutation.isPending}
              required
            />
            <Input
              label="Last Name"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              disabled={updateProfileMutation.isPending}
              required
            />
            <Input
              label="Email Address"
              value={email}
              disabled
              helperText="Email address cannot be changed."
            />

            <Button
              type="submit"
              variant="primary"
              className="w-full justify-center"
              isLoading={updateProfileMutation.isPending}
            >
              Update Profile
            </Button>
          </form>
        </div>

        {/* Preferences & Auto-Apply Settings Column */}
        <div className="lg:col-span-2 space-y-6">
          {/* ⚡ 1-Click Auto-Apply & Browser Automation Settings Card */}
          <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-100 dark:border-slate-700 shadow-sm space-y-6">
            <div className="border-b border-slate-100 dark:border-slate-700 pb-3 text-left">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center">
                <Zap className="mr-2 h-5 w-5 text-amber-500 fill-amber-500" />
                1-Click Auto-Apply & Browser Automation Settings
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                Configure credentials used by the browser engine to navigate to job postings and apply through your accounts.
              </p>
            </div>

            <form onSubmit={handleSaveAutoApplySettings} className="space-y-5 text-left">
              {/* LinkedIn li_at Session Cookie */}
              <div className="space-y-1.5">
                <Input
                  label="LinkedIn Session Cookie (li_at)"
                  type="password"
                  value={linkedinCookie}
                  onChange={(e) => setLinkedinCookie(e.target.value)}
                  placeholder="AQEDATk4... (paste your li_at cookie)"
                  helperText="Required to submit LinkedIn Easy Apply jobs through your own profile. Stored securely and bypasses 2FA/CAPTCHAs."
                />
              </div>

              {/* Phone & Location */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input
                  label="Contact Phone Number"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+1 (555) 123-4567"
                  helperText="Pre-filled into application contact forms."
                />
                <Input
                  label="Current Location / City"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="San Francisco, CA or Remote"
                  helperText="Used for location verification."
                />
              </div>

              {/* Work Auth & Years of Experience */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Select
                  label="Work Authorization Status"
                  value={workAuthorization}
                  onChange={(e) => setWorkAuthorization(e.target.value)}
                  options={[
                    { value: 'US_CITIZEN', label: 'US Citizen / National' },
                    { value: 'GREEN_CARD', label: 'Permanent Resident (Green Card)' },
                    { value: 'NEED_SPONSORSHIP', label: 'Requires Sponsorship (H-1B, OPT)' },
                    { value: 'EU_CITIZEN', label: 'EU Work Authorization' },
                    { value: 'OTHER', label: 'Other Authorized' },
                  ]}
                />
                <Input
                  label="Total Years of Experience"
                  type="number"
                  value={String(yearsOfExperience)}
                  onChange={(e) => setYearsOfExperience(Number(e.target.value) || 0)}
                  placeholder="5"
                />
              </div>

              {/* Browser Mode Toggle */}
              <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-700/40 border border-slate-200 dark:border-slate-700 space-y-2">
                <label className="flex items-start cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={!browserHeadless}
                    onChange={(e) => setBrowserHeadless(!e.target.checked)}
                    className="mt-1 h-4 w-4 text-violet-650 focus:ring-violet-500 border-slate-300 rounded cursor-pointer accent-violet-600"
                  />
                  <span className="ml-3 text-left">
                    <span className="block text-sm font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                      <Laptop className="h-4 w-4 text-violet-600" />
                      Visible Browser Window (Watch in real-time)
                    </span>
                    <span className="block text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                      When enabled, launches a visible Chromium window on your screen so you can observe the bot navigating, filling, and submitting applications.
                    </span>
                  </span>
                </label>
              </div>

              <div className="flex justify-end pt-2 border-t border-slate-100 dark:border-slate-700">
                <Button
                  type="submit"
                  variant="primary"
                  isLoading={updateProfileMutation.isPending}
                  className="flex items-center gap-1.5 font-bold"
                >
                  <ShieldCheck className="h-4 w-4" /> Save Auto-Apply Credentials
                </Button>
              </div>
            </form>
          </div>

          {/* UI Preferences Card */}
          <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-100 dark:border-slate-700 shadow-sm space-y-4">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center">
              <Sun className="mr-2 h-5 w-5 text-violet-650" />
              UI Preferences
            </h3>
            <div className="pt-2">
              <button 
                onClick={toggleTheme}
                disabled={updateProfileMutation.isPending}
                className="w-full flex items-center justify-between p-3.5 border border-slate-200 dark:border-slate-700 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-700 transition duration-200 cursor-pointer disabled:opacity-50"
              >
                <span className="text-sm font-semibold text-slate-800 dark:text-slate-200">
                  Theme: {theme === 'light' ? 'Light Mode' : 'Dark Mode'}
                </span>
                <div className="p-2 bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 rounded-lg">
                  {theme === 'light' ? <Moon className="h-4.5 w-4.5" /> : <Sun className="h-4.5 w-4.5" />}
                </div>
              </button>
            </div>
          </div>

          {/* Notifications Card */}
          <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-100 dark:border-slate-700 shadow-sm space-y-6">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center border-b border-slate-100 dark:border-slate-700 pb-3">
              <Bell className="mr-2 h-5 w-5 text-violet-650" />
              Notification Settings
            </h3>
            
            <div className="space-y-4 text-left">
              <label className="flex items-start cursor-pointer select-none">
                <input 
                  type="checkbox" 
                  checked={notificationsEnabled}
                  onChange={(e) => setNotificationsEnabled(e.target.checked)}
                  disabled={updateProfileMutation.isPending}
                  className="mt-1 h-4 w-4 text-violet-650 focus:ring-violet-500 border-slate-300 rounded cursor-pointer disabled:opacity-50"
                />
                <span className="ml-3 text-left">
                  <span className="block text-sm font-bold text-slate-950 dark:text-white">Email alerts</span>
                  <span className="block text-xs text-slate-500 mt-0.5">Receive immediate email status updates when applications change pipeline states.</span>
                </span>
              </label>
            </div>

            <div className="pt-4 border-t border-slate-100 dark:border-slate-700 flex justify-end">
              <Button 
                onClick={handleSaveNotifications}
                variant="primary"
                isLoading={updateProfileMutation.isPending}
              >
                Save Preferences
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
