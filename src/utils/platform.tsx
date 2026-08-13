import React from 'react'

export interface PlatformInfo {
  name: string
  key: string
  bgClass: string
  textClass: string
  borderClass: string
  icon: React.ReactNode
}

/**
 * Determine the job platform details (LinkedIn, Indeed, Naukri, Glassdoor, Wellfound, etc.)
 * based on job.source or job.url.
 */
export function getJobPlatform(job?: { source?: string | null; url?: string | null } | null): PlatformInfo {
  if (!job) {
    return {
      name: 'Direct / Manual',
      key: 'direct',
      bgClass: 'bg-slate-100 dark:bg-slate-800',
      textClass: 'text-slate-600 dark:text-slate-400',
      borderClass: 'border-slate-200 dark:border-slate-700',
      icon: (
        <svg className="w-3 h-3 text-slate-500 mr-1 opacity-70 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
        </svg>
      )
    }
  }

  const sourceLower = (job.source || '').toLowerCase().trim()
  const urlLower = (job.url || '').toLowerCase().trim()

  // 1. LinkedIn
  if (sourceLower.includes('linkedin') || urlLower.includes('linkedin.com')) {
    return {
      name: 'LinkedIn',
      key: 'linkedin',
      bgClass: 'bg-blue-50 dark:bg-blue-950/40',
      textClass: 'text-blue-700 dark:text-blue-300',
      borderClass: 'border-blue-200 dark:border-blue-800/50',
      icon: (
        <svg className="w-3 h-3 fill-current mr-1 text-blue-600 dark:text-blue-400 flex-shrink-0" viewBox="0 0 24 24">
          <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.46 10.9v8.37H9.25V10.9H6.46M7.86 6.67a1.6 1.6 0 1 0 0 3.2 1.6 1.6 0 0 0 0-3.2Z" />
        </svg>
      )
    }
  }

  // 2. Indeed
  if (sourceLower.includes('indeed') || urlLower.includes('indeed.com')) {
    return {
      name: 'Indeed',
      key: 'indeed',
      bgClass: 'bg-indigo-50 dark:bg-indigo-950/40',
      textClass: 'text-indigo-700 dark:text-indigo-300',
      borderClass: 'border-indigo-200 dark:border-indigo-800/50',
      icon: (
        <svg className="w-3 h-3 fill-current mr-1 text-indigo-600 dark:text-indigo-400 flex-shrink-0" viewBox="0 0 24 24">
          <path d="M11.5 2.5C7.36 2.5 4 5.86 4 10c0 4.14 3.36 7.5 7.5 7.5S19 14.14 19 10c0-4.14-3.36-7.5-7.5-7.5zm.5 12h-2v-5h2v5zm-1-6a1.25 1.25 0 1 1 1.25-1.25A1.25 1.25 0 0 1 11 8.5zm5 8.5h-2v-3.5a1.5 1.5 0 0 0-3 0V17h-2v-5h2v.75a3 3 0 0 1 5 2.25z" />
        </svg>
      )
    }
  }

  // 3. Naukri
  if (sourceLower.includes('naukri') || urlLower.includes('naukri.com')) {
    return {
      name: 'Naukri',
      key: 'naukri',
      bgClass: 'bg-sky-50 dark:bg-sky-950/40',
      textClass: 'text-sky-700 dark:text-sky-300',
      borderClass: 'border-sky-200 dark:border-sky-800/50',
      icon: (
        <svg className="w-3 h-3 fill-current mr-1 text-sky-600 dark:text-sky-400 flex-shrink-0" viewBox="0 0 24 24">
          <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
        </svg>
      )
    }
  }

  // 4. Glassdoor
  if (sourceLower.includes('glassdoor') || urlLower.includes('glassdoor.com')) {
    return {
      name: 'Glassdoor',
      key: 'glassdoor',
      bgClass: 'bg-emerald-50 dark:bg-emerald-950/40',
      textClass: 'text-emerald-700 dark:text-emerald-300',
      borderClass: 'border-emerald-200 dark:border-emerald-800/50',
      icon: (
        <svg className="w-3 h-3 fill-current mr-1 text-emerald-600 dark:text-emerald-400 flex-shrink-0" viewBox="0 0 24 24">
          <path d="M4 4h16v16H4V4zm4 4v8h3V8H8zm5 0v8h3V8h-3z" />
        </svg>
      )
    }
  }

  // 5. Wellfound / AngelList
  if (
    sourceLower.includes('wellfound') ||
    sourceLower.includes('angel') ||
    urlLower.includes('wellfound.com') ||
    urlLower.includes('angel.co')
  ) {
    return {
      name: 'Wellfound',
      key: 'wellfound',
      bgClass: 'bg-amber-50 dark:bg-amber-950/40',
      textClass: 'text-amber-700 dark:text-amber-300',
      borderClass: 'border-amber-200 dark:border-amber-800/50',
      icon: (
        <svg className="w-3 h-3 fill-current mr-1 text-amber-600 dark:text-amber-400 flex-shrink-0" viewBox="0 0 24 24">
          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
        </svg>
      )
    }
  }

  // 6. Monster
  if (sourceLower.includes('monster') || urlLower.includes('monster.com')) {
    return {
      name: 'Monster',
      key: 'monster',
      bgClass: 'bg-purple-50 dark:bg-purple-950/40',
      textClass: 'text-purple-700 dark:text-purple-300',
      borderClass: 'border-purple-200 dark:border-purple-800/50',
      icon: (
        <svg className="w-3 h-3 fill-current mr-1 text-purple-600 dark:text-purple-400 flex-shrink-0" viewBox="0 0 24 24">
          <path d="M12 2a10 10 0 1 0 10 10A10 10 0 0 0 12 2zm1 15h-2v-6h2zm0-8h-2V7h2z" />
        </svg>
      )
    }
  }

  // 7. ZipRecruiter
  if (sourceLower.includes('ziprecruiter') || urlLower.includes('ziprecruiter.com')) {
    return {
      name: 'ZipRecruiter',
      key: 'ziprecruiter',
      bgClass: 'bg-teal-50 dark:bg-teal-950/40',
      textClass: 'text-teal-700 dark:text-teal-300',
      borderClass: 'border-teal-200 dark:border-teal-800/50',
      icon: (
        <svg className="w-3 h-3 fill-current mr-1 text-teal-600 dark:text-teal-400 flex-shrink-0" viewBox="0 0 24 24">
          <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
        </svg>
      )
    }
  }

  // 8. Custom URL Domain
  if (urlLower && urlLower.startsWith('http')) {
    try {
      const hostname = new URL(urlLower).hostname.replace(/^www\./, '')
      const parts = hostname.split('.')
      const domainName = parts.length >= 2 ? parts[parts.length - 2] : hostname
      const formattedName = domainName.charAt(0).toUpperCase() + domainName.slice(1)
      return {
        name: formattedName,
        key: 'custom',
        bgClass: 'bg-violet-50 dark:bg-violet-950/40',
        textClass: 'text-violet-700 dark:text-violet-300',
        borderClass: 'border-violet-200 dark:border-violet-800/50',
        icon: (
          <svg className="w-3 h-3 text-violet-600 dark:text-violet-400 mr-1 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m-9 9a9 9 0 019-9" />
          </svg>
        )
      }
    } catch (e) {
      // fallback
    }
  }

  if (job.source && job.source !== 'manual') {
    const formattedName = job.source.charAt(0).toUpperCase() + job.source.slice(1)
    return {
      name: formattedName,
      key: 'custom',
      bgClass: 'bg-slate-100 dark:bg-slate-800',
      textClass: 'text-slate-700 dark:text-slate-300',
      borderClass: 'border-slate-200 dark:border-slate-700',
      icon: (
        <svg className="w-3 h-3 text-slate-500 mr-1 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
        </svg>
      )
    }
  }

  return {
    name: 'Direct / Manual',
    key: 'direct',
    bgClass: 'bg-slate-100 dark:bg-slate-800',
    textClass: 'text-slate-600 dark:text-slate-400',
    borderClass: 'border-slate-200 dark:border-slate-700',
    icon: (
      <svg className="w-3 h-3 text-slate-400 mr-1 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
      </svg>
    )
  }
}
