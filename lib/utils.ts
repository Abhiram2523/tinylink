// Format date for display
export function formatDate(date: Date | string | null | undefined): string {
  if (!date) return 'Never'
  const d = typeof date === 'string' ? new Date(date) : date
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(d)
}

// Truncate URL for display
export function truncateUrl(url: string, maxLength: number = 50): string {
  if (url.length <= maxLength) return url
  return url.substring(0, maxLength - 3) + '...'
}

// Get full short URL
export function getShortUrl(code: string, baseUrl?: string): string {
  const base = baseUrl || process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'
  return `${base}/${code}`
}

