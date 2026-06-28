import { createBrowserRouter, Navigate } from 'react-router-dom'
import { ProtectedRoute } from '@/components/ProtectedRoute'
import { AuthLayout } from '@/layouts/AuthLayout'
import { DashboardLayout } from '@/layouts/DashboardLayout'

// Lazy loaded page components/placeholders
import { Login } from '@/pages/Login'
import { Signup } from '@/pages/Signup'
import { ForgotPassword } from '@/pages/ForgotPassword'
import { Dashboard } from '@/pages/Dashboard'
import { ResumeBuilder } from '@/pages/ResumeBuilder'
import { Jobs } from '@/pages/Jobs'
import { Applications } from '@/pages/Applications'
import { Referrals } from '@/pages/Referrals'
import { Analytics } from '@/pages/Analytics'
import { Settings } from '@/pages/Settings'
import { DesignSystem } from '@/pages/DesignSystem'

export const router = createBrowserRouter([
  {
    path: '/',
    element: <Navigate to="/dashboard" replace />,
  },
  // Public auth views
  {
    element: <AuthLayout />,
    children: [
      { path: 'login', element: <Login /> },
      { path: 'signup', element: <Signup /> },
      { path: 'forgot-password', element: <ForgotPassword /> },
    ],
  },
  // Private application views
  {
    element: (
      <ProtectedRoute>
        <DashboardLayout />
      </ProtectedRoute>
    ),
    children: [
      { path: 'dashboard', element: <Dashboard /> },
      { path: 'resume-builder', element: <ResumeBuilder /> },
      { path: 'jobs', element: <Jobs /> },
      { path: 'applications', element: <Applications /> },
      { path: 'referrals', element: <Referrals /> },
      { path: 'analytics', element: <Analytics /> },
      { path: 'settings', element: <Settings /> },
    ],
  },
  // Developer design playground
  {
    path: 'design-system',
    element: <DesignSystem />,
  },
  // Generic redirect fallback
  {
    path: '*',
    element: <Navigate to="/dashboard" replace />,
  },
])
export default router
