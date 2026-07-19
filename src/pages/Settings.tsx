import React, { useState, useEffect } from 'react'
import { toast } from 'react-hot-toast'
import { User as UserIcon, Moon, Sun, Bell, Loader2 } from 'lucide-react'
import { Button } from '@/components/Button'
import { Input } from '@/components/Input'
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

  // Populate local states when backend query updates
  useEffect(() => {
    if (profile) {
      setFirstName(profile.firstName || '')
      setLastName(profile.lastName || '')
      setEmail(profile.email || '')
      if (profile.preferences) {
        setNotificationsEnabled(profile.preferences.notificationsEnabled !== false)
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
        <p className="text-slate-500 dark:text-slate-400 mt-1">Configure profile settings, notifications, and application preferences.</p>
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

        {/* UI and Notification Preferences */}
        <div className="lg:col-span-2 space-y-6">
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
