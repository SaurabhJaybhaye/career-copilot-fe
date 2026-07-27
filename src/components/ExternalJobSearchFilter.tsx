import React, { useState } from 'react'
import { Search, Globe, RefreshCw } from 'lucide-react'
import { Button } from './Button'
import { Input } from './Input'
import { Select } from './Select'
import type { FetchExternalJobsPayload } from '@/hooks/useJobs'

export interface ExternalJobSearchFilterProps {
  onSearch: (payload: FetchExternalJobsPayload) => void
  isLoading?: boolean
}

export const ExternalJobSearchFilter: React.FC<ExternalJobSearchFilterProps> = ({
  onSearch,
  isLoading = false,
}) => {
  const [title, setTitle] = useState('')
  const [portal, setPortal] = useState<'linkedin' | 'indeed'>('linkedin')
  const [location, setLocation] = useState('')
  const [postedOn, setPostedOn] = useState<'24h' | 'past_week' | 'past_month' | ''>('')
  const [experienceLevel, setExperienceLevel] = useState<
    'internship' | 'entry_level' | 'associate' | 'mid_senior' | 'director' | 'executive' | ''
  >('')
  const [limit, setLimit] = useState<number>(10)
  const [titleError, setTitleError] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!title.trim()) {
      setTitleError('Job title search query is required')
      return
    }
    setTitleError('')

    const payload: FetchExternalJobsPayload = {
      title: title.trim(),
      portal,
      location: location.trim() || undefined,
      postedOn: postedOn || undefined,
      experienceLevel: experienceLevel || undefined,
      limit: Math.min(Math.max(Number(limit) || 10, 1), 50),
      saveToDb: true,
    }

    onSearch(payload)
  }

  return (
    <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-100 dark:border-slate-700 shadow-sm text-left">
      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Top Header & Portal Selector */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-slate-100 dark:border-slate-700/60">
          <div>
            <h3 className="text-lg font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
              <Globe className="h-5 w-5 text-violet-650" /> Live Multi-Portal Job Scraper
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Instantly fetch actively posted target jobs across LinkedIn and Indeed with real-time AI parsing.
            </p>
          </div>

          {/* Portal Switcher Pill */}
          <div className="flex items-center p-1 bg-slate-100 dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700 select-none">
            <button
              type="button"
              onClick={() => setPortal('linkedin')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 ${
                portal === 'linkedin'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.46 10.9v8.37H9.25V10.9H6.46M7.86 6.77a1.45 1.45 0 1 0 0 2.9 1.45 1.45 0 0 0 0-2.9z" />
              </svg>
              LinkedIn
            </button>
            <button
              type="button"
              onClick={() => setPortal('indeed')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 ${
                portal === 'indeed'
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                <path d="M11.5 3C6.25 3 2 7.25 2 12.5S6.25 22 11.5 22 21 17.75 21 12.5 16.75 3 11.5 3zm0 16.5A6.5 6.5 0 1 1 18 12.5 6.51 6.51 0 0 1 11.5 19.5z"/>
              </svg>
              Indeed
            </button>
          </div>
        </div>

        {/* Primary Filter Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            label="Job Title Keywords"
            placeholder="e.g. Senior Frontend Engineer, Full Stack, Product Manager"
            value={title}
            onChange={(e) => {
              setTitle(e.target.value)
              if (titleError) setTitleError('')
            }}
            error={titleError}
            required
          />

          <Input
            label="Target Location"
            placeholder="e.g. Remote, San Francisco CA, New York NY"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
          />
        </div>

        {/* Secondary Filters Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Select
            label="Date Posted"
            value={postedOn}
            onChange={(e) => setPostedOn(e.target.value as any)}
            placeholder="Anytime"
            options={[
              { value: '24h', label: 'Past 24 Hours' },
              { value: 'past_week', label: 'Past Week' },
              { value: 'past_month', label: 'Past Month' },
            ]}
          />

          <Select
            label="Experience Level"
            value={experienceLevel}
            onChange={(e) => setExperienceLevel(e.target.value as any)}
            placeholder="Any Experience Level"
            options={[
              { value: 'internship', label: 'Internship' },
              { value: 'entry_level', label: 'Entry Level' },
              { value: 'associate', label: 'Associate' },
              { value: 'mid_senior', label: 'Mid-Senior Level' },
              { value: 'director', label: 'Director' },
              { value: 'executive', label: 'Executive' },
            ]}
          />

          <div className="w-full text-left space-y-1.5">
            <label className="block text-sm font-bold text-slate-700 dark:text-slate-200">
              Max Results Limit (1 - 50)
            </label>
            <input
              type="number"
              min={1}
              max={50}
              value={limit}
              onChange={(e) => setLimit(Number(e.target.value))}
              className="appearance-none block w-full px-4 py-3 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white bg-white dark:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-violet-500 text-sm shadow-sm"
            />
          </div>
        </div>

        {/* Submit Actions */}
        <div className="flex items-center justify-end pt-2">
          <Button
            type="submit"
            variant="primary"
            isLoading={isLoading}
            className="w-full sm:w-auto px-6 py-2.5 flex items-center justify-center gap-2"
          >
            {isLoading ? (
              <>
                <RefreshCw className="h-4 w-4 animate-spin" /> Scraping External Jobs...
              </>
            ) : (
              <>
                <Search className="h-4 w-4" /> Fetch Live Jobs
              </>
            )}
          </Button>
        </div>
      </form>
    </div>
  )
}
