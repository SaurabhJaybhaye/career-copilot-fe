import React, { useState, useEffect } from 'react'
import { toast } from 'react-hot-toast'
import { Settings as SettingsIcon, Moon, Sun, Bell } from 'lucide-react'

export const Settings: React.FC = () => {
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    return (localStorage.getItem('theme') as 'light' | 'dark') || 'light'
  })
  
  const [notifications, setNotifications] = useState({
    emailAlerts: true,
    weeklyDigest: false,
    interviewReminders: true,
  })

  useEffect(() => {
    const root = window.document.documentElement
    if (theme === 'dark') {
      root.classList.add('dark')
    } else {
      root.classList.remove('dark')
    }
    localStorage.setItem('theme', theme)
  }, [theme])

  const toggleTheme = () => {
    const nextTheme = theme === 'light' ? 'dark' : 'light'
    setTheme(nextTheme)
    toast.success(`Switched to ${nextTheme === 'dark' ? 'Dark' : 'Light'} Mode`)
  }

  const handleSave = () => {
    toast.success('Settings saved successfully!')
  }

  return (
    <div className="space-y-6">
      <div className="pb-5 border-b border-slate-200 dark:border-slate-700">
        <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white">Settings</h1>
        <p className="text-slate-550 dark:text-slate-400 mt-1">Configure profile settings, notifications, and application preferences.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Profile Card */}
        <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-100 dark:border-slate-700 shadow-sm space-y-4">
          <h3 className="text-lg font-bold text-slate-955 dark:text-white flex items-center">
            <SettingsIcon className="mr-2 h-5 w-5 text-violet-550" />
            UI Preferences
          </h3>
          <div className="pt-2">
            <button 
              onClick={toggleTheme}
              className="w-full flex items-center justify-between p-3.5 border border-slate-200 dark:border-slate-700 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-750 transition duration-200 cursor-pointer"
            >
              <span className="text-sm font-semibold text-slate-800 dark:text-slate-200">
                Theme: {theme === 'light' ? 'Light Mode' : 'Dark Mode'}
              </span>
              <div className="p-2 bg-slate-100 dark:bg-slate-700 text-slate-655 dark:text-slate-300 rounded-lg">
                {theme === 'light' ? <Moon className="h-4.5 w-4.5" /> : <Sun className="h-4.5 w-4.5" />}
              </div>
            </button>
          </div>
        </div>

        {/* Notifications & Save Details */}
        <div className="lg:col-span-2 bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-100 dark:border-slate-700 shadow-sm space-y-6">
          <h3 className="text-lg font-bold text-slate-955 dark:text-white flex items-center border-b border-slate-100 dark:border-slate-700 pb-3">
            <Bell className="mr-2 h-5 w-5 text-violet-550" />
            Email Notification Rules
          </h3>
          
          <div className="space-y-4">
            <label className="flex items-start cursor-pointer select-none">
              <input 
                type="checkbox" 
                checked={notifications.emailAlerts}
                onChange={(e) => setNotifications({ ...notifications, emailAlerts: e.target.checked })}
                className="mt-1 h-4 w-4 text-violet-650 focus:ring-violet-500 border-slate-300 rounded cursor-pointer"
              />
              <span className="ml-3 text-left">
                <span className="block text-sm font-bold text-slate-950 dark:text-white">Email alerts</span>
                <span className="block text-xs text-slate-500 mt-0.5">Receive immediate emails for application status modifications.</span>
              </span>
            </label>

            <label className="flex items-start cursor-pointer select-none">
              <input 
                type="checkbox" 
                checked={notifications.weeklyDigest}
                onChange={(e) => setNotifications({ ...notifications, weeklyDigest: e.target.checked })}
                className="mt-1 h-4 w-4 text-violet-655 focus:ring-violet-500 border-slate-300 rounded cursor-pointer"
              />
              <span className="ml-3 text-left">
                <span className="block text-sm font-bold text-slate-950 dark:text-white">Weekly digest reports</span>
                <span className="block text-xs text-slate-500 mt-0.5">Summary of matching scores and analytics metrics.</span>
              </span>
            </label>

            <label className="flex items-start cursor-pointer select-none">
              <input 
                type="checkbox" 
                checked={notifications.interviewReminders}
                onChange={(e) => setNotifications({ ...notifications, interviewReminders: e.target.checked })}
                className="mt-1 h-4 w-4 text-violet-655 focus:ring-violet-500 border-slate-300 rounded cursor-pointer"
              />
              <span className="ml-3 text-left">
                <span className="block text-sm font-bold text-slate-950 dark:text-white">Interview reminders</span>
                <span className="block text-xs text-slate-500 mt-0.5">Remind me 24 hours prior to scheduled interviews.</span>
              </span>
            </label>
          </div>

          <div className="pt-4 border-t border-slate-100 dark:border-slate-700 flex justify-end">
            <button 
              onClick={handleSave}
              className="px-5 py-2.5 bg-violet-650 hover:bg-violet-755 text-white font-semibold rounded-lg text-sm transition shadow-sm cursor-pointer"
            >
              Save Settings
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
