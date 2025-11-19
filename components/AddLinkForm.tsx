'use client'

import { useState } from 'react'
import { isValidUrl, isValidCode } from '@/lib/validations'

interface AddLinkFormProps {
  onSuccess: () => void
}

export default function AddLinkForm({ onSuccess }: AddLinkFormProps) {
  const [url, setUrl] = useState('')
  const [customCode, setCustomCode] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [urlError, setUrlError] = useState('')
  const [codeError, setCodeError] = useState('')

  const validateUrl = (value: string) => {
    if (!value) {
      setUrlError('URL is required')
      return false
    }
    if (!isValidUrl(value)) {
      setUrlError('Please enter a valid URL')
      return false
    }
    setUrlError('')
    return true
  }

  const validateCode = (value: string) => {
    if (value && !isValidCode(value)) {
      setCodeError('Code must be 6-8 alphanumeric characters')
      return false
    }
    setCodeError('')
    return true
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    // Validate inputs
    if (!validateUrl(url)) return
    if (!validateCode(customCode)) return

    setLoading(true)

    try {
      const body: { targetUrl: string; code?: string } = { targetUrl: url }
      if (customCode.trim()) {
        body.code = customCode.trim()
      }

      const response = await fetch('/api/links', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
      })

      const data = await response.json()

      if (!response.ok) {
        if (response.status === 409) {
          setError('This code already exists. Please choose a different one.')
        } else {
          setError(data.error || 'Failed to create link')
        }
        setLoading(false)
        return
      }

      // Success - reset form and refresh
      setUrl('')
      setCustomCode('')
      setError('')
      setUrlError('')
      setCodeError('')
      onSuccess()
    } catch (err) {
      setError('An error occurred. Please try again.')
      console.error('Error creating link:', err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 bg-white p-6 rounded-lg shadow-md">
      <div>
        <label htmlFor="url" className="block text-sm font-medium text-gray-700 mb-2">
          Long URL *
        </label>
        <input
          id="url"
          type="text"
          value={url}
          onChange={(e) => {
            setUrl(e.target.value)
            if (urlError) validateUrl(e.target.value)
          }}
          onBlur={(e) => validateUrl(e.target.value)}
          placeholder="https://example.com/very/long/url"
          className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 ${
            urlError
              ? 'border-red-500 focus:ring-red-500'
              : 'border-gray-300 focus:ring-blue-500'
          }`}
          disabled={loading}
        />
        {urlError && <p className="mt-1 text-sm text-red-600">{urlError}</p>}
      </div>

      <div>
        <label htmlFor="code" className="block text-sm font-medium text-gray-700 mb-2">
          Custom Code (optional)
        </label>
        <input
          id="code"
          type="text"
          value={customCode}
          onChange={(e) => {
            setCustomCode(e.target.value)
            if (codeError) validateCode(e.target.value)
          }}
          onBlur={(e) => validateCode(e.target.value)}
          placeholder="6-8 alphanumeric characters"
          className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 ${
            codeError
              ? 'border-red-500 focus:ring-red-500'
              : 'border-gray-300 focus:ring-blue-500'
          }`}
          disabled={loading}
        />
        {codeError && <p className="mt-1 text-sm text-red-600">{codeError}</p>}
        <p className="mt-1 text-xs text-gray-500">
          Leave empty to generate automatically
        </p>
      </div>

      {error && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-sm text-red-600">{error}</p>
        </div>
      )}

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
      >
        {loading ? 'Creating...' : 'Create Short Link'}
      </button>
    </form>
  )
}

