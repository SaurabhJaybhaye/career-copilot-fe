import React from 'react'
import { 
  BarChart3, 
  TrendingUp, 
  Compass, 
  Briefcase, 
  Calendar, 
  FileText, 
  Percent, 
  Award,
  Sparkles
} from 'lucide-react'
import { 
  useResumeAnalyticsQuery, 
  useApplicationAnalyticsQuery, 
  useSourceAnalyticsQuery, 
  useConversionAnalyticsQuery
} from '@/hooks/useAnalytics'
import type { ResumeAnalyticsItem } from '@/hooks/useAnalytics'

export const Analytics: React.FC = () => {
  const { data: resumeStats = [], isLoading: isResumeLoading } = useResumeAnalyticsQuery()
  const { data: monthlyTrends = [], isLoading: isTrendLoading } = useApplicationAnalyticsQuery()
  const { data: sourceStats = [], isLoading: isSourceLoading } = useSourceAnalyticsQuery()
  const { data: conversionStats, isLoading: isConversionLoading } = useConversionAnalyticsQuery()

  const isPageLoading = isResumeLoading || isTrendLoading || isSourceLoading || isConversionLoading

  // Calculate overall statistics
  const totalApps = conversionStats?.funnel?.applied || 0
  const interviewRate = conversionStats?.rates?.appliedToInterviewRate || 0
  const successRate = conversionStats?.rates?.overallSuccessRate || 0
  const totalOffers = conversionStats?.funnel?.offered || 0

  // custom SVG line chart dimensions
  const svgWidth = 600
  const svgHeight = 250
  const paddingX = 45
  const paddingY = 35

  // Generate path points for Monthly Application Trend
  const getTrendChartData = () => {
    if (monthlyTrends.length === 0) return { path: '', fillPath: '', points: [] }

    const maxVal = Math.max(...monthlyTrends.map(t => t.total), 5) // at least 5 as peak for scale
    const chartW = svgWidth - paddingX * 2
    const chartH = svgHeight - paddingY * 2

    const points = monthlyTrends.map((t, idx) => {
      const x = paddingX + (idx / (monthlyTrends.length - 1 || 1)) * chartW
      const y = svgHeight - paddingY - (t.total / maxVal) * chartH
      return { x, y, label: t.month, val: t.total }
    })

    const path = points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ')
    const fillPath = points.length > 0 
      ? `${path} L ${points[points.length - 1].x} ${svgHeight - paddingY} L ${points[0].x} ${svgHeight - paddingY} Z`
      : ''

    return { path, fillPath, points }
  }

  const { path: trendPath, fillPath: trendFillPath, points: trendPoints } = getTrendChartData()

  return (
    <div className="space-y-6 text-left">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-5 border-b border-slate-205 dark:border-slate-700 gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white flex items-center">
            <BarChart3 className="mr-2.5 h-8 w-8 text-violet-650" />
            Analytics & Conversions
          </h1>
          <p className="text-slate-550 dark:text-slate-400 mt-1">
            Analyze your job hunt metrics, resume response conversions, and platform portals success rates.
          </p>
        </div>
      </div>

      {isPageLoading ? (
        <div className="py-32 flex flex-col items-center justify-center space-y-3 bg-white dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700 shadow-sm">
          <span className="animate-spin h-8 w-8 text-violet-650 rounded-full border-2 border-violet-100 border-t-violet-650" />
          <p className="text-xs text-slate-500 font-semibold">Compiling metrics analysis dashboards...</p>
        </div>
      ) : (
        <>
          {/* Overview Stat Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-5">
            <div className="bg-white dark:bg-slate-800 p-5 rounded-2xl border border-slate-100 dark:border-slate-700 shadow-sm flex items-center justify-between">
              <div className="space-y-1">
                <span className="text-[10px] font-extrabold text-slate-450 dark:text-slate-500 uppercase tracking-wider">
                  Total Applications
                </span>
                <h3 className="text-2xl font-black text-slate-900 dark:text-white leading-none">
                  {totalApps}
                </h3>
              </div>
              <div className="p-3 bg-blue-50 dark:bg-blue-950/20 text-blue-600 dark:text-blue-400 rounded-xl">
                <Briefcase className="h-5 w-5" />
              </div>
            </div>

            <div className="bg-white dark:bg-slate-800 p-5 rounded-2xl border border-slate-100 dark:border-slate-700 shadow-sm flex items-center justify-between">
              <div className="space-y-1">
                <span className="text-[10px] font-extrabold text-slate-450 dark:text-slate-500 uppercase tracking-wider">
                  Interview Conversion
                </span>
                <h3 className="text-2xl font-black text-slate-900 dark:text-white leading-none">
                  {interviewRate}%
                </h3>
              </div>
              <div className="p-3 bg-purple-50 dark:bg-purple-950/20 text-purple-600 dark:text-purple-400 rounded-xl">
                <Percent className="h-5 w-5" />
              </div>
            </div>

            <div className="bg-white dark:bg-slate-800 p-5 rounded-2xl border border-slate-100 dark:border-slate-700 shadow-sm flex items-center justify-between">
              <div className="space-y-1">
                <span className="text-[10px] font-extrabold text-slate-450 dark:text-slate-500 uppercase tracking-wider">
                  Success Offer Rate
                </span>
                <h3 className="text-2xl font-black text-slate-900 dark:text-white leading-none">
                  {successRate}%
                </h3>
              </div>
              <div className="p-3 bg-emerald-50 dark:bg-emerald-950/20 text-emerald-600 dark:text-emerald-400 rounded-xl">
                <Award className="h-5 w-5" />
              </div>
            </div>

            <div className="bg-white dark:bg-slate-800 p-5 rounded-2xl border border-slate-100 dark:border-slate-700 shadow-sm flex items-center justify-between">
              <div className="space-y-1">
                <span className="text-[10px] font-extrabold text-slate-450 dark:text-slate-500 uppercase tracking-wider">
                  Total Job Offers
                </span>
                <h3 className="text-2xl font-black text-slate-900 dark:text-white leading-none">
                  {totalOffers}
                </h3>
              </div>
              <div className="p-3 bg-amber-50 dark:bg-amber-950/20 text-amber-600 dark:text-amber-400 rounded-xl">
                <Sparkles className="h-5 w-5" />
              </div>
            </div>
          </div>

          {/* Monthly Trend & Funnel Row */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* SVG Trend Area */}
            <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-100 dark:border-slate-700 shadow-sm lg:col-span-2 flex flex-col justify-between min-h-[360px]">
              <h3 className="font-extrabold text-slate-805 dark:text-slate-200 text-sm flex items-center mb-3">
                <Calendar className="mr-2 h-4 w-4 text-violet-650" />
                Monthly Application Trends
              </h3>
              
              {monthlyTrends.length === 0 ? (
                <div className="flex-1 flex flex-col items-center justify-center text-slate-450 py-10">
                  <TrendingUp className="h-10 w-10 text-slate-300 mb-2" />
                  <p className="text-xs font-semibold">Track applications across multiple months to generate line trend paths.</p>
                </div>
              ) : (
                <div className="flex-1 flex items-center justify-center w-full overflow-x-auto">
                  <svg viewBox={`0 0 ${svgWidth} ${svgHeight}`} className="w-full max-w-[560px]">
                    <defs>
                      <linearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#7c3aed" stopOpacity="0.25" />
                        <stop offset="100%" stopColor="#7c3aed" stopOpacity="0.00" />
                      </linearGradient>
                    </defs>

                    {/* Horizontal grid lines */}
                    {[0, 0.25, 0.5, 0.75, 1].map((r, i) => (
                      <line 
                        key={i}
                        x1={paddingX} 
                        y1={paddingY + r * (svgHeight - paddingY * 2)} 
                        x2={svgWidth - paddingX} 
                        y2={paddingY + r * (svgHeight - paddingY * 2)} 
                        className="stroke-slate-100 dark:stroke-slate-800/80 stroke-1"
                        strokeDasharray="4 4"
                      />
                    ))}

                    {/* Gradient Area Fill */}
                    {trendFillPath && (
                      <path d={trendFillPath} fill="url(#areaGrad)" />
                    )}

                    {/* Trend Curve Path */}
                    {trendPath && (
                      <path 
                        d={trendPath} 
                        fill="none" 
                        className="stroke-violet-600 dark:stroke-violet-400 stroke-2.5" 
                      />
                    )}

                    {/* Interactive Circles & Labels */}
                    {trendPoints.map((pt, idx) => (
                      <g key={idx}>
                        <circle 
                          cx={pt.x} 
                          cy={pt.y} 
                          r="4.5" 
                          className="fill-violet-600 dark:fill-violet-400 stroke-white dark:stroke-slate-800 stroke-2 hover:r-6 hover:fill-violet-500 transition cursor-pointer"
                        />
                        {/* Value text above dot */}
                        <text
                          x={pt.x}
                          y={pt.y - 8}
                          textAnchor="middle"
                          className="text-[9px] font-black fill-slate-800 dark:fill-slate-350"
                        >
                          {pt.val}
                        </text>
                        {/* Month label below axis line */}
                        <text
                          x={pt.x}
                          y={svgHeight - 12}
                          textAnchor="middle"
                          className="text-[9px] font-bold fill-slate-400 dark:fill-slate-500"
                        >
                          {pt.label.split('-')[1]} ({pt.label.split('-')[0].substring(2)})
                        </text>
                      </g>
                    ))}

                    {/* Bottom Y Axis baseline */}
                    <line 
                      x1={paddingX} 
                      y1={svgHeight - paddingY} 
                      x2={svgWidth - paddingX} 
                      y2={svgHeight - paddingY} 
                      className="stroke-slate-205 dark:stroke-slate-700/80 stroke-1.5"
                    />
                  </svg>
                </div>
              )}
            </div>

            {/* Stage Progress conversion Funnel */}
            <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-100 dark:border-slate-700 shadow-sm flex flex-col justify-between min-h-[360px]">
              <h3 className="font-extrabold text-slate-805 dark:text-slate-200 text-sm flex items-center mb-3">
                <TrendingUp className="mr-2 h-4 w-4 text-violet-650" />
                Outreach Funnel
              </h3>

              {totalApps === 0 ? (
                <div className="flex-1 flex flex-col items-center justify-center text-slate-450 py-10">
                  <BarChart3 className="h-10 w-10 text-slate-300 mb-2" />
                  <p className="text-xs font-semibold">Funnel renders automatically after applications are registered.</p>
                </div>
              ) : (
                <div className="flex-1 flex flex-col justify-center space-y-5">
                  {/* Applied Box */}
                  <div className="p-3 bg-blue-50/50 dark:bg-blue-950/10 border border-blue-100/50 dark:border-blue-900/30 rounded-xl text-center">
                    <div className="text-xs font-bold text-blue-700 dark:text-blue-400">Applications Submitted</div>
                    <div className="text-lg font-black text-slate-900 dark:text-white mt-0.5">{totalApps}</div>
                  </div>

                  {/* Funnel conversion Rate connector 1 */}
                  <div className="flex flex-col items-center -my-2.5">
                    <div className="h-6 w-0.5 bg-slate-200 dark:bg-slate-750" />
                    <span className="bg-violet-50 dark:bg-violet-950/30 border border-violet-100 dark:border-violet-900/50 text-violet-600 dark:text-violet-400 text-[10px] font-black px-2 py-0.5 rounded-full my-0.5">
                      {interviewRate}% screening rate
                    </span>
                    <div className="h-6 w-0.5 bg-slate-200 dark:bg-slate-750" />
                  </div>

                  {/* Interviewing Box */}
                  <div className="p-3 bg-purple-50/50 dark:bg-purple-950/10 border border-purple-100/50 dark:border-purple-900/30 rounded-xl text-center">
                    <div className="text-xs font-bold text-purple-700 dark:text-purple-400">Screening & Interviews</div>
                    <div className="text-lg font-black text-slate-900 dark:text-white mt-0.5">
                      {conversionStats?.funnel?.interviewed || 0}
                    </div>
                  </div>

                  {/* Funnel conversion Rate connector 2 */}
                  <div className="flex flex-col items-center -my-2.5">
                    <div className="h-6 w-0.5 bg-slate-200 dark:bg-slate-750" />
                    <span className="bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-100 dark:border-emerald-900/50 text-emerald-600 dark:text-emerald-400 text-[10px] font-black px-2 py-0.5 rounded-full my-0.5">
                      {conversionStats?.rates?.interviewToOfferRate || 0}% interview success
                    </span>
                    <div className="h-6 w-0.5 bg-slate-200 dark:bg-slate-750" />
                  </div>

                  {/* Offered Box */}
                  <div className="p-3 bg-emerald-50/50 dark:bg-emerald-950/10 border border-emerald-100/50 dark:border-emerald-900/30 rounded-xl text-center">
                    <div className="text-xs font-bold text-emerald-700 dark:text-emerald-400">Offers Secured</div>
                    <div className="text-lg font-black text-slate-900 dark:text-white mt-0.5">{totalOffers}</div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Job Platforms Breakdown & Resume Conversion Matrix */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* SVG platform sources rails */}
            <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-100 dark:border-slate-700 shadow-sm flex flex-col justify-between min-h-[300px]">
              <h3 className="font-extrabold text-slate-805 dark:text-slate-200 text-sm flex items-center mb-3">
                <Compass className="mr-2 h-4 w-4 text-violet-650" />
                Applications by Platform
              </h3>

              {sourceStats.length === 0 ? (
                <div className="flex-1 flex flex-col items-center justify-center text-slate-450 py-10">
                  <Compass className="h-10 w-10 text-slate-300 mb-2" />
                  <p className="text-xs font-semibold">No platform data. Link a posting URL in jobs matches first.</p>
                </div>
              ) : (
                <div className="flex-1 flex flex-col justify-center space-y-4">
                  {sourceStats.slice(0, 5).map((stat, idx) => {
                    const totalShares = Math.max(...sourceStats.map(s => s.count))
                    const percent = totalShares > 0 ? (stat.count / totalShares) * 100 : 0

                    return (
                      <div key={idx} className="space-y-1 text-left">
                        <div className="flex items-center justify-between text-xs font-bold text-slate-750 dark:text-slate-350">
                          <span>{stat.source}</span>
                          <span>{stat.count} apps</span>
                        </div>
                        {/* Horizontal rail bar */}
                        <div className="h-2 w-full bg-slate-100 dark:bg-slate-750 rounded-full overflow-hidden">
                          <div 
                            style={{ width: `${percent}%` }}
                            className="h-full bg-gradient-to-r from-violet-500 to-indigo-500 transition-all duration-500 rounded-full" 
                          />
                        </div>
                      </div>
                    )
                  })}
                </div>
              )}
            </div>

            {/* Resume conversions matrix */}
            <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-100 dark:border-slate-700 shadow-sm lg:col-span-2 flex flex-col justify-between min-h-[300px]">
              <h3 className="font-extrabold text-slate-805 dark:text-slate-200 text-sm flex items-center mb-3">
                <FileText className="mr-2 h-4 w-4 text-violet-650" />
                Resume Performance Leaderboard
              </h3>

              {resumeStats.length === 0 ? (
                <div className="flex-1 flex flex-col items-center justify-center text-slate-450 py-10">
                  <FileText className="h-10 w-10 text-slate-300 mb-2" />
                  <p className="text-xs font-semibold">Verify resume stats by attaching them when creating application trackers.</p>
                </div>
              ) : (
                <div className="flex-1 overflow-x-auto">
                  <table className="w-full text-xs text-left">
                    <thead>
                      <tr className="border-b border-slate-100 dark:border-slate-700 text-slate-400 font-extrabold uppercase tracking-wider text-[10px]">
                        <th className="pb-3.5 pl-2">CV Profile Title</th>
                        <th className="pb-3.5 text-center">Applications</th>
                        <th className="pb-3.5 text-center">Interview Rate</th>
                        <th className="pb-3.5 text-center">Success Rate</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-slate-700/60">
                      {resumeStats.map((item: ResumeAnalyticsItem, idx: number) => (
                        <tr key={idx} className="hover:bg-slate-50/50 dark:hover:bg-slate-900/10">
                          <td className="py-3 pl-2 font-bold text-slate-900 dark:text-white">
                            {item.title}
                          </td>
                          <td className="py-3 text-center font-bold text-slate-700 dark:text-slate-300">
                            {item.totalApplications}
                          </td>
                          <td className="py-3 text-center">
                            <span className="inline-block px-2.5 py-0.5 rounded-lg font-extrabold bg-purple-50 dark:bg-purple-950/20 text-purple-600 dark:text-purple-400 border border-purple-100/50 dark:border-purple-900/30">
                              {item.interviewRate}%
                            </span>
                          </td>
                          <td className="py-3 text-center">
                            <span className="inline-block px-2.5 py-0.5 rounded-lg font-extrabold bg-emerald-50 dark:bg-emerald-950/20 text-emerald-600 dark:text-emerald-400 border border-emerald-100/50 dark:border-emerald-900/30">
                              {item.successRate}%
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  )
}
