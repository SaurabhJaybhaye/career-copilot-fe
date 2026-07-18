import { lazy } from 'react'
import { createBrowserRouter, Navigate } from 'react-router-dom'
import { ProtectedRoute } from '@/components/ProtectedRoute'
import { AuthLayout } from '@/layouts/AuthLayout'
import { DashboardLayout } from '@/layouts/DashboardLayout'

// Lazy loaded page components/placeholders
const Login = lazy(() => import('@/pages/Login').then(m => ({ default: m.Login })))
const Signup = lazy(() => import('@/pages/Signup').then(m => ({ default: m.Signup })))
const ForgotPassword = lazy(() => import('@/pages/ForgotPassword').then(m => ({ default: m.ForgotPassword })))
const Dashboard = lazy(() => import('@/pages/Dashboard').then(m => ({ default: m.Dashboard })))
const ResumeBuilder = lazy(() => import('@/pages/ResumeBuilder').then(m => ({ default: m.ResumeBuilder })))
const Jobs = lazy(() => import('@/pages/Jobs').then(m => ({ default: m.Jobs })))
const Applications = lazy(() => import('@/pages/Applications').then(m => ({ default: m.Applications })))
const Referrals = lazy(() => import('@/pages/Referrals').then(m => ({ default: m.Referrals })))
const Analytics = lazy(() => import('@/pages/Analytics').then(m => ({ default: m.Analytics })))
const Settings = lazy(() => import('@/pages/Settings').then(m => ({ default: m.Settings })))
const DesignSystem = lazy(() => import('@/pages/DesignSystem').then(m => ({ default: m.DesignSystem })))
const AICopilot = lazy(() => import('@/pages/AICopilot').then(m => ({ default: m.AICopilot })))

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
      { path: 'copilot', element: <AICopilot /> },
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
