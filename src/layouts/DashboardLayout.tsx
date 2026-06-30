import React, { useState } from 'react'
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom'
import { 
  LayoutDashboard, 
  FileText, 
  Briefcase, 
  KanbanSquare, 
  Users, 
  BarChart3, 
  Settings, 
  LogOut, 
  Menu, 
  X, 
  User,
  Bell,
  Clock,
  Trash2
} from 'lucide-react'

import { useAppDispatch } from '@/hooks/store'
import { clearCredentials } from '@/features/auth/authSlice'
import { 
  useNotificationsQuery, 
  useCreateNotificationMutation,
  useMarkAllReadMutation, 
  useMarkReadMutation, 
  useDeleteNotificationMutation 
} from '@/hooks/useNotifications'
import { useUpcomingActionsQuery } from '@/hooks/useDashboard'

export const DashboardLayout: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [notifOpen, setNotifOpen] = useState(false)

  const { data: notifications = [] } = useNotificationsQuery()
  const createNotificationMutation = useCreateNotificationMutation()
  const markAllReadMutation = useMarkAllReadMutation()
  const markReadMutation = useMarkReadMutation()
  const deleteNotifMutation = useDeleteNotificationMutation()

  const { data: upcomingActions } = useUpcomingActionsQuery()

  const unreadCount = notifications.filter((n) => !n.isRead).length

  // Automatically scan upcoming follow-ups and generate database notifications for items due within 24h
  React.useEffect(() => {
    const followups = upcomingActions?.followups || []
    if (followups.length === 0) return

    const now = new Date().getTime()
    const checkAndTriggerNotifications = async () => {
      for (const item of followups) {
        const dueDate = new Date(item.dueDate).getTime()
        const diffMs = dueDate - now
        const oneDayMs = 24 * 60 * 60 * 1000

        // If the followup is due within the next 24 hours (or is already overdue)
        if (diffMs <= oneDayMs) {
          const titleToFind = `Reminder: ${item.title}`
          const exists = notifications.some(
            (n) => n.title === titleToFind
          )

          if (!exists) {
            try {
              await createNotificationMutation.mutateAsync({
                title: titleToFind,
                message: item.description || `Follow-up reminder due at ${new Date(item.dueDate).toLocaleTimeString()}`,
                type: 'warning'
              })
            } catch (err) {
              console.error('Failed to auto-generate notification:', err)
            }
          }
        }
      }
    }

    checkAndTriggerNotifications()
  }, [upcomingActions?.followups, notifications, createNotificationMutation])
  const location = useLocation()
  const navigate = useNavigate()
  const dispatch = useAppDispatch()
  
  const handleLogout = () => {
    dispatch(clearCredentials())
    navigate('/login')
  }

  const menuItems = [
    { path: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { path: '/resume-builder', label: 'Resume Builder', icon: FileText },
    { path: '/jobs', label: 'Jobs', icon: Briefcase },
    { path: '/applications', label: 'Applications', icon: KanbanSquare },
    { path: '/referrals', label: 'Referrals', icon: Users },
    { path: '/analytics', label: 'Analytics', icon: BarChart3 },
    { path: '/settings', label: 'Settings', icon: Settings },
  ]

  return (
    <div className="h-screen bg-slate-50 dark:bg-slate-900 flex overflow-hidden transition-colors duration-200">
      {/* Sidebar for Desktop */}
      <aside className="hidden md:flex md:w-64 flex-col bg-white dark:bg-slate-800 border-r border-slate-200 dark:border-slate-700 overflow-y-auto">
        <div className="h-16 flex items-center px-6 border-b border-slate-200 dark:border-slate-700">
          <span className="text-xl font-bold bg-gradient-to-r from-violet-600 to-indigo-600 dark:from-violet-400 dark:to-indigo-400 bg-clip-text text-transparent">
            Career Copilot
          </span>
        </div>
        <nav className="flex-1 px-4 py-6 space-y-1">
          {menuItems.map((item) => {
            const Icon = item.icon
            const isActive = location.pathname === item.path
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center px-4 py-3 text-sm font-medium rounded-xl transition-all duration-200 ${
                  isActive
                    ? 'bg-violet-50 dark:bg-violet-900/30 text-violet-600 dark:text-violet-400'
                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-700/50 hover:text-slate-900 dark:hover:text-slate-100'
                }`}
              >
                <Icon className="mr-3 h-5 w-5" />
                {item.label}
              </Link>
            )
          })}
        </nav>
        <div className="p-4 border-t border-slate-200 dark:border-slate-700">
          <button
            onClick={handleLogout}
            className="flex w-full items-center px-4 py-3 text-sm font-medium text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/30 rounded-xl transition-all duration-200"
          >
            <LogOut className="mr-3 h-5 w-5" />
            Logout
          </button>
        </div>
      </aside>

      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 z-40 bg-slate-900/40 backdrop-blur-sm md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Mobile Sidebar */}
      <aside className={`fixed inset-y-0 left-0 z-50 w-64 bg-white dark:bg-slate-800 border-r border-slate-200 dark:border-slate-700 flex flex-col overflow-y-auto transform transition-transform duration-300 ease-in-out md:hidden ${
        sidebarOpen ? 'translate-x-0' : '-translate-x-full'
      }`}>
        <div className="h-16 flex items-center justify-between px-6 border-b border-slate-200 dark:border-slate-700">
          <span className="text-xl font-bold bg-gradient-to-r from-violet-600 to-indigo-600 dark:from-violet-400 dark:to-indigo-400 bg-clip-text text-transparent">
            Career Copilot
          </span>
          <button 
            onClick={() => setSidebarOpen(false)}
            className="p-1.5 rounded-lg text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-700"
          >
            <X className="h-6 w-6" />
          </button>
        </div>
        <nav className="flex-1 px-4 py-6 space-y-1">
          {menuItems.map((item) => {
            const Icon = item.icon
            const isActive = location.pathname === item.path
            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setSidebarOpen(false)}
                className={`flex items-center px-4 py-3 text-sm font-medium rounded-xl transition-all duration-200 ${
                  isActive
                    ? 'bg-violet-50 dark:bg-violet-900/30 text-violet-600 dark:text-violet-400'
                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-700/50 hover:text-slate-900 dark:hover:text-slate-100'
                }`}
              >
                <Icon className="mr-3 h-5 w-5" />
                {item.label}
              </Link>
            )
          })}
        </nav>
        <div className="p-4 border-t border-slate-200 dark:border-slate-700">
          <button
            onClick={handleLogout}
            className="flex w-full items-center px-4 py-3 text-sm font-medium text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/30 rounded-xl transition-all duration-200"
          >
            <LogOut className="mr-3 h-5 w-5" />
            Logout
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Header/Navbar */}
        <header className="h-16 bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 flex items-center justify-between px-6 z-10 transition-colors duration-200">
          <button
            onClick={() => setSidebarOpen(true)}
            className="p-1.5 rounded-lg text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-700 md:hidden"
          >
            <Menu className="h-6 w-6" />
          </button>
          
          <div className="hidden md:block text-sm text-slate-550 dark:text-slate-400 font-medium">
            Welcome back to Career Copilot!
          </div>

          <div className="flex items-center space-x-4">
            {/* Notification Bell Dropdown */}
            <div className="relative">
              <button
                onClick={() => setNotifOpen(!notifOpen)}
                className="relative p-1.5 rounded-lg text-slate-600 dark:text-slate-355 hover:bg-slate-100 dark:hover:bg-slate-700 transition cursor-pointer focus:outline-none"
                title="Notifications Log"
              >
                <Bell className="h-5 w-5" />
                {unreadCount > 0 && (
                  <span className="absolute top-1.5 right-1.5 block h-2 w-2 rounded-full bg-red-500 ring-2 ring-white dark:ring-slate-800 animate-pulse" />
                )}
              </button>

              {notifOpen && (
                <>
                  <div 
                    className="fixed inset-0 z-20"
                    onClick={() => setNotifOpen(false)}
                  />
                  <div className="absolute right-0 mt-2 w-80 bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-2xl z-30 flex flex-col max-h-[380px] overflow-hidden transform origin-top-right animate-in fade-in slide-in-from-top-1">
                    {/* Header */}
                    <div className="px-4 py-2.5 bg-slate-50 dark:bg-slate-900/40 border-b border-slate-150 dark:border-slate-700 flex items-center justify-between">
                      <span className="text-xs font-black text-slate-800 dark:text-slate-200">
                        Notifications ({unreadCount})
                      </span>
                      {unreadCount > 0 && (
                        <button
                          onClick={() => markAllReadMutation.mutate()}
                          disabled={markAllReadMutation.isPending}
                          className="text-[10px] font-bold text-violet-650 hover:text-violet-500 hover:underline dark:text-violet-400 cursor-pointer disabled:opacity-50"
                        >
                          Mark all read
                        </button>
                      )}
                    </div>

                    {/* Scrollable list */}
                    <div className="flex-1 overflow-y-auto divide-y divide-slate-100 dark:divide-slate-700/60 max-h-[280px]">
                      {notifications.length === 0 ? (
                        <div className="py-10 text-center text-slate-400 dark:text-slate-500 text-xs">
                          No notifications yet.
                        </div>
                      ) : (
                        notifications.map((item) => {
                          const id = item._id || item.id || ''
                          
                          // Border colors based on types
                          const typeBorders = {
                            info: 'border-l-blue-500',
                            success: 'border-l-emerald-500',
                            warning: 'border-l-amber-500',
                            reminder: 'border-l-amber-500',
                            error: 'border-l-red-500'
                          }

                          return (
                            <div 
                              key={id}
                              className={`p-3 text-left border-l-4 ${typeBorders[item.type] || 'border-l-slate-400'} ${
                                item.isRead 
                                  ? 'bg-white dark:bg-slate-800 opacity-60' 
                                  : 'bg-violet-50/20 dark:bg-violet-950/5 hover:bg-slate-50 dark:hover:bg-slate-700/50'
                              } transition flex items-start justify-between space-x-2`}
                            >
                              <div 
                                className="flex-1 min-w-0 cursor-pointer"
                                onClick={() => !item.isRead && markReadMutation.mutate(id)}
                              >
                                <p className="text-[11px] font-bold text-slate-900 dark:text-white truncate">
                                  {item.title}
                                </p>
                                <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5 leading-tight break-words">
                                  {item.message}
                                </p>
                                <p className="text-[9px] text-slate-400 mt-1 flex items-center">
                                  <Clock className="h-3 w-3 mr-0.5" />
                                  {new Date(item.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                                </p>
                              </div>
                              <button
                                onClick={() => deleteNotifMutation.mutate(id)}
                                disabled={deleteNotifMutation.isPending}
                                className="p-1 text-slate-400 hover:text-red-500 dark:hover:text-red-400 transition cursor-pointer border-none bg-transparent"
                                title="Delete alert"
                              >
                                <Trash2 className="h-3.5 w-3.5" />
                              </button>
                            </div>
                          )
                        })
                      )}
                    </div>
                  </div>
                </>
              )}
            </div>

            <Link 
              to="/settings"
              className="flex items-center space-x-2 p-1.5 rounded-lg text-slate-600 dark:text-slate-350 hover:bg-slate-100 dark:hover:bg-slate-700 transition-all duration-200"
            >
              <User className="h-5 w-5" />
              <span className="text-sm font-medium hidden sm:inline">Profile</span>
            </Link>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto p-6 md:p-8">
          <div className="max-w-7xl mx-auto space-y-6">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  )
}
