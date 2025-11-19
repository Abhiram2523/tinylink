export default function HealthzPage() {
  // Health status - API route handles the actual check
  const healthStatus = { ok: true, version: '1.0' }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="bg-white rounded-lg shadow-md p-8 max-w-md w-full">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">System Health</h1>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-gray-600">Status:</span>
            <span className={`font-semibold ${healthStatus.ok ? 'text-green-600' : 'text-red-600'}`}>
              {healthStatus.ok ? 'OK' : 'ERROR'}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-gray-600">Version:</span>
            <span className="font-mono">{healthStatus.version}</span>
          </div>
          <div className="mt-6 pt-6 border-t border-gray-200">
            <p className="text-sm text-gray-500">
              API endpoint: <code className="font-mono text-xs">/api/healthz</code>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

