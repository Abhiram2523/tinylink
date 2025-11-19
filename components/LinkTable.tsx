'use client'

import { useState } from 'react'
import { truncateUrl, formatDate, getShortUrl } from '@/lib/utils'

interface Link {
  id: string
  code: string
  targetUrl: string
  totalClicks: number
  lastClickedAt: string | null
  createdAt: string
}

interface LinkTableProps {
  links: Link[]
  onDelete: (code: string) => void
  baseUrl?: string
}

export default function LinkTable({ links, onDelete, baseUrl }: LinkTableProps) {
  const [copiedCode, setCopiedCode] = useState<string | null>(null)
  const [deletingCode, setDeletingCode] = useState<string | null>(null)

  const copyToClipboard = async (code: string) => {
    const shortUrl = getShortUrl(code, baseUrl)
    try {
      await navigator.clipboard.writeText(shortUrl)
      setCopiedCode(code)
      setTimeout(() => setCopiedCode(null), 2000)
    } catch (err) {
      console.error('Failed to copy:', err)
    }
  }

  const handleDelete = async (code: string) => {
    if (!confirm('Are you sure you want to delete this link?')) return

    setDeletingCode(code)
    try {
      const response = await fetch(`/api/links/${code}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        onDelete(code)
      } else {
        alert('Failed to delete link')
      }
    } catch (err) {
      console.error('Error deleting link:', err)
      alert('An error occurred while deleting')
    } finally {
      setDeletingCode(null)
    }
  }

  if (links.length === 0) {
    return (
      <div className="text-center py-12 bg-white rounded-lg shadow-md">
        <svg
          className="mx-auto h-12 w-12 text-gray-400"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"
          />
        </svg>
        <h3 className="mt-2 text-sm font-medium text-gray-900">No links</h3>
        <p className="mt-1 text-sm text-gray-500">
          Get started by creating a new short link.
        </p>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      {/* Desktop Table View */}
      <div className="hidden md:block overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Short Code
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Target URL
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Clicks
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Last Clicked
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {links.map((link) => {
              const shortUrl = getShortUrl(link.code, baseUrl)
              return (
                <tr key={link.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-2">
                      <a
                        href={`/code/${link.code}`}
                        className="text-sm font-medium text-blue-600 hover:text-blue-800"
                      >
                        {link.code}
                      </a>
                      <button
                        onClick={() => copyToClipboard(link.code)}
                        className="text-gray-400 hover:text-gray-600"
                        title="Copy URL"
                      >
                        {copiedCode === link.code ? (
                          <svg
                            className="h-4 w-4 text-green-500"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M5 13l4 4L19 7"
                            />
                          </svg>
                        ) : (
                          <svg
                            className="h-4 w-4"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
                            />
                          </svg>
                        )}
                      </button>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">{shortUrl}</p>
                  </td>
                  <td className="px-6 py-4">
                    <a
                      href={link.targetUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-gray-900 hover:text-blue-600"
                      title={link.targetUrl}
                    >
                      {truncateUrl(link.targetUrl, 50)}
                    </a>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {link.totalClicks}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {formatDate(link.lastClickedAt)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button
                      onClick={() => handleDelete(link.code)}
                      disabled={deletingCode === link.code}
                      className="text-red-600 hover:text-red-900 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {deletingCode === link.code ? 'Deleting...' : 'Delete'}
                    </button>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>

      {/* Mobile Card View */}
      <div className="md:hidden divide-y divide-gray-200">
        {links.map((link) => {
          const shortUrl = getShortUrl(link.code, baseUrl)
          return (
            <div key={link.id} className="p-4 hover:bg-gray-50">
              <div className="flex items-start justify-between mb-2">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <a
                      href={`/code/${link.code}`}
                      className="text-sm font-medium text-blue-600 hover:text-blue-800"
                    >
                      {link.code}
                    </a>
                    <button
                      onClick={() => copyToClipboard(link.code)}
                      className="text-gray-400 hover:text-gray-600"
                      title="Copy URL"
                    >
                      {copiedCode === link.code ? (
                        <svg
                          className="h-4 w-4 text-green-500"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M5 13l4 4L19 7"
                          />
                        </svg>
                      ) : (
                        <svg
                          className="h-4 w-4"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
                          />
                        </svg>
                      )}
                    </button>
                  </div>
                  <p className="text-xs text-gray-500 mb-2">{shortUrl}</p>
                  <a
                    href={link.targetUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-gray-900 hover:text-blue-600 break-all"
                    title={link.targetUrl}
                  >
                    {truncateUrl(link.targetUrl, 40)}
                  </a>
                </div>
                <button
                  onClick={() => handleDelete(link.code)}
                  disabled={deletingCode === link.code}
                  className="ml-2 text-red-600 hover:text-red-900 disabled:opacity-50 disabled:cursor-not-allowed text-sm"
                >
                  {deletingCode === link.code ? '...' : '✕'}
                </button>
              </div>
              <div className="flex items-center gap-4 text-xs text-gray-500 mt-2">
                <span>{link.totalClicks} clicks</span>
                <span>•</span>
                <span>{formatDate(link.lastClickedAt)}</span>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

