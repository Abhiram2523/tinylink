import { notFound } from 'next/navigation'
import Link from 'next/link'
import { prisma } from '@/lib/prisma'
import { formatDate, getShortUrl } from '@/lib/utils'
import CopyButton from '@/components/CopyButton'

interface PageProps {
  params: Promise<{
    code: string
  }>
}

export default async function StatsPage({ params }: PageProps) {
  const { code } = await params

  const link = await prisma.link.findUnique({
    where: { code },
  })

  if (!link) {
    notFound()
  }

  const shortUrl = getShortUrl(code)

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <Link
            href="/"
            className="text-blue-600 hover:text-blue-800 mb-4 inline-block"
          >
            ← Back to Dashboard
          </Link>
          <h1 className="text-3xl font-bold text-gray-900">Link Statistics</h1>
        </div>

        {/* Stats Card */}
        <div className="bg-white rounded-lg shadow-md p-6 space-y-6">
          {/* Code */}
          <div>
            <label className="block text-sm font-medium text-gray-500 mb-1">
              Short Code
            </label>
            <div className="flex items-center gap-2">
              <p className="text-lg font-mono font-semibold text-gray-900">
                {link.code}
              </p>
              <a
                href={shortUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-blue-600 hover:text-blue-800"
              >
                {shortUrl}
              </a>
            </div>
          </div>

          {/* Target URL */}
          <div>
            <label className="block text-sm font-medium text-gray-500 mb-1">
              Target URL
            </label>
            <a
              href={link.targetUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:text-blue-800 break-all"
            >
              {link.targetUrl}
            </a>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t border-gray-200">
            <div>
              <label className="block text-sm font-medium text-gray-500 mb-1">
                Total Clicks
              </label>
              <p className="text-2xl font-bold text-gray-900">
                {link.totalClicks}
              </p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-500 mb-1">
                Last Clicked
              </label>
              <p className="text-lg text-gray-900">
                {formatDate(link.lastClickedAt)}
              </p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-500 mb-1">
                Created
              </label>
              <p className="text-lg text-gray-900">
                {formatDate(link.createdAt)}
              </p>
            </div>
          </div>

          {/* Actions */}
          <div className="pt-4 border-t border-gray-200 flex gap-4">
            <a
              href={shortUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Test Redirect
            </a>
            <CopyButton text={shortUrl} />
          </div>
        </div>
      </div>
    </div>
  )
}

