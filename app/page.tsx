'use client'

import { useState, useEffect } from 'react'
import AddLinkForm from '@/components/AddLinkForm'
import LinkTable from '@/components/LinkTable'
import SearchBar from '@/components/SearchBar'

interface Link {
  id: string
  code: string
  targetUrl: string
  totalClicks: number
  lastClickedAt: string | null
  createdAt: string
}

export default function Dashboard() {
  const [links, setLinks] = useState<Link[]>([])
  const [filteredLinks, setFilteredLinks] = useState<Link[]>([])
  const [searchQuery, setSearchQuery] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const fetchLinks = async () => {
    try {
      setLoading(true)
      setError('')
      const response = await fetch('/api/links')
      if (!response.ok) {
        throw new Error('Failed to fetch links')
      }
      const data = await response.json()
      setLinks(data)
      setFilteredLinks(data)
    } catch (err) {
      setError('Failed to load links. Please refresh the page.')
      console.error('Error fetching links:', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchLinks()
  }, [])

  useEffect(() => {
    if (!searchQuery.trim()) {
      setFilteredLinks(links)
      return
    }

    const query = searchQuery.toLowerCase()
    const filtered = links.filter(
      (link) =>
        link.code.toLowerCase().includes(query) ||
        link.targetUrl.toLowerCase().includes(query)
    )
    setFilteredLinks(filtered)
  }, [searchQuery, links])

  const handleDelete = (code: string) => {
    setLinks(links.filter((link) => link.code !== code))
    setFilteredLinks(filteredLinks.filter((link) => link.code !== code))
  }

  const baseUrl =
    typeof window !== 'undefined' ? window.location.origin : undefined

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">TinyLink</h1>
          <p className="mt-2 text-gray-600">
            Shorten URLs, track clicks, and manage your links
          </p>
        </div>

        {/* Add Link Form */}
        <div className="mb-8">
          <AddLinkForm onSuccess={fetchLinks} />
        </div>

        {/* Search Bar */}
        <div className="mb-6">
          <SearchBar value={searchQuery} onChange={setSearchQuery} />
        </div>

        {/* Links Table */}
        {loading ? (
          <div className="bg-white rounded-lg shadow-md p-12 text-center">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <p className="mt-4 text-gray-600">Loading links...</p>
          </div>
        ) : error ? (
          <div className="bg-red-50 border border-red-200 rounded-lg p-6">
            <p className="text-red-600">{error}</p>
            <button
              onClick={fetchLinks}
              className="mt-4 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
            >
              Retry
            </button>
          </div>
        ) : (
          <LinkTable links={filteredLinks} onDelete={handleDelete} baseUrl={baseUrl} />
        )}

        {/* Results count */}
        {!loading && !error && (
          <div className="mt-4 text-sm text-gray-600">
            Showing {filteredLinks.length} of {links.length} link{links.length !== 1 ? 's' : ''}
          </div>
        )}
      </div>
    </div>
  )
}
