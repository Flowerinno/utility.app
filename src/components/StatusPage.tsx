import { Suspense } from "react"

const URLs = [
  'https://api.medicard-assistant.com/api/health-check',
  'https://api.thefishassistant.com/api/health',
  'https://api.usafishassistant.com/api/health',
  'https://api.usafishingportal.com/api/health-check',
  'https://api.thefishassistant.ca/api/health-check',
]

type HealthStatus = {
  url: string
  status: 'success' | 'failed' | 'error'
  statusCode?: number
  error?: string
}

async function checkHealth(url: string): Promise<HealthStatus> {
  try {
    const response = await fetch(url)
    if (response.ok) {
      return { url, status: 'success', statusCode: response.status }
    } else {
      return { url, status: 'failed', statusCode: response.status }
    }
  } catch (error) {
    return { 
      url, 
      status: 'error', 
      error: error instanceof Error ? error.message : 'Unknown error' 
    }
  }
}

async function runHealthChecks(): Promise<HealthStatus[]> {
  const results = await Promise.all(URLs.map(url => checkHealth(url)))
  return results
}

export async function StatusPage() {
  const healthStatuses = await runHealthChecks()

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">API Health Status</h1>
      <div className="grid grid-cols-2 gap-4">
        {healthStatuses.map((status, idx) => (
          <Suspense key={idx} fallback={<div>Loading status for {status.url}...</div>}>
          <div
            key={status.url}
            className={`p-4 rounded-lg border-2 ${
              status.status === 'success'
                ? 'bg-green-50 border-green-500'
                : status.status === 'failed'
                ? 'bg-yellow-50 border-yellow-500'
                : 'bg-red-50 border-red-500'
            }`}
          >
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <p className="font-mono text-sm break-all text-black">{status.url.split('https://api.')[1]}</p>
                {status.statusCode && (
                  <p className="text-xs text-gray-600 mt-1">
                    Status Code: {status.statusCode}
                  </p>
                )}
                {status.error && (
                  <p className="text-xs text-red-600 mt-1">
                    Error: {status.error}
                  </p>
                )}
              </div>
              <div className="ml-4">
                <span
                  className={`px-3 py-1 rounded-full text-sm font-semibold ${
                    status.status === 'success'
                      ? 'bg-green-500 text-white'
                      : status.status === 'failed'
                      ? 'bg-yellow-500 text-white'
                      : 'bg-red-500 text-white'
                  }`}
                >
                  {status.status.toUpperCase()}
                </span>
              </div>
            </div>
          </div>
          </Suspense>
        ))}
      </div>
    </div>
  )
}

export default StatusPage