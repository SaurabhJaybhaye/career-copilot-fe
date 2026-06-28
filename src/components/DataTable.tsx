import React, { useState, useMemo } from 'react'
import { ArrowUpDown, ArrowUp, ArrowDown, ChevronLeft, ChevronRight, Search } from 'lucide-react'
import { Button } from './Button'
import { Select } from './Select'

export interface Column<T extends Record<string, any>> {
  header: string
  accessor: keyof T | ((row: T) => React.ReactNode)
  sortable?: boolean
  sortKey?: keyof T
}

export interface DataTableProps<T extends Record<string, any>> {
  columns: Column<T>[]
  data: T[]
  pageSize?: number
  searchPlaceholder?: string
  searchKeys?: (keyof T)[]
  filterKey?: keyof T
  filterOptions?: { label: string; value: string }[]
  filterPlaceholder?: string
}

export function DataTable<T extends Record<string, any>>({
  columns,
  data,
  pageSize = 5,
  searchPlaceholder = 'Search...',
  searchKeys,
  filterKey,
  filterOptions,
  filterPlaceholder = 'All Categories',
}: DataTableProps<T>) {
  const [searchQuery, setSearchQuery] = useState('')
  const [filterValue, setFilterValue] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [sortConfig, setSortConfig] = useState<{ key: keyof T; direction: 'asc' | 'desc' } | null>(null)

  // 1. Reset page when search or filter values change
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value)
    setCurrentPage(1)
  }

  const handleFilterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setFilterValue(e.target.value)
    setCurrentPage(1)
  }

  // 2. Filter data
  const filteredData = useMemo(() => {
    let result = [...data]

    // Apply category filter
    if (filterKey && filterValue) {
      result = result.filter((row) => {
        const val = row[filterKey]
        return String(val).toLowerCase() === filterValue.toLowerCase()
      })
    }

    // Apply text search
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase()
      result = result.filter((row) => {
        const keysToSearch = searchKeys || (Object.keys(row) as (keyof T)[])
        return keysToSearch.some((key) => {
          const val = row[key]
          return String(val).toLowerCase().includes(query)
        })
      })
    }

    return result
  }, [data, searchQuery, filterValue, filterKey, searchKeys])

  // 3. Sort data
  const sortedData = useMemo(() => {
    const result = [...filteredData]
    if (sortConfig !== null) {
      result.sort((a, b) => {
        const aValue = a[sortConfig.key]
        const bValue = b[sortConfig.key]

        if (aValue === undefined || aValue === null) return 1
        if (bValue === undefined || bValue === null) return -1

        if (aValue < bValue) {
          return sortConfig.direction === 'asc' ? -1 : 1
        }
        if (aValue > bValue) {
          return sortConfig.direction === 'asc' ? 1 : -1
        }
        return 0
      })
    }
    return result
  }, [filteredData, sortConfig])

  // 4. Paginate data
  const totalPages = Math.max(Math.ceil(sortedData.length / pageSize), 1)
  const paginatedData = useMemo(() => {
    const start = (currentPage - 1) * pageSize
    const end = start + pageSize
    return sortedData.slice(start, end)
  }, [sortedData, currentPage, pageSize])

  // Sort toggle handler
  const requestSort = (key: keyof T) => {
    let direction: 'asc' | 'desc' = 'asc'
    if (sortConfig && sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc'
    }
    setSortConfig({ key, direction })
    setCurrentPage(1)
  }

  const renderSortIcon = (column: Column<T>) => {
    if (!column.sortable) return null
    const key = column.sortKey || (typeof column.accessor === 'string' ? (column.accessor as keyof T) : undefined)
    if (!key) return null

    if (sortConfig?.key === key) {
      return sortConfig.direction === 'asc' ? (
        <ArrowUp className="ml-1.5 h-3.5 w-3.5 text-violet-650 dark:text-violet-400" />
      ) : (
        <ArrowDown className="ml-1.5 h-3.5 w-3.5 text-violet-655 dark:text-violet-400" />
      )
    }
    return <ArrowUpDown className="ml-1.5 h-3.5 w-3.5 text-slate-400 group-hover:text-slate-600" />
  }

  return (
    <div className="space-y-4">
      {/* Search & Filter Toolbar */}
      <div className="flex flex-col sm:flex-row items-center gap-4">
        {/* Custom styled search container inside table */}
        <div className="relative flex-1 w-full text-left">
          <div className="absolute left-3.5 top-1/2 transform -translate-y-1/2 text-slate-400 pointer-events-none">
            <Search className="h-4.5 w-4.5" />
          </div>
          <input
            type="text"
            placeholder={searchPlaceholder}
            value={searchQuery}
            onChange={handleSearchChange}
            className="pl-11 pr-4 py-2.5 border border-slate-200 dark:border-slate-700 rounded-xl text-sm w-full bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent transition"
          />
        </div>

        {/* Filter dropdown */}
        {filterKey && filterOptions && (
          <div className="w-full sm:w-60">
            <Select
              options={filterOptions}
              value={filterValue}
              onChange={handleFilterChange}
              placeholder={filterPlaceholder}
              className="!py-2.5"
            />
          </div>
        )}
      </div>

      {/* Responsive Table Wrapper */}
      <div className="overflow-x-auto rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 shadow-sm">
        <table className="min-w-full divide-y divide-slate-200 dark:divide-slate-700 text-left">
          <thead className="bg-slate-50 dark:bg-slate-900/60 select-none">
            <tr>
              {columns.map((column, index) => {
                const sortKey =
                  column.sortKey || (typeof column.accessor === 'string' ? (column.accessor as keyof T) : undefined)
                const isSortable = column.sortable && sortKey

                return (
                  <th
                    key={index}
                    scope="col"
                    onClick={() => isSortable && requestSort(sortKey)}
                    className={`px-6 py-4.5 text-xs font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider ${
                      isSortable ? 'cursor-pointer group hover:bg-slate-100 dark:hover:bg-slate-700/40 transition' : ''
                    }`}
                  >
                    <div className="flex items-center">
                      {column.header}
                      {isSortable && renderSortIcon(column)}
                    </div>
                  </th>
                )
              })}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-700 bg-white dark:bg-slate-800 text-sm">
            {paginatedData.length === 0 ? (
              <tr>
                <td colSpan={columns.length} className="px-6 py-12 text-center text-slate-400 dark:text-slate-500">
                  No records found.
                </td>
              </tr>
            ) : (
              paginatedData.map((row, rowIndex) => (
                <tr
                  key={rowIndex}
                  className="hover:bg-slate-50/50 dark:hover:bg-slate-700/30 transition-colors duration-150"
                >
                  {columns.map((column, colIndex) => {
                    const cellContent =
                      typeof column.accessor === 'function'
                        ? column.accessor(row)
                        : (row[column.accessor] as React.ReactNode)

                    return (
                      <td key={colIndex} className="px-6 py-4 text-slate-800 dark:text-slate-200 whitespace-nowrap">
                        {cellContent}
                      </td>
                    )
                  })}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Footer */}
      {sortedData.length > pageSize && (
        <div className="flex items-center justify-between px-2 py-1 select-none">
          <div className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
            Showing{' '}
            <span className="font-semibold text-slate-800 dark:text-slate-200">
              {Math.min((currentPage - 1) * pageSize + 1, sortedData.length)}
            </span>{' '}
            to{' '}
            <span className="font-semibold text-slate-800 dark:text-slate-200">
              {Math.min(currentPage * pageSize, sortedData.length)}
            </span>{' '}
            of <span className="font-semibold text-slate-800 dark:text-slate-200">{sortedData.length}</span> entries
          </div>

          <div className="flex items-center space-x-1.5">
            <Button
              variant="secondary"
              size="sm"
              disabled={currentPage === 1}
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              className="p-2 min-h-0 cursor-pointer"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            
            {Array.from({ length: totalPages }).map((_, idx) => {
              const pageNumber = idx + 1
              const isActive = currentPage === pageNumber
              
              // Only render numbers close to active page for huge sheets
              if (totalPages > 5 && Math.abs(currentPage - pageNumber) > 1 && pageNumber !== 1 && pageNumber !== totalPages) {
                if (pageNumber === 2 || pageNumber === totalPages - 1) {
                  return <span key={idx} className="px-1.5 text-slate-400">...</span>
                }
                return null
              }

              return (
                <Button
                  key={idx}
                  variant={isActive ? 'primary' : 'secondary'}
                  size="sm"
                  onClick={() => setCurrentPage(pageNumber)}
                  className={`px-3 py-1.5 min-h-0 cursor-pointer ${isActive ? 'shadow-inner scale-95' : ''}`}
                >
                  {pageNumber}
                </Button>
              )
            })}

            <Button
              variant="secondary"
              size="sm"
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
              className="p-2 min-h-0 cursor-pointer"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}
